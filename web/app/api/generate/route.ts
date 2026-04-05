import Anthropic from '@anthropic-ai/sdk'
import { dispatchTool, TOOL_SCHEMAS } from '@/lib/tools'
import type { FounderProfile } from '@/lib/types'



const MODEL = 'claude-haiku-4-5-20251001'

function buildPrompt(profile: FounderProfile): string {
  const partnerInfo = profile.structure === 'partners'
    ? `Partners: ${profile.partners.map(p => `${p.name} (${p.ownership}%)`).join(', ')}`
    : 'Structure: Single owner'

  return `You are OpenFounder. Generate a complete business formation package for this founder.

FOUNDER PROFILE:
- Name: ${profile.founderName}
- Business name: ${profile.businessName || 'not yet decided'}
- State: ${profile.state} (${profile.stateAbbr})
- Business type: ${profile.businessType}
- ${partnerInfo}
- Entity type: ${profile.entityType}
- Has employees: ${profile.hasEmployees}
- Sells products: ${profile.sellsProducts}
- Physical location: ${profile.hasPhysicalLocation}
- Plans to raise VC: ${profile.plansToRaiseVC}
- Estimated revenue: ${profile.revenueEstimate}
- Business address: ${profile.businessAddress || 'not provided'}

Call tools in this order: get_state_info, recommend_entity_type, generate_operating_agreement (if LLC), generate_launch_checklist, get_ein_guide, get_banking_guide.

Then write a warm personal summary addressing them by first name with their 3 most important next steps.`
}

export async function POST(req: Request) {
  const profile: FounderProfile = await req.json()
  const encoder = new TextEncoder()

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing',
  })

  const tools: Anthropic.Tool[] = TOOL_SCHEMAS.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool['input_schema'],
  }))

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        const messages: Anthropic.MessageParam[] = [
          { role: 'user', content: buildPrompt(profile) },
        ]

        while (true) {
          const response = await client.messages.create({
            model: MODEL,
            max_tokens: 8192,
            system: 'You are OpenFounder. Generate complete business formation packages using the provided tools.',
            tools,
            messages,
          })

          if (response.stop_reason === 'tool_use') {
            messages.push({ role: 'assistant', content: response.content })
            const toolResults: Anthropic.ToolResultBlockParam[] = []
            for (const block of response.content) {
              if (block.type === 'tool_use') {
                send({ type: 'tool_status', tool: block.name })
                const result = dispatchTool(block.name, block.input as Record<string, unknown>)
                const parsed = JSON.parse(result)
                send({ type: 'tool_result', tool: block.name, data: parsed })
                toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
              }
            }
            messages.push({ role: 'user', content: toolResults })
            continue
          }

          const summary = response.content
            .filter(b => b.type === 'text')
            .map(b => (b as Anthropic.TextBlock).text)
            .join('')

          send({ type: 'summary', content: summary })
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
