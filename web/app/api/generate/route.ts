import OpenAI from 'openai'
import { dispatchTool, TOOL_SCHEMAS } from '@/lib/tools'
import type { FounderProfile } from '../../../app/start/page'

export const runtime = 'edge'

const client = () => new OpenAI({
  apiKey: process.env.GROQ_API_KEY ?? 'missing',
  baseURL: 'https://api.groq.com/openai/v1',
})

const MODEL = 'llama-3.3-70b-versatile'

function buildPrompt(profile: FounderProfile): string {
  const partnerInfo = profile.structure === 'partners'
    ? `Partners: ${profile.partners.map(p => `${p.name} (${p.ownership}%)`).join(', ')}`
    : 'Structure: Single owner'

  return `You are OpenFounder. A founder has completed our intake questionnaire. Generate their complete business formation package.

FOUNDER PROFILE:
- Name: ${profile.founderName}
- Business name: ${profile.businessName || 'not yet decided'}
- State: ${profile.state} (${profile.stateAbbr})
- Business type: ${profile.businessType}${profile.businessTypeOther ? ` — ${profile.businessTypeOther}` : ''}
- ${partnerInfo}
- Entity type: ${profile.entityType}
- Has employees: ${profile.hasEmployees}
- Sells products: ${profile.sellsProducts}
- Physical location: ${profile.hasPhysicalLocation}
- Plans to raise VC: ${profile.plansToRaiseVC}
- Estimated revenue: ${profile.revenueEstimate}
- Business address: ${profile.businessAddress || 'not provided'}

INSTRUCTIONS:
Call the following tools IN ORDER to build their complete package. Do not skip any.

1. Call get_state_info for ${profile.state} to get accurate filing data
2. Call recommend_entity_type based on their profile  
3. ${profile.entityType === 'llc' || profile.entityType === 's_corp' ? `Call generate_operating_agreement with their details` : 'Skip operating agreement — not applicable for this entity type'}
4. Call generate_launch_checklist with all their details
5. Call get_ein_guide
6. Call get_banking_guide

After all tool calls, write a warm, personal summary that:
- Addresses them by first name
- Confirms their entity choice with a brief explanation of why it fits their situation
- Highlights the 3 most important things they need to do FIRST (in order)
- Mentions any state-specific gotchas for ${profile.state} they should know about
- Ends with genuine encouragement — starting a business takes courage

Write in plain English. No jargon. Be specific with dollar amounts and deadlines from the state data.`
}

export async function POST(req: Request) {
  const profile: FounderProfile = await req.json()
  const encoder = new TextEncoder()
  const groqClient = client()

  const tools: OpenAI.Chat.ChatCompletionTool[] = TOOL_SCHEMAS.map(t => ({
    type: 'function' as const,
    function: { name: t.name, description: t.description, parameters: t.input_schema },
  }))

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: 'You are OpenFounder. Generate complete, accurate business formation packages. Always call all requested tools before writing your summary.' },
          { role: 'user', content: buildPrompt(profile) },
        ]

        const toolResults: Record<string, unknown> = {}

        // Agentic loop
        while (true) {
          const response = await groqClient.chat.completions.create({
            model: MODEL,
            max_tokens: 8192,
            tools,
            tool_choice: 'auto',
            messages,
          })

          const choice = response.choices[0]
          const msg = choice.message

          if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
            messages.push(msg)
            for (const tc of msg.tool_calls) {
              send({ type: 'tool_status', tool: tc.function.name })
              const args = JSON.parse(tc.function.arguments || '{}')
              const result = dispatchTool(tc.function.name, args)
              const parsed = JSON.parse(result)
              toolResults[tc.function.name] = parsed
              send({ type: 'tool_result', tool: tc.function.name, data: parsed })
              messages.push({ role: 'tool', tool_call_id: tc.id, content: result })
            }
            continue
          }

          // Final summary text
          const summary = msg.content || ''
          send({ type: 'summary', content: summary })
          send({ type: 'done', toolResults })
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
