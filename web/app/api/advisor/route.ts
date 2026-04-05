import OpenAI from 'openai'
import type { FounderProfile } from '@/lib/types'

export const runtime = 'edge'

const client = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "missing",
  baseURL: 'https://api.anthropic.com/v1',
})

const MODEL = 'claude-haiku-4-5-20251001'

function buildSystemPrompt(profile: FounderProfile): string {
  const lines = [
    `You are a knowledgeable, direct business advisor for ${profile.businessName || 'this business'}.`,
    '',
    'Business profile:',
    `- Owner: ${profile.founderName || 'the founder'}`,
    `- State: ${profile.state}`,
    `- Business type: ${profile.businessType === 'other' ? profile.businessTypeOther : profile.businessType}`,
    `- Legal structure: ${profile.entityType || 'LLC'}`,
    `- Setup: ${profile.structure === 'partners' ? `${profile.partnerCount} partners` : 'solo founder'}`,
    `- Has employees: ${profile.hasEmployees ? 'yes' : 'no'}`,
    `- Sells products: ${profile.sellsProducts ? 'yes' : 'no'}`,
    `- Physical location: ${profile.hasPhysicalLocation ? 'yes' : 'no'}`,
    `- Plans to raise VC: ${profile.plansToRaiseVC ? 'yes' : 'no'}`,
    `- Revenue estimate: ${profile.revenueEstimate || 'early stage'}`,
  ]

  if (profile.businessAddress) {
    lines.push(`- Business address: ${profile.businessAddress}`)
  }

  if (profile.structure === 'partners' && profile.partners?.length) {
    lines.push(`- Partners: ${profile.partners.map(p => `${p.name} (${p.ownership}%)`).join(', ')}`)
  }

  lines.push(
    '',
    `Answer questions specifically about this business's situation. Be concrete — give specific numbers, `,
    `deadlines, and next steps for ${profile.state}. Don't be generic or hedge unnecessarily. `,
    `You're not a lawyer but you're deeply knowledgeable and actually helpful.`,
    '',
    'Keep answers focused and actionable. Use plain language. If a question is outside your knowledge, say so briefly.',
  )

  return lines.join('\n')
}

export async function POST(req: Request) {
  const { messages, profile } = await req.json() as {
    messages: OpenAI.Chat.ChatCompletionMessageParam[]
    profile: FounderProfile
  }

  const encoder = new TextEncoder()
  const systemPrompt = buildSystemPrompt(profile)

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.chat.completions.create({
          model: MODEL,
          max_tokens: 1024,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          stream: true,
        })

        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta?.content
          if (delta) {
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'text', content: delta })}\n\n`
            ))
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`
        ))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
