'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FounderProfile {
  state: string
  stateAbbr: string
  businessType: string
  businessTypeOther: string
  structure: 'solo' | 'partners'
  partnerCount: number
  entityType: string
  hasEmployees: boolean
  sellsProducts: boolean
  hasPhysicalLocation: boolean
  plansToRaiseVC: boolean
  revenueEstimate: string
  founderName: string
  businessName: string
  businessAddress: string
  partners: { name: string; ownership: number }[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const US_STATES = [
  ['Alabama','AL'],['Alaska','AK'],['Arizona','AZ'],['Arkansas','AR'],
  ['California','CA'],['Colorado','CO'],['Connecticut','CT'],['Delaware','DE'],
  ['Florida','FL'],['Georgia','GA'],['Hawaii','HI'],['Idaho','ID'],
  ['Illinois','IL'],['Indiana','IN'],['Iowa','IA'],['Kansas','KS'],
  ['Kentucky','KY'],['Louisiana','LA'],['Maine','ME'],['Maryland','MD'],
  ['Massachusetts','MA'],['Michigan','MI'],['Minnesota','MN'],['Mississippi','MS'],
  ['Missouri','MO'],['Montana','MT'],['Nebraska','NE'],['Nevada','NV'],
  ['New Hampshire','NH'],['New Jersey','NJ'],['New Mexico','NM'],['New York','NY'],
  ['North Carolina','NC'],['North Dakota','ND'],['Ohio','OH'],['Oklahoma','OK'],
  ['Oregon','OR'],['Pennsylvania','PA'],['Rhode Island','RI'],['South Carolina','SC'],
  ['South Dakota','SD'],['Tennessee','TN'],['Texas','TX'],['Utah','UT'],
  ['Vermont','VT'],['Virginia','VA'],['Washington','WA'],['West Virginia','WV'],
  ['Wisconsin','WI'],['Wyoming','WY'],
]

const BUSINESS_TYPES = [
  { id: 'service', label: 'Service business', desc: 'Cleaning, consulting, design, photography, tutoring, repair, coaching' },
  { id: 'trades', label: 'Trades & contracting', desc: 'Plumbing, electric, HVAC, construction, landscaping, roofing' },
  { id: 'food', label: 'Food & beverage', desc: 'Restaurant, catering, food truck, bakery, café, meal prep' },
  { id: 'retail', label: 'Retail & products', desc: 'Online store, physical retail, wholesale, Etsy, Amazon FBA' },
  { id: 'tech', label: 'Tech & software', desc: 'App, SaaS, web development, IT services, digital marketing' },
  { id: 'health', label: 'Health & wellness', desc: 'Personal training, massage, salon, childcare, therapy practice' },
  { id: 'real_estate', label: 'Real estate', desc: 'Rental property, property management, real estate agent' },
  { id: 'other', label: 'Something else', desc: 'Describe your business in your own words' },
]

const ENTITY_TYPES = [
  {
    id: 'llc',
    label: 'LLC (Limited Liability Company)',
    desc: 'Most popular for small businesses. Protects personal assets. Simple taxes.',
    best_for: 'Most small businesses',
  },
  {
    id: 'sole_prop',
    label: 'Sole proprietorship',
    desc: 'No paperwork to form. Simple taxes. No personal asset protection.',
    best_for: 'Testing an idea, minimal risk',
  },
  {
    id: 's_corp',
    label: 'S-Corporation',
    desc: 'Can reduce self-employment taxes once earning $60k+ in profit.',
    best_for: 'Established business, $80k+ profit',
  },
  {
    id: 'c_corp',
    label: 'C-Corporation',
    desc: 'Standard choice for venture-backed startups.',
    best_for: 'Raising venture capital',
  },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

function recommendEntity(profile: Partial<FounderProfile>): string {
  if (profile.plansToRaiseVC) return 'c_corp'
  if (profile.structure === 'partners') return 'llc'
  if (profile.revenueEstimate === 'over_80k') return 's_corp'
  return 'llc'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Explainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-md)',
      padding: '10px 14px',
      marginBottom: '14px',
      fontSize: '13px',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  )
}

function LearnMore({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: 'var(--color-text-info)',
        textDecoration: 'none',
        marginBottom: '14px',
      }}
    >
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {label}
    </a>
  )
}

