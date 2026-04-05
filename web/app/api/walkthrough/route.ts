import Anthropic from '@anthropic-ai/sdk'



const MODEL = 'claude-haiku-4-5-20251001'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing',
})

export async function POST(req: Request) {
  try {
    const { task, profile } = await req.json()

    const systemPrompt = `You are a practical business formation advisor helping a founder start a ${profile?.businessType || 'small'} business${profile?.state ? ` in ${profile.state}` : ''}. Your job is to turn a checklist task into a clear, step-by-step walkthrough.

Respond with JSON only in this exact shape:
{
  "why": "One sentence explaining why this task matters for their specific business",
  "steps": ["Specific step 1", "Specific step 2", ...],
  "warnings": ["Critical warning if any — leave empty array if none"],
  "time_estimate": "Realistic time estimate, e.g. '15 minutes online'"
}

Rules:
- 3 to 7 steps, each concrete and actionable (start with a verb)
- Steps should be specific to their state and entity type when relevant
- warnings array can be empty — only include if genuinely important
- Keep language plain, no jargon`

    const userContent = [
      `Task: ${task.task}`,
      task.fee ? `Cost: ${task.fee}` : '',
      task.time ? `Typical time: ${task.time}` : '',
      task.note ? `Context note: ${task.note}` : '',
      task.link ? `Official link: ${task.link}` : '',
      '',
      `Founder context:`,
      `- State: ${profile?.state || 'unknown'}`,
      `- Entity type: ${profile?.entityType || 'llc'}`,
      `- Business type: ${profile?.businessType || 'unknown'}`,
      `- Has employees: ${profile?.hasEmployees ? 'yes' : 'no'}`,
    ].filter(Boolean).join('\n')

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 900,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as Anthropic.TextBlock).text)
      .join('')

    const data = JSON.parse(raw)
    return Response.json(data)
  } catch (err) {
    console.error('Walkthrough error:', err)
    return Response.json({ error: 'Failed to generate walkthrough' }, { status: 500 })
  }
}
