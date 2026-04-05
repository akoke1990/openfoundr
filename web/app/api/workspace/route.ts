import Anthropic from '@anthropic-ai/sdk'
import { dispatchTool, TOOL_SCHEMAS } from '@/lib/tools'
import type { FounderProfile } from '@/lib/types'



const MODEL = 'claude-haiku-4-5-20251001'

// ─── Extra workspace-only tools ───────────────────────────────────────────────

const EXTRA_TOOLS = [
  {
    name: 'check_business_name',
    description: 'Check if a business name and domain (.com, .co, .io, .net) are available. Call this IMMEDIATELY whenever a user mentions a potential business name — do not wait to be asked.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The business name to check' },
        stateAbbr: { type: 'string', description: 'Two-letter state abbreviation e.g. TX' },
      },
      required: ['name'],
    },
  },
  {
    name: 'search_web',
    description: 'Search the web for current information about regulations, licenses, permits, tax rules, or any business topic not covered by other tools. Use for state-specific requirements, industry regulations, or recent changes.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query' },
      },
      required: ['query'],
    },
  },
]

const ALL_TOOL_SCHEMAS = [...TOOL_SCHEMAS, ...EXTRA_TOOLS]

const TOOL_LABELS: Record<string, string> = {
  check_business_name: 'Checking name & domain availability...',
  search_web: 'Searching the web...',
  get_state_info: 'Looking up state requirements...',
  recommend_entity_type: 'Analyzing your situation...',
  generate_operating_agreement: 'Drafting operating agreement...',
  generate_launch_checklist: 'Building your launch plan...',
  generate_client_contract: 'Drafting client contract...',
  generate_nda: 'Drafting NDA...',
  generate_invoice_template: 'Creating invoice template...',
  get_ein_guide: 'Preparing EIN guide...',
  get_banking_guide: 'Finding banking options...',
  get_website_guide: 'Researching website builders...',
  get_email_guide: 'Looking up email providers...',
  get_pos_guide: 'Comparing POS systems...',
  get_registered_agent_guide: 'Looking up registered agent services...',
  get_accounting_guide: 'Reviewing accounting software options...',
  get_business_insurance_guide: 'Researching insurance options...',
  get_trademark_guide: 'Pulling trademark guidance...',
  get_hiring_guide: 'Building your hiring checklist...',
  get_sales_tax_guide: 'Looking up sales tax rules...',
  get_s_corp_election_guide: 'Calculating S-Corp savings...',
  get_funding_guide: 'Mapping your funding options...',
}

const TOOL_CARD_TYPE: Record<string, string> = {
  check_business_name: 'name_check',
  search_web: 'search_results',
  get_state_info: 'state_info',
  recommend_entity_type: 'entity_rec',
  generate_operating_agreement: 'document',
  generate_launch_checklist: 'checklist',
  generate_client_contract: 'document',
  generate_nda: 'document',
  generate_invoice_template: 'document',
  get_ein_guide: 'ein',
  get_banking_guide: 'banking',
  get_website_guide: 'website',
  get_email_guide: 'email',
  get_pos_guide: 'pos',
  get_registered_agent_guide: 'registered_agent',
  get_accounting_guide: 'accounting',
  get_business_insurance_guide: 'insurance',
  get_trademark_guide: 'trademark',
  get_hiring_guide: 'hiring',
  get_sales_tax_guide: 'sales_tax',
  get_s_corp_election_guide: 'scorp',
  get_funding_guide: 'funding',
}

// ─── Profile fields extractable from tool args ────────────────────────────────

function extractProfileUpdates(toolName: string, args: Record<string, unknown>): Partial<FounderProfile> | null {
  const updates: Partial<FounderProfile> = {}
  if (toolName === 'check_business_name') {
    if (args.name) updates.businessName = args.name as string
    if (args.stateAbbr) updates.stateAbbr = args.stateAbbr as string
  }
  if (toolName === 'get_state_info' || toolName === 'generate_launch_checklist' || toolName === 'generate_operating_agreement') {
    if (args.state) updates.state = args.state as string
  }
  if (toolName === 'generate_launch_checklist' || toolName === 'generate_operating_agreement') {
    if (args.entity_type) updates.entityType = args.entity_type as string
    if (args.business_name) updates.businessName = args.business_name as string
    if (args.company_name) updates.businessName = args.company_name as string
    if (args.founder_name) updates.founderName = args.founder_name as string
  }
  return Object.keys(updates).length > 0 ? updates : null
}

