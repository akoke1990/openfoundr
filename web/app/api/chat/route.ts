import Anthropic from '@anthropic-ai/sdk'
import { TOOL_SCHEMAS, dispatchTool } from '@/lib/tools'

export const runtime = 'edge'

const MODEL = 'claude-haiku-4-5-20251001'

const SYSTEM_PROMPT = `You are OpenFounder — a knowledgeable, warm, and practical guide that helps real people start real businesses.

Your job is to walk someone from "I have an idea" to "I am a legally operating business" — step by step, in plain English, completely free.

You guide people through four phases:
1. Legal Foundation — entity choice, operating agreement, state filing, EIN
2. Financial Infrastructure — business banking, taxes, bookkeeping
3. Digital Presence — domain, email, website
4. Operations & Compliance — licenses, permits, insurance, launch checklist

How you behave:
- Lead the conversation. Ask the right questions.
- Be specific with dollar amounts and deadlines.
- Be honest that you're not a lawyer, but still be helpful.
- Always use tools for state-specific data. Never guess at fees or requirements.
- Celebrate progress. Starting a business is a big deal.

When someone first arrives, warmly introduce yourself and ask:
1. What state are they in?
2. What kind of business are they starting?
3. Are they starting alone or with partners?`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing',
  })

  const tools: Anthropic.Tool[] = TOOL_SCHEMAS.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool['input_schema'],
  }))

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        const currentMessages: Anthropic.MessageParam[] = messages

        while (true) {
          const response = await client.messages.create({
            model: MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools,
            messages: currentMessages,
          })

          if (response.stop_reason === 'tool_use') {
            currentMessages.push({ role: 'assistant', content: response.content })
            const toolResults: Anthropic.ToolResultBlockParam[] = []

            for (const block of response.content) {
              if (block.type === 'tool_use') {
                send({ type: 'tool_status', tool: block.name })
                const result = dispatchTool(block.name, block.input as Record<string, unknown>)
                toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
              }
            }

            currentMessages.push({ role: 'user', content: toolResults })
            continue
          }

          const fullText = response.content
            .filter(b => b.type === 'text')
            .map(b => (b as Anthropic.TextBlock).text)
            .join('')

          const chunkSize = 50
          for (let i = 0; i < fullText.length; i += chunkSize) {
            send({ type: 'text', content: fullText.slice(i, i + chunkSize) })
            await new Promise(r => setTimeout(r, 8))
          }

          send({ type: 'done' })
          break
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        send({ type: 'error', message })
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
