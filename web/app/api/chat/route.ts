import OpenAI from 'openai'
import { TOOL_SCHEMAS, dispatchTool } from '@/lib/tools'

export const runtime = 'edge'

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

// Model tiers — auto-selected based on what the agent is doing
const FAST_MODEL  = process.env.ANTHROPIC_API_KEY ? 'claude-haiku-4-5-20251001' : 'llama-3.1-8b-instant'
const SMART_MODEL = process.env.ANTHROPIC_API_KEY ? 'claude-haiku-4-5-20251001' : 'llama-3.3-70b-versatile'

const SMART_TOOLS = new Set([
  'generate_operating_agreement',
  'generate_launch_checklist',
  'recommend_entity_type',
])

function pickModel(messages: { role: string; content: string }[]): string {
  const last = (messages[messages.length - 1]?.content ?? '').toLowerCase()
  const heavy = [
    'operating agreement', 'draft', 'checklist', 'recommend',
    'entity', 'llc', 's-corp', 'sole prop', 'corporation',
    'file', 'formation', 'ein', 'register',
  ]
  return heavy.some(t => last.includes(t)) ? SMART_MODEL : FAST_MODEL
}

export async function POST(req: Request) {
  // Build-safe: provide fallback so SDK never throws at module evaluation
  const groqKey = (process.env.GROQ_API_KEY ?? 'sk-placeholder')

  const { messages } = await req.json()

  const client = new OpenAI({
    apiKey: groqKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  const model = pickModel(messages)
  const encoder = new TextEncoder()

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
        const currentMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ]

        // Stream model info to client
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'model', model })}\n\n`
        ))

        let activeModel = model

        while (true) {
          const response = await client.chat.completions.create({
            model: activeModel,
            max_tokens: 4096,
            tools,
            tool_choice: 'auto',
            messages: currentMessages,
          })

          const choice = response.choices[0]
          const msg = choice.message

          if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
            currentMessages.push(msg)

            // Escalate to smart model if a heavy tool is called
            for (const tc of msg.tool_calls) {
              if (SMART_TOOLS.has(tc.function.name) && activeModel === FAST_MODEL) {
                activeModel = SMART_MODEL
                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({ type: 'model', model: activeModel })}\n\n`
                ))
              }
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

          const fullText = msg.content || ''
          const chunkSize = 50
          for (let i = 0; i < fullText.length; i += chunkSize) {
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'text', content: fullText.slice(i, i + chunkSize) })}\n\n`
            ))
            await new Promise(r => setTimeout(r, 8))
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
