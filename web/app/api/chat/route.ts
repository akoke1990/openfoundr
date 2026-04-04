import OpenAI from 'openai'
import { TOOL_SCHEMAS, dispatchTool } from '@/lib/tools'

// OpenFounder uses Groq by default (free tier, open source models).
// To use Anthropic Claude instead, set ANTHROPIC_API_KEY and change
// the client below — the tool schemas and dispatch logic are identical.
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY ?? 'sk-placeholder',
  baseURL: 'https://api.groq.com/openai/v1',
})

const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are OpenFounder — a knowledgeable, warm, and practical guide that helps real people start real businesses.

Your job is to walk someone from "I have an idea" to "I am a legally operating business" — step by step, in plain English, completely free.

You guide people through four phases:
1. Legal Foundation — entity choice, operating agreement, state filing, EIN
2. Financial Infrastructure — business banking, taxes, bookkeeping
3. Digital Presence — domain, email, website
4. Operations & Compliance — licenses, permits, insurance, launch checklist

How you behave:
- Lead the conversation. Ask the right questions, don't wait for them to know what to ask.
- Be specific. "File with New York DOS — fee is $200, takes 7-10 days" beats generic advice.
- Be honest that you're not a lawyer. But don't use it as an excuse to be unhelpful.
- Always use tools for state-specific data. Never guess at fees or requirements.
- Celebrate progress. Starting a business is a big deal.

When someone first arrives, warmly introduce yourself and ask:
1. What state are they in?
2. What kind of business are they starting?
3. Are they starting alone or with partners?

Then chart a personalized path through the phases.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const encoder = new TextEncoder()

  // Convert Anthropic-style tool schemas to OpenAI format
  const tools: OpenAI.Chat.ChatCompletionTool[] = TOOL_SCHEMAS.map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }))

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Build messages with system prompt in OpenAI format
        const currentMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ]

        while (true) {
          const response = await client.chat.completions.create({
            model: MODEL,
            max_tokens: 4096,
            tools,
            tool_choice: 'auto',
            messages: currentMessages,
          })

          const choice = response.choices[0]
          const msg = choice.message

          // Handle tool calls
          if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
            currentMessages.push(msg)

            for (const tc of msg.tool_calls) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'tool_status', tool: tc.function.name })}\n\n`
              ))
              const args = JSON.parse(tc.function.arguments || '{}')
              const result = dispatchTool(tc.function.name, args)
              currentMessages.push({
                role: 'tool',
                tool_call_id: tc.id,
                content: result,
              })
            }
            continue
          }

          // Final text response — stream it
          const fullText = msg.content || ''
          const chunkSize = 50
          for (let i = 0; i < fullText.length; i += chunkSize) {
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'text', content: fullText.slice(i, i + chunkSize) })}\n\n`
            ))
            await new Promise(r => setTimeout(r, 10))
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
          break
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`
        ))
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