function OptionCard({
  selected, onClick, children
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 14px',
        border: selected ? '2px solid var(--color-border-info)' : '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        cursor: 'pointer',
        background: selected ? 'var(--color-background-info)' : 'var(--color-background-primary)',
        transition: 'all 0.12s',
        marginBottom: '8px',
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: selected ? '5px solid var(--color-text-info)' : '1.5px solid var(--color-border-secondary)',
        flexShrink: 0,
        marginTop: '2px',
        background: selected ? 'var(--color-text-info)' : 'transparent',
        boxSizing: 'border-box',
      }} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function NextBtn({ onClick, disabled, label = 'Continue →' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: '20px',
        width: '100%',
        background: disabled ? 'var(--color-border-tertiary)' : '#166534',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--border-radius-md)',
        padding: '13px',
        fontSize: '15px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 6

export default function StartPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [stateSearch, setStateSearch] = useState('')
  const [profile, setProfile] = useState<Partial<FounderProfile>>({
    structure: 'solo',
    partnerCount: 2,
    hasEmployees: false,
    sellsProducts: false,
    hasPhysicalLocation: false,
    plansToRaiseVC: false,
    partners: [{ name: '', ownership: 50 }, { name: '', ownership: 50 }],
  })

  const up = (patch: Partial<FounderProfile>) => setProfile(p => ({ ...p, ...patch }))

  const filteredStates = US_STATES.filter(([name, abbr]) =>
    name.toLowerCase().includes(stateSearch.toLowerCase()) ||
    abbr.toLowerCase().includes(stateSearch.toLowerCase())
  )

  const canProceed = [
    !!profile.state,
    !!profile.businessType,
    !!profile.structure,
    !!profile.entityType,
    true,
    !!profile.founderName,
  ][step]

  function handleSubmit() {
    const data: FounderProfile = {
      state: profile.state || '',
      stateAbbr: profile.stateAbbr || '',
      businessType: profile.businessType || '',
      businessTypeOther: profile.businessTypeOther || '',
      structure: profile.structure || 'solo',
      partnerCount: profile.partnerCount || 2,
      entityType: profile.entityType || 'llc',
      hasEmployees: profile.hasEmployees || false,
      sellsProducts: profile.sellsProducts || false,
      hasPhysicalLocation: profile.hasPhysicalLocation || false,
      plansToRaiseVC: profile.plansToRaiseVC || false,
      revenueEstimate: profile.revenueEstimate || 'unknown',
      founderName: profile.founderName || '',
      businessName: profile.businessName || '',
      businessAddress: profile.businessAddress || '',
      partners: profile.partners || [],
    }
    sessionStorage.setItem('founder_profile', JSON.stringify(data))
    router.push('/results')
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <header style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>OpenFounder</span>
        </Link>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Step {step + 1} of {TOTAL_STEPS}</span>
      </header>

      {/* Progress */}
      <div style={{ height: '3px', background: 'var(--color-border-tertiary)' }}>
        <div style={{ height: '100%', background: '#166534', width: `${progress}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '540px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Step 1: State */}
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              What state are you forming your business in?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              This determines your filing fees, requirements, and deadlines.
            </p>
            <Explainer>
              <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Why it matters:</strong> Every state has different rules. New York charges $200 to file plus a newspaper publication that can cost $1,500. Texas costs $300 but has no income tax. Delaware is standard for startups raising venture capital. Form in the state where you actually operate unless you have a specific reason not to.
            </Explainer>
            <LearnMore
              href="https://www.sba.gov/business-guide/launch-your-business/register-your-business"
              label="SBA guide: Registering your business by state"
            />
            <input
              type="text"
              placeholder="Search states..."
              value={stateSearch}
              onChange={e => setStateSearch(e.target.value)}
              style={{ width: '100%', marginBottom: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-primary)' }}>
              {filteredStates.map(([name, abbr]) => (
                <div
                  key={abbr}
                  onClick={() => { up({ state: name, stateAbbr: abbr }); setStateSearch(name) }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    background: profile.state === name ? 'var(--color-background-info)' : 'transparent',
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{abbr}</span>
                </div>
              ))}
            </div>
            <NextBtn onClick={() => setStep(1)} disabled={!profile.state} />
          </div>
        )}

        {/* Step 2: Business type */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              What kind of business are you starting?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              This shapes your permits, licenses, and insurance guidance.
            </p>
            {BUSINESS_TYPES.map(bt => (
              <OptionCard
                key={bt.id}
                selected={profile.businessType === bt.id}
                onClick={() => up({ businessType: bt.id })}
              >
                <div style={{ fontSize: '14px', fontWeight: 500, color: profile.businessType === bt.id ? 'var(--color-text-info)' : 'var(--color-text-primary)', marginBottom: '2px' }}>{bt.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{bt.desc}</div>
              </OptionCard>
            ))}
            {profile.businessType === 'other' && (
              <input
                type="text"
                placeholder="Describe your business..."
                value={profile.businessTypeOther || ''}
                onChange={e => up({ businessTypeOther: e.target.value })}
                style={{ width: '100%', marginTop: '4px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            )}
            <NextBtn onClick={() => setStep(2)} disabled={!profile.businessType} />
          </div>
        )}

        {/* Step 3: Structure */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Starting this alone or with others?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              This affects your documents and ownership structure.
            </p>
            <OptionCard selected={profile.structure === 'solo'} onClick={() => up({ structure: 'solo' })}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: profile.structure === 'solo' ? 'var(--color-text-info)' : 'var(--color-text-primary)', marginBottom: '2px' }}>Just me</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>I&apos;m the only owner — single-member structure</div>
            </OptionCard>
            <OptionCard selected={profile.structure === 'partners'} onClick={() => up({ structure: 'partners' })}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: profile.structure === 'partners' ? 'var(--color-text-info)' : 'var(--color-text-primary)', marginBottom: '2px' }}>With partners</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Two or more owners — we&apos;ll generate an operating agreement defining the split</div>
            </OptionCard>
            {profile.structure === 'partners' && (
              <div style={{ marginTop: '16px' }}>
                <Explainer>
                  <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Important:</strong> Multi-member businesses need an Operating Agreement before doing anything together — it defines who owns what, how decisions get made, and what happens if someone leaves. We&apos;ll generate one for you.
                </Explainer>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  Partner details
                </div>
                {(profile.partners || []).map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={i === 0 ? 'Your name' : `Partner ${i + 1} name`}
                      value={p.name}
                      onChange={e => {
                        const partners = [...(profile.partners || [])]
                        partners[i] = { ...partners[i], name: e.target.value }
                        up({ partners })
                      }}
                      style={{ flex: 2, fontSize: '13px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={p.ownership}
                        onChange={e => {
                          const partners = [...(profile.partners || [])]
                          partners[i] = { ...partners[i], ownership: parseInt(e.target.value) || 0 }
                          up({ partners })
                        }}
                        style={{ width: '56px', fontSize: '13px', textAlign: 'right' }}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>%</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => up({ partners: [...(profile.partners || []), { name: '', ownership: 0 }] })}
                  style={{ fontSize: '12px', color: 'var(--color-text-info)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  + Add another partner
                </button>
              </div>
            )}
            <NextBtn onClick={() => setStep(3)} disabled={!profile.structure} />
          </div>
        )}

        {/* Step 4: Entity type */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              What type of business structure?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              Not sure? Use the recommendation below based on your answers.
            </p>

            {/* Help me decide */}
            <div style={{
              background: 'var(--color-background-success)',
              border: '0.5px solid var(--color-border-success)',
              borderRadius: 'var(--border-radius-md)',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-success)' }}>Recommendation based on your answers</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-success)', marginTop: '2px' }}>
                  {recommendEntity(profile) === 'llc' && 'LLC — best fit for most small businesses'}
                  {recommendEntity(profile) === 'c_corp' && 'C-Corp (Delaware) — required for venture capital'}
                  {recommendEntity(profile) === 's_corp' && 'LLC taxed as S-Corp — saves on self-employment tax'}
                  {recommendEntity(profile) === 'sole_prop' && 'Sole proprietorship — simple start, no liability protection'}
                </div>
              </div>
              <button
                onClick={() => up({ entityType: recommendEntity(profile) })}
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'white',
                  background: '#166534',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Use this
              </button>
            </div>

            <Explainer>
              <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>LLC vs Sole prop in plain English:</strong> An LLC puts a legal wall between your business and your personal life. If your business gets sued, your house and savings are protected. A sole proprietorship has no wall — everything you own is on the line. Most small businesses should form an LLC.
            </Explainer>
            <LearnMore
              href="https://www.youtube.com/results?search_query=LLC+vs+sole+proprietorship+small+business+explained"
              label="Watch: LLC vs Sole Prop explained (YouTube)"
            />
            <LearnMore
              href="https://www.sba.gov/business-guide/launch-your-business/choose-business-structure"
              label="SBA: Choose a business structure"
            />

            {ENTITY_TYPES.map(et => (
              <OptionCard
                key={et.id}
                selected={profile.entityType === et.id}
                onClick={() => up({ entityType: et.id })}
              >
                <div style={{ fontSize: '14px', fontWeight: 500, color: profile.entityType === et.id ? 'var(--color-text-info)' : 'var(--color-text-primary)', marginBottom: '2px' }}>{et.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{et.desc}</div>
                <div style={{ fontSize: '11px', color: profile.entityType === et.id ? 'var(--color-text-info)' : 'var(--color-text-tertiary)' }}>Best for: {et.best_for}</div>
              </OptionCard>
            ))}

            {profile.entityType === 's_corp' && (
              <Explainer>
                <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>S-Corp note:</strong> You form an LLC first, then elect S-Corp tax treatment by filing Form 2553 with the IRS. This is typically worth doing when your business consistently earns $60,000+ in annual profit. We&apos;ll include guidance on timing.
              </Explainer>
            )}
            {profile.entityType === 'c_corp' && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="vc"
                    checked={profile.plansToRaiseVC || false}
                    onChange={e => up({ plansToRaiseVC: e.target.checked })}
                  />
                  <label htmlFor="vc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    I plan to raise venture capital
                  </label>
                </div>
              </div>
            )}
            <NextBtn onClick={() => setStep(4)} disabled={!profile.entityType} />
          </div>
        )}

        {/* Step 5: Details */}
        {step === 4 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              A few quick details
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              These shape your checklist, permits, and tax guidance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { key: 'hasEmployees', label: 'I plan to hire employees', desc: 'Adds payroll tax registration and workers comp to your checklist' },
                { key: 'sellsProducts', label: 'I will sell physical products', desc: 'Adds sales tax registration to your checklist' },
                { key: 'hasPhysicalLocation', label: 'I will operate from a physical location', desc: 'Adds local business license and zoning to your checklist' },
              ].map(({ key, label, desc }) => {
                const checked = profile[key as keyof typeof profile] as boolean
                return (
                  <div
                    key={key}
                    onClick={() => up({ [key]: !checked } as Partial<FounderProfile>)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 14px',
                      border: checked ? '2px solid var(--color-border-info)' : '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      cursor: 'pointer',
                      background: checked ? 'var(--color-background-info)' : 'var(--color-background-primary)',
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px', border: checked ? 'none' : '1.5px solid var(--color-border-secondary)',
                      background: checked ? 'var(--color-text-info)' : 'transparent',
                      flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: checked ? 'var(--color-text-info)' : 'var(--color-text-primary)' }}>{label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              Estimated first-year revenue
            </div>
            <Explainer>
              This helps us determine whether an S-Corp election makes sense for you and how to frame your tax guidance.
            </Explainer>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'under_25k', label: 'Under $25k' },
                { id: '25k_to_80k', label: '$25k–$80k' },
                { id: 'over_80k', label: 'Over $80k' },
                { id: 'unknown', label: 'Not sure' },
              ].map(({ id, label }) => (
                <div
                  key={id}
                  onClick={() => up({ revenueEstimate: id })}
                  style={{
                    padding: '10px 8px',
                    border: profile.revenueEstimate === id ? '2px solid var(--color-border-info)' : '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    background: profile.revenueEstimate === id ? 'var(--color-background-info)' : 'var(--color-background-primary)',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: profile.revenueEstimate === id ? 'var(--color-text-info)' : 'var(--color-text-secondary)',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <NextBtn onClick={() => setStep(5)} />
          </div>
        )}

        {/* Step 6: Personal info */}
        {step === 5 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Almost done — your details
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              Used to personalize your documents. Nothing is stored or shared.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Your full name <span style={{ color: '#dc2626' }}>*</span></div>
                <input
                  type="text"
                  placeholder="e.g. Maria Gonzalez"
                  value={profile.founderName || ''}
                  onChange={e => up({ founderName: e.target.value })}
                  style={{ width: '100%', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Business name <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>(or leave blank — we can suggest one)</span></div>
                <input
                  type="text"
                  placeholder="e.g. Sunshine Cleaning LLC"
                  value={profile.businessName || ''}
                  onChange={e => up({ businessName: e.target.value })}
                  style={{ width: '100%', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Business address <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>(optional — used in operating agreement)</span></div>
                <input
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={profile.businessAddress || ''}
                  onChange={e => up({ businessAddress: e.target.value })}
                  style={{ width: '100%', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <Explainer>
              <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>What happens next:</strong> We generate your entity recommendation, operating agreement, state filing guide, EIN walkthrough, and personalized launch checklist — all on one page you can download and keep.
            </Explainer>

            <NextBtn
              onClick={handleSubmit}
              disabled={!profile.founderName}
              label="Generate my business package →"
            />
            <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: '10px', lineHeight: 1.5 }}>
              Not legal advice. Documents are starting points — review with a licensed attorney in {profile.state || 'your state'} before signing.
            </p>
          </div>
        )}

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'transparent',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '10px',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