// ─── RDAP domain check ────────────────────────────────────────────────────────

const TLDS = [
  { tld: 'com', rdap: (s: string) => `https://rdap.verisign.com/com/v1/domain/${s}.com` },
  { tld: 'co',  rdap: (s: string) => `https://rdap.nic.co/domain/${s}.co` },
  { tld: 'io',  rdap: (s: string) => `https://rdap.nic.io/domain/${s}.io` },
  { tld: 'net', rdap: (s: string) => `https://rdap.verisign.com/net/v1/domain/${s}.net` },
]

function toSlug(name: string) {
  return name.toLowerCase()
    .replace(/\s+(llc|inc|corp|ltd|co\.?)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 63)
}

async function checkBusinessName(name: string, stateAbbr = '') {
  const slug = toSlug(name)
  const domains = await Promise.all(
    TLDS.map(async ({ tld, rdap }) => {
      try {
        const res = await fetch(rdap(slug), {
          headers: { Accept: 'application/rdap+json' },
          signal: AbortSignal.timeout(5000),
        })
        return { tld, domain: `${slug}.${tld}`, status: res.status === 404 ? 'available' : 'taken' }
      } catch {
        return { tld, domain: `${slug}.${tld}`, status: 'unknown' }
      }
    })
  )
  return { slug, domains, stateAbbr }
}

// ─── Web search (Tavily) ──────────────────────────────────────────────────────

async function searchWeb(query: string) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    return { answer: null, results: [], note: 'Web search not configured — add TAVILY_API_KEY to enable.' }
  }
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.json()
  } catch (err) {
    return { answer: null, results: [], error: String(err) }
  }
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(profile: Partial<FounderProfile> | null): string {
  const hasProfile = profile && (profile.businessName || profile.state)

  const ctx = hasProfile ? [
    'CURRENT BUSINESS CONTEXT:',
    profile.founderName   ? `- Founder: ${profile.founderName}` : '',
    profile.businessName  ? `- Business: ${profile.businessName}` : '',
    profile.state         ? `- State: ${profile.state}${profile.stateAbbr ? ` (${profile.stateAbbr})` : ''}` : '',
    profile.businessType  ? `- Type: ${profile.businessType}${profile.businessTypeOther ? ` — ${profile.businessTypeOther}` : ''}` : '',
    profile.entityType    ? `- Entity: ${profile.entityType.toUpperCase()}` : '',
    profile.structure     ? `- Structure: ${profile.structure === 'partners' ? `${profile.partnerCount} partners` : 'solo'}` : '',
    profile.revenueEstimate ? `- Revenue: ${profile.revenueEstimate}` : '',
  ].filter(Boolean).join('\n')
  : 'No profile yet. Warmly greet the user and ask what kind of business they\'re thinking about and what state they\'re in. One question only.'

  return `You are OpenFounder — an AI operating system for business formation. You help founders go from idea to legally operating business.

${ctx}

TOOLS AVAILABLE:
- check_business_name: check name + domain availability — call IMMEDIATELY when a name is mentioned
- get_state_info: filing fees and requirements for any state
- recommend_entity_type: LLC vs S-Corp vs sole prop analysis
- generate_operating_agreement: full LLC operating agreement
- generate_launch_checklist: personalized step-by-step launch plan
- generate_client_contract: client service agreement
- generate_nda: mutual non-disclosure agreement
- generate_invoice_template: reusable invoice template
- get_ein_guide: EIN application walkthrough
- get_banking_guide: business banking recommendations
- get_website_guide: website builder recommendations + domain tips + launch checklist
- get_email_guide: professional email setup (Google Workspace, Microsoft 365, Zoho)
- get_pos_guide: POS system comparison (Square, Toast, Shopify POS, Clover, Lightspeed)
- get_registered_agent_guide: explain registered agents, whether required, recommend services (Northwest RA, etc.)
- get_accounting_guide: accounting software recommendations (Wave, QuickBooks, FreshBooks), tax calendar, setup checklist
- get_business_insurance_guide: insurance types needed (GL, E&O, BOP, workers comp), provider recommendations
- get_trademark_guide: trademark search, registration steps, USPTO filing, DIY vs attorney options
- get_hiring_guide: employee vs contractor classification, payroll setup, required forms, deadlines
- get_sales_tax_guide: state rates, nexus rules, registration steps, filing software (TaxJar, Avalara)
- get_s_corp_election_guide: when S-Corp saves money, Form 2553, salary vs distributions, savings estimate
- get_funding_guide: bootstrapping, SBA loans, grants, angels, VC — matched to stage and business type
- search_web: search for current regulations, licenses, permits, or any topic not covered above

RULES:
1. Keep text SHORT — 2–3 sentences max. Cards show the details.
2. USE TOOLS. Don't describe what to do — do it. Name mentioned → check_business_name. State asked → get_state_info. Client needs contract → generate_client_contract.
3. Route by topic: website → get_website_guide. Email → get_email_guide. POS → get_pos_guide. Registered agent → get_registered_agent_guide. Accounting/bookkeeping → get_accounting_guide. Insurance → get_business_insurance_guide. Trademark/brand → get_trademark_guide. Hiring/employees/contractors → get_hiring_guide. Sales tax → get_sales_tax_guide. S-Corp/tax savings → get_s_corp_election_guide. Funding/investors/loans → get_funding_guide.
4. Ask ONE question at a time when you need more info.
5. After tool results, give ONE clear next step.
6. Be specific and real. You're not a lawyer but you're genuinely knowledgeable.`
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const { messages, profile } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    profile: Partial<FounderProfile> | null
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing',
  })

  const encoder = new TextEncoder()

  const tools: Anthropic.Tool[] = ALL_TOOL_SCHEMAS.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool['input_schema'],
  }))

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        const currentMessages: Anthropic.MessageParam[] = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role, content: m.content }))

        while (true) {
          const response = await client.messages.create({
            model: MODEL,
            max_tokens: 2048,
            system: buildSystemPrompt(profile),
            tools,
            messages: currentMessages,
          })

          if (response.stop_reason === 'tool_use') {
            currentMessages.push({ role: 'assistant', content: response.content })
            const toolResults: Anthropic.ToolResultBlockParam[] = []

            for (const block of response.content) {
              if (block.type === 'tool_use') {
                const toolName = block.name
                const args = block.input as Record<string, unknown>

                send({ type: 'thinking', label: TOOL_LABELS[toolName] || 'Working...' })

                const profileUpdates = extractProfileUpdates(toolName, args)
                if (profileUpdates) send({ type: 'profile_update', updates: profileUpdates })

                let result: unknown
                if (toolName === 'check_business_name') {
                  result = await checkBusinessName(args.name as string, args.stateAbbr as string)
                } else if (toolName === 'search_web') {
                  result = await searchWeb(args.query as string)
                } else {
                  try { result = JSON.parse(dispatchTool(toolName, args)) }
                  catch { result = { error: 'Tool failed' } }
                }

                send({ type: 'card', card: { type: TOOL_CARD_TYPE[toolName] || 'generic', data: result } })
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: JSON.stringify(result),
                })
              }
            }

            currentMessages.push({ role: 'user', content: toolResults })
            continue
          }

          // end_turn — fake-chunk the text response
          const text = response.content
            .filter(b => b.type === 'text')
            .map(b => (b as Anthropic.TextBlock).text)
            .join('')

          const chunkSize = 20
          for (let i = 0; i < text.length; i += chunkSize) {
            send({ type: 'text', content: text.slice(i, i + chunkSize) })
            await new Promise(r => setTimeout(r, 6))
          }
          send({ type: 'done' })
          break
        }
      } catch (err) {
        send({ type: 'error', message: err instanceof Error ? err.message : 'Unknown error' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}
