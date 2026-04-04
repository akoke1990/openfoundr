'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { FounderProfile } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DomainResult { tld: string; domain: string; status: 'available' | 'taken' | 'unknown' }
interface SearchResult { title: string; url: string; content: string }

type WorkspaceCard =
  | { type: 'name_check'; data: { slug: string; domains: DomainResult[] } }
  | { type: 'state_info'; data: Record<string, unknown> }
  | { type: 'entity_rec'; data: Record<string, unknown> }
  | { type: 'checklist'; data: Record<string, unknown> }
  | { type: 'document'; data: Record<string, unknown> }
  | { type: 'ein'; data: Record<string, unknown> }
  | { type: 'banking'; data: Record<string, unknown> }
  | { type: 'website'; data: Record<string, unknown> }
  | { type: 'email'; data: Record<string, unknown> }
  | { type: 'pos'; data: Record<string, unknown> }
  | { type: 'registered_agent'; data: Record<string, unknown> }
  | { type: 'accounting'; data: Record<string, unknown> }
  | { type: 'insurance'; data: Record<string, unknown> }
  | { type: 'trademark'; data: Record<string, unknown> }
  | { type: 'hiring'; data: Record<string, unknown> }
  | { type: 'sales_tax'; data: Record<string, unknown> }
  | { type: 'scorp'; data: Record<string, unknown> }
  | { type: 'funding'; data: Record<string, unknown> }
  | { type: 'search_results'; data: { answer?: string; results: SearchResult[]; query?: string } }
  | { type: 'generic'; data: unknown }

interface WorkspaceMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  cards: WorkspaceCard[]
  thinking?: string
}

interface PendingItem { task: string; done: boolean }
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// ─── Starters ─────────────────────────────────────────────────────────────────

const STARTERS = [
  'I want to start a business — where do I begin?',
  'What\'s the difference between LLC and S-Corp?',
  'Check if my business name is available',
  'I need a contract for my clients',
  'Help me choose a website builder',
  'Set up a professional email address',
  'What POS system should I use?',
  'Draft an NDA for a potential partner',
  'Do I need a registered agent?',
  'Help me set up accounting for my business',
  'What business insurance do I need?',
  'How do I trademark my business name?',
  'How do I hire my first employee?',
  'Do I need to collect sales tax?',
  'Should I elect S-Corp status?',
  'What are my funding options?',
]

// ─── Card components ──────────────────────────────────────────────────────────

function NameCheckCard({ data }: { data: { slug: string; domains: DomainResult[] } }) {
  const color = (s: DomainResult['status']) => s === 'available' ? '#166534' : s === 'taken' ? '#dc2626' : '#9ca3af'
  const bg = (s: DomainResult['status']) => s === 'available' ? '#f0fdf4' : s === 'taken' ? '#fef2f2' : '#f9fafb'
  const border = (s: DomainResult['status']) => s === 'available' ? '#86efac' : s === 'taken' ? '#fca5a5' : '#e5e7eb'
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
        Domains for <strong style={{ color: '#111827' }}>{data.slug}</strong>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {data.domains.map(d => (
          <div key={d.tld} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: bg(d.status), border: `0.5px solid ${border(d.status)}`, borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{d.domain}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: color(d.status) }}>
              {d.status === 'available' ? '✓ Free' : d.status === 'taken' ? '✗ Taken' : '?'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StateInfoCard({ data }: { data: Record<string, unknown> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const llc = (data.llc as Record<string, any>) || {}
  const rows = [
    ['Filing name', llc.filing_name],
    ['Filing fee', llc.filing_fee != null ? `$${llc.filing_fee}` : null],
    ['Processing time', llc.processing_time_standard],
    ['Annual report', llc.annual_report?.fee != null ? `$${llc.annual_report.fee} · ${llc.annual_report.frequency}` : null],
  ].filter(([, v]) => v)
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
        {String(data.name || '')} LLC requirements
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rows.map(([label, value]) => (
          <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#6b7280' }}>{label}</span>
            <span style={{ fontWeight: 500, color: '#111827' }}>{String(value)}</span>
          </div>
        ))}
      </div>
      {llc.filing_link && (
        <a href={String(llc.filing_link)} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: '#166534', border: '0.5px solid #86efac', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none' }}>
          File online →
        </a>
      )}
    </div>
  )
}

function EntityRecCard({ data }: { data: Record<string, unknown> }) {
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Recommended entity</div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>{String(data.recommended_entity || data.entity || '')}</div>
      <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{String(data.reasoning || data.why || '')}</div>
    </div>
  )
}

function ChecklistCard({ data, onItemsExtracted }: { data: Record<string, unknown>; onItemsExtracted?: (items: PendingItem[]) => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = Array.isArray(data.sections) ? data.sections as any[] : []
  const allItems = sections.flatMap((s) => Array.isArray(s.items) ? s.items : []) as Record<string, unknown>[]

  useEffect(() => {
    if (onItemsExtracted && allItems.length > 0) {
      onItemsExtracted(allItems.slice(0, 10).map((item, i) => ({ task: String(item.task || ''), done: checked.has(i) })))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])

  useEffect(() => {
    if (onItemsExtracted && allItems.length > 0) {
      onItemsExtracted(allItems.slice(0, 10).map((item, i) => ({ task: String(item.task || ''), done: false })))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
        Launch plan · {checked.size}/{allItems.length} complete
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
        {allItems.slice(0, 15).map((item, i) => {
          const done = checked.has(i)
          return (
            <div key={i} onClick={() => setChecked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', opacity: done ? 0.5 : 1 }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0, marginTop: '2px', background: done ? '#166534' : 'transparent', border: done ? 'none' : '1.5px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done && <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span style={{ fontSize: '13px', color: '#111827', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>
                {String(item.task || '')}
                {item.fee ? <span style={{ color: '#9ca3af', marginLeft: '6px', fontSize: '12px' }}>· {String(item.fee)}</span> : null}
              </span>
            </div>
          )
        })}
        {allItems.length > 15 && <div style={{ fontSize: '12px', color: '#9ca3af' }}>+ {allItems.length - 15} more</div>}
      </div>
    </div>
  )
}

function DocumentCard({ data }: { data: Record<string, unknown> }) {
  const content = String(data.document || data.content || '')
  const title = String(data.title || data.type || 'document')
  const instructions = String(data.instructions || '')

  function download() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Document ready</div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace', background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '6px', padding: '8px 10px', maxHeight: '80px', overflow: 'hidden', marginBottom: '10px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
        {content.slice(0, 250)}…
      </div>
      {instructions && <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.5 }}>{instructions}</div>}
      <button onClick={download} style={{ fontSize: '12px', color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
        Download →
      </button>
    </div>
  )
}

function SearchCard({ data }: { data: { answer?: string; results: SearchResult[]; note?: string } }) {
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Web search results</div>
      {data.note && <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>{data.note}</div>}
      {data.answer && (
        <div style={{ fontSize: '13px', color: '#111827', lineHeight: 1.6, marginBottom: '12px', padding: '10px 12px', background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '8px' }}>
          {data.answer}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(data.results || []).slice(0, 4).map((r, i) => (
          <div key={i} style={{ paddingBottom: '8px', borderBottom: i < Math.min(data.results.length, 4) - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 500, color: '#1d4ed8', textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
              {r.title}
            </a>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{r.content?.slice(0, 140)}…</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EINCard({ data }: { data: Record<string, unknown> }) {
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>EIN Application</div>
      <div style={{ fontSize: '13px', color: '#374151', marginBottom: '10px', lineHeight: 1.5 }}>{String(data.description || 'Free IRS online application — takes about 10 minutes. Your EIN appears on screen immediately.')}</div>
      <a href={String(data.link || 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online')} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: '12px', fontWeight: 500, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '6px', padding: '6px 14px', textDecoration: 'none' }}>
        Apply on IRS.gov →
      </a>
    </div>
  )
}

function BankingCard({ data }: { data: Record<string, unknown> }) {
  const recs = Array.isArray(data.recommendations) ? data.recommendations as Record<string, unknown>[] : []
  return (
    <div style={{ marginTop: '10px', padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Banking options</div>
      {recs.slice(0, 3).map((r, i) => (
        <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: i < 2 ? '0.5px solid #e5e7eb' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(r.name)}</span>
            <span style={{ fontSize: '12px', color: '#166534', fontWeight: 500 }}>{String(r.fee)}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{String(r.why)}</div>
        </div>
      ))}
    </div>
  )
}

function WebsiteCard({ data }: { data: Record<string, unknown> }) {
  const builders = Array.isArray(data.builders) ? data.builders as Record<string, unknown>[] : []
  const checklist = Array.isArray(data.launch_checklist) ? data.launch_checklist as string[] : []
  const tips = Array.isArray(data.domain_tips) ? data.domain_tips as string[] : []
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Builders */}
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Website builders</div>
        {builders.map((b, i) => (
          <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: i < builders.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{String(b.name)}</span>
                {!!b.rating && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px' }}>{String(b.rating)}</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{String(b.price)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', lineHeight: 1.5 }}>{String(b.best_for)}</div>
            {!!b.link && <a href={String(b.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Get started →</a>}
          </div>
        ))}
      </div>
      {/* Domain tips */}
      {tips.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Domain tips</div>
          {tips.map((t, i) => <div key={i} style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px', lineHeight: 1.5 }}>• {t}</div>)}
        </div>
      )}
      {/* Launch checklist */}
      {checklist.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Launch checklist</div>
          {checklist.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px', fontSize: '12px', color: '#374151', lineHeight: 1.4 }}>
              <span style={{ color: '#9ca3af', flexShrink: 0 }}>{i + 1}.</span> {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmailCard({ data }: { data: Record<string, unknown> }) {
  const providers = Array.isArray(data.providers) ? data.providers as Record<string, unknown>[] : []
  const steps = Array.isArray(data.setup_steps) ? data.setup_steps as string[] : []
  const tips = Array.isArray(data.tips) ? data.tips as string[] : []
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Email providers</div>
        {providers.map((p, i) => (
          <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < providers.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{String(p.name)}</span>
                {!!p.rating && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px' }}>{String(p.rating)}</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{String(p.price)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px', lineHeight: 1.5 }}>{String(p.best_for)}</div>
            {!!p.link && <a href={String(p.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Get started →</a>}
          </div>
        ))}
      </div>
      {steps.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Setup steps</div>
          {steps.map((s, i) => <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px', fontSize: '12px', color: '#374151', lineHeight: 1.4 }}><span style={{ color: '#9ca3af', flexShrink: 0 }}>{i + 1}.</span> {s}</div>)}
        </div>
      )}
      {tips.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#eff6ff', border: '0.5px solid #93c5fd', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Pro tips</div>
          {tips.map((t, i) => <div key={i} style={{ fontSize: '12px', color: '#1e3a8a', marginBottom: '4px', lineHeight: 1.5 }}>• {t}</div>)}
        </div>
      )}
    </div>
  )
}

function POSCard({ data }: { data: Record<string, unknown> }) {
  const recommended = Array.isArray(data.recommended) ? data.recommended as Record<string, unknown>[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          POS systems · best for {String(data.business_type || 'your business')}
        </div>
        {recommended.map((s, i) => (
          <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < recommended.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{String(s.name)}</span>
                {!!s.rating && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px' }}>{String(s.rating)}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '5px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>📅 {String(s.monthly_cost)}</span>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>💳 {String(s.transaction_fee)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '5px', lineHeight: 1.5 }}>{String(s.best_for)}</div>
            {Array.isArray(s.pros) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                {(s.pros as string[]).slice(0, 3).map((p, pi) => (
                  <span key={pi} style={{ fontSize: '10px', color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '2px 7px' }}>✓ {p}</span>
                ))}
              </div>
            )}
            {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
          </div>
        ))}
      </div>
      {tip && (
        <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
          💡 {tip}
        </div>
      )}
    </div>
  )
}

function RegisteredAgentCard({ data }: { data: Record<string, unknown> }) {
  const services = Array.isArray(data.services) ? data.services as Record<string, unknown>[] : []
  const requirements = Array.isArray(data.requirements) ? data.requirements as string[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Registered Agent · {String(data.state || '')}
        </div>
        {!!data.what_is_it && (
          <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5, marginBottom: '12px' }}>{String(data.what_is_it)}</div>
        )}
        {requirements.length > 0 && (
          <ul style={{ margin: '0 0 12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {requirements.map((r, i) => <li key={i} style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{r}</li>)}
          </ul>
        )}
        {services.map((s, i) => (
          <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: i < services.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{String(s.name)}</span>
                {!!s.rating && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px' }}>{String(s.rating)}</span>}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{String(s.price)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', lineHeight: 1.5 }}>{String(s.best_for)}</div>
            {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
          </div>
        ))}
      </div>
      {tip && (
        <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
          💡 {tip}
        </div>
      )}
    </div>
  )
}

function AccountingCard({ data }: { data: Record<string, unknown> }) {
  const tools = Array.isArray(data.tools) ? data.tools as Record<string, unknown>[] : []
  const checklist = Array.isArray(data.setup_checklist) ? data.setup_checklist as string[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          Accounting software
        </div>
        {tools.map((t, i) => (
          <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < tools.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{String(t.name)}</span>
                {!!t.rating && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px' }}>{String(t.rating)}</span>}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{String(t.price)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', lineHeight: 1.5 }}>{String(t.best_for)}</div>
            {Array.isArray(t.pros) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '5px' }}>
                {(t.pros as string[]).slice(0, 3).map((p, pi) => (
                  <span key={pi} style={{ fontSize: '10px', color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '2px 7px' }}>✓ {p}</span>
                ))}
              </div>
            )}
            {!!t.link && <a href={String(t.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
          </div>
        ))}
      </div>
      {checklist.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Setup checklist</div>
          {checklist.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#166534', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      )}
      {tip && (
        <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
          💡 {tip}
        </div>
      )}
    </div>
  )
}

function InsuranceCard({ data }: { data: Record<string, unknown> }) {
  const coverages = Array.isArray(data.coverages) ? data.coverages as Record<string, unknown>[] : []
  const providers = Array.isArray(data.providers) ? data.providers as Record<string, unknown>[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Coverage you need</div>
        {coverages.map((c, i) => (
          <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < coverages.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(c.name)}</span>
                {!!c.required && <span style={{ fontSize: '10px', fontWeight: 600, color: '#dc2626', background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: '10px', padding: '1px 7px' }}>Required</span>}
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>{String(c.typical_cost)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(c.what_it_covers)}</div>
          </div>
        ))}
      </div>
      {providers.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Recommended providers</div>
          {providers.map((p, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(p.name)}</span>
                {!!p.link && <a href={String(p.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Get quote →</a>}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(p.best_for)}</div>
            </div>
          ))}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function TrademarkCard({ data }: { data: Record<string, unknown> }) {
  const options = Array.isArray(data.registration_options) ? data.registration_options as Record<string, unknown>[] : []
  const diyOptions = Array.isArray(data.diy_vs_attorney) ? data.diy_vs_attorney as Record<string, unknown>[] : []
  const searchFirst = data.search_first as Record<string, unknown> | undefined
  const howToSearch = Array.isArray(searchFirst?.how) ? searchFirst.how as string[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!!data.llc_vs_trademark && (
        <div style={{ padding: '12px 14px', background: '#fef9c3', border: '0.5px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#713f12', lineHeight: 1.6 }}>
          ⚠️ {String(data.llc_vs_trademark)}
        </div>
      )}
      {howToSearch.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Step 1 — Search first</div>
          {howToSearch.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#166534', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {options.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Registration options</div>
          {options.map((o, i) => (
            <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: i < options.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(o.option)}</span>
                <span style={{ fontSize: '12px', color: '#374151' }}>{String(o.cost)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{String(o.protection)} protection · {String(o.timeline)}</div>
              {!!o.link && <a href={String(o.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>File here →</a>}
            </div>
          ))}
        </div>
      )}
      {diyOptions.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>DIY vs attorney</div>
          {diyOptions.map((o, i) => (
            <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i < diyOptions.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{String(o.option)}</span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{String(o.cost)}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{String(o.risk)}</div>
            </div>
          ))}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function HiringCard({ data }: { data: Record<string, unknown> }) {
  const classTest = data.classification_test as Record<string, unknown> | undefined
  const empIndicators = Array.isArray(classTest?.employee_indicators) ? classTest.employee_indicators as string[] : []
  const conIndicators = Array.isArray(classTest?.contractor_indicators) ? classTest.contractor_indicators as string[] : []
  const empSteps = Array.isArray(data.employee_steps) ? data.employee_steps as Record<string, unknown>[] : []
  const conSteps = Array.isArray(data.contractor_steps) ? data.contractor_steps as Record<string, unknown>[] : []
  const payrollTools = Array.isArray(data.payroll_tools) ? data.payroll_tools as Record<string, unknown>[] : []
  const deadlines = Array.isArray(data.key_deadlines) ? data.key_deadlines as string[] : []
  const tip = data.tip ? String(data.tip) : ''
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(empIndicators.length > 0 || conIndicators.length > 0) && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Employee vs. Contractor</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626', marginBottom: '6px' }}>Employee signals</div>
              {empIndicators.map((s, i) => <div key={i} style={{ fontSize: '11px', color: '#374151', marginBottom: '4px', lineHeight: 1.4 }}>• {s}</div>)}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#166534', marginBottom: '6px' }}>Contractor signals</div>
              {conIndicators.map((s, i) => <div key={i} style={{ fontSize: '11px', color: '#374151', marginBottom: '4px', lineHeight: 1.4 }}>• {s}</div>)}
            </div>
          </div>
        </div>
      )}
      {empSteps.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Employee setup checklist</div>
          {empSteps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', flexShrink: 0, marginTop: '1px' }}>{i + 1}.</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{String(s.step)}</div>
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(s.detail)}</div>
                {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
              </div>
            </div>
          ))}
        </div>
      )}
      {conSteps.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Contractor setup checklist</div>
          {conSteps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', flexShrink: 0, marginTop: '1px' }}>{i + 1}.</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{String(s.step)}</div>
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(s.detail)}</div>
                {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
              </div>
            </div>
          ))}
        </div>
      )}
      {payrollTools.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Payroll software</div>
          {payrollTools.map((t, i) => (
            <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i < payrollTools.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(t.name)}</span>
                <span style={{ fontSize: '12px', color: '#374151' }}>{String(t.price)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{String(t.best_for)}</div>
              {!!t.link && <a href={String(t.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
            </div>
          ))}
        </div>
      )}
      {deadlines.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#eff6ff', border: '0.5px solid #bfdbfe', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Key deadlines</div>
          {deadlines.map((d, i) => <div key={i} style={{ fontSize: '12px', color: '#1e3a8a', marginBottom: '4px' }}>• {d}</div>)}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function SalesTaxCard({ data }: { data: Record<string, unknown> }) {
  const steps = Array.isArray(data.registration_steps) ? data.registration_steps as string[] : []
  const software = Array.isArray(data.software) ? data.software as Record<string, unknown>[] : []
  const nexusTypes = Array.isArray(data.nexus_types) ? data.nexus_types as Record<string, unknown>[] : []
  const tip = data.tip ? String(data.tip) : ''
  const hasNoTax = !!data.no_sales_tax
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: hasNoTax ? '#f0fdf4' : '#f9fafb', border: `0.5px solid ${hasNoTax ? '#86efac' : '#e5e7eb'}`, borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          {String(data.state)} Sales Tax
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '28px', fontWeight: 700, color: hasNoTax ? '#166534' : '#111827' }}>{String(data.state_rate)}</span>
          {hasNoTax && <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>No state sales tax!</span>}
        </div>
        {!!data.state_notes && <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(data.state_notes)}</div>}
        {!!data.what_is_taxable && <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5, marginTop: '8px' }}>{String(data.what_is_taxable)}</div>}
      </div>
      {nexusTypes.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Understanding nexus</div>
          {nexusTypes.map((n, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{String(n.type)}</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(n.description)}</div>
            </div>
          ))}
          {!!data.economic_nexus_threshold && (
            <div style={{ marginTop: '8px', padding: '8px 10px', background: '#fef9c3', border: '0.5px solid #fde047', borderRadius: '8px', fontSize: '12px', color: '#713f12' }}>
              ⚡ Economic nexus threshold: {String(data.economic_nexus_threshold)}
            </div>
          )}
        </div>
      )}
      {steps.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Registration steps</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {software.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Automation software</div>
          {software.map((s, i) => (
            <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i < software.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(s.name)}</span>
                <span style={{ fontSize: '12px', color: '#374151' }}>{String(s.price)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{String(s.best_for)}</div>
              {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a>}
            </div>
          ))}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function SCorpCard({ data }: { data: Record<string, unknown> }) {
  const steps = Array.isArray(data.how_to_elect) ? data.how_to_elect as Record<string, unknown>[] : []
  const downsides = Array.isArray(data.downsides) ? data.downsides as string[] : []
  const savings = data.example_savings as Record<string, unknown> | null
  const tip = data.tip ? String(data.tip) : ''
  const worthIt = !!data.is_worth_it
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '14px 16px', background: worthIt ? '#f0fdf4' : '#fef9c3', border: `0.5px solid ${worthIt ? '#86efac' : '#fde047'}`, borderRadius: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: worthIt ? '#166534' : '#713f12', marginBottom: '4px' }}>
          {worthIt ? '✓ S-Corp election likely makes sense for you' : '⏳ Not yet — revisit when profit reaches $40K–$50K/year'}
        </div>
        {!!data.break_even && <div style={{ fontSize: '12px', color: '#374151' }}>Break-even point: {String(data.break_even)}</div>}
      </div>
      {savings && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Example savings</div>
          {[
            ['Annual profit', savings.annual_profit],
            ['Reasonable salary (W-2)', savings.reasonable_salary],
            ['Distributions (no SE tax)', savings.distributions],
            ['Est. annual savings', savings.estimated_annual_savings],
          ].map(([label, val], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{String(label ?? '')}</span>
              <span style={{ fontSize: '12px', fontWeight: i === 3 ? 700 : 500, color: i === 3 ? '#166534' : '#111827' }}>{String(val)}</span>
            </div>
          ))}
          {!!savings.note && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{String(savings.note)}</div>}
        </div>
      )}
      {steps.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>How to elect S-Corp</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', flexShrink: 0, marginTop: '1px' }}>{i + 1}.</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{String(s.step)}</div>
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{String(s.detail)}</div>
                {!!s.link && <a href={String(s.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Download form →</a>}
              </div>
            </div>
          ))}
        </div>
      )}
      {downsides.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Trade-offs to know</div>
          {downsides.map((d, i) => <div key={i} style={{ fontSize: '12px', color: '#7f1d1d', marginBottom: '4px' }}>• {d}</div>)}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function FundingCard({ data }: { data: Record<string, unknown> }) {
  const options = Array.isArray(data.funding_options) ? data.funding_options as Record<string, unknown>[] : []
  const resources = Array.isArray(data.resources) ? data.resources as Record<string, unknown>[] : []
  const tip = data.tip ? String(data.tip) : ''
  const typeColor = (t: string) => t === 'equity' ? '#dc2626' : t === 'debt' ? '#d97706' : '#166534'
  const typeBg = (t: string) => t === 'equity' ? '#fef2f2' : t === 'debt' ? '#fffbeb' : '#f0fdf4'
  const typeBorder = (t: string) => t === 'equity' ? '#fca5a5' : t === 'debt' ? '#fcd34d' : '#86efac'
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!!data.summary && (
        <div style={{ padding: '12px 14px', background: '#eff6ff', border: '0.5px solid #bfdbfe', borderRadius: '10px', fontSize: '13px', color: '#1e3a8a', lineHeight: 1.6 }}>
          {String(data.summary)}
        </div>
      )}
      <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Your options</div>
        {options.map((o, i) => {
          const pros = Array.isArray(o.pros) ? o.pros as string[] : []
          const type = String(o.type || 'non-dilutive')
          return (
            <div key={i} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: i < options.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{String(o.name)}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: typeColor(type), background: typeBg(type), border: `0.5px solid ${typeBorder(type)}`, borderRadius: '10px', padding: '1px 7px', whiteSpace: 'nowrap', marginLeft: '8px' }}>{type}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{String(o.typical_amount)}</div>
              {pros.slice(0, 3).map((p, pi) => (
                <span key={pi} style={{ display: 'inline-block', fontSize: '11px', color: '#166534', background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: '10px', padding: '1px 7px', marginRight: '4px', marginBottom: '3px' }}>✓ {p}</span>
              ))}
              {!!o.link && <div style={{ marginTop: '4px' }}><a href={String(o.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1d4ed8', textDecoration: 'none' }}>Learn more →</a></div>}
            </div>
          )
        })}
      </div>
      {resources.length > 0 && (
        <div style={{ padding: '14px 16px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Free resources</div>
          {resources.map((r, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <a href={String(r.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 600, color: '#1d4ed8', textDecoration: 'none' }}>{String(r.name)}</a>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{String(r.description)}</div>
            </div>
          ))}
        </div>
      )}
      {tip && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>💡 {tip}</div>}
    </div>
  )
}

function CardRenderer({ card, onItemsExtracted }: { card: WorkspaceCard; onItemsExtracted?: (items: PendingItem[]) => void }) {
  if (card.type === 'name_check') return <NameCheckCard data={card.data} />
  if (card.type === 'state_info') return <StateInfoCard data={card.data} />
  if (card.type === 'entity_rec') return <EntityRecCard data={card.data} />
  if (card.type === 'checklist') return <ChecklistCard data={card.data} onItemsExtracted={onItemsExtracted} />
  if (card.type === 'document') return <DocumentCard data={card.data} />
  if (card.type === 'search_results') return <SearchCard data={card.data} />
  if (card.type === 'ein') return <EINCard data={card.data} />
  if (card.type === 'banking') return <BankingCard data={card.data} />
  if (card.type === 'website') return <WebsiteCard data={card.data} />
  if (card.type === 'email') return <EmailCard data={card.data} />
  if (card.type === 'pos') return <POSCard data={card.data} />
  if (card.type === 'registered_agent') return <RegisteredAgentCard data={card.data} />
  if (card.type === 'accounting') return <AccountingCard data={card.data} />
  if (card.type === 'insurance') return <InsuranceCard data={card.data} />
  if (card.type === 'trademark') return <TrademarkCard data={card.data} />
  if (card.type === 'hiring') return <HiringCard data={card.data} />
  if (card.type === 'sales_tax') return <SalesTaxCard data={card.data} />
  if (card.type === 'scorp') return <SCorpCard data={card.data} />
  if (card.type === 'funding') return <FundingCard data={card.data} />
  return null
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, onItemsExtracted }: { msg: WorkspaceMessage; onItemsExtracted?: (items: PendingItem[]) => void }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '18px' }}>
      <div style={{ maxWidth: '82%' }}>
        {msg.thinking && !msg.content && msg.cards.length === 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '12px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: '5px', height: '5px', background: '#9ca3af', borderRadius: '50%', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{msg.thinking}</span>
          </div>
        )}
        {msg.content && (
          <div style={{
            padding: '11px 15px',
            borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
            background: isUser ? '#166534' : '#fff',
            border: isUser ? 'none' : '0.5px solid #e5e7eb',
            color: isUser ? '#fff' : '#111827',
            fontSize: '14px', lineHeight: 1.65, whiteSpace: 'pre-wrap',
            boxShadow: isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            {msg.content}
          </div>
        )}
        {msg.cards.map((card, i) => <CardRenderer key={i} card={card} onItemsExtracted={onItemsExtracted} />)}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  profile, pendingItems, documents, onQuickAction,
}: {
  profile: Partial<FounderProfile> | null
  pendingItems: PendingItem[]
  documents: string[]
  onQuickAction: (text: string) => void
}) {
  const hasProfile = !!(profile?.businessName || profile?.state)
  const incomplete = pendingItems.filter(i => !i.done)

  return (
    <aside style={{ width: '210px', flexShrink: 0, borderRight: '0.5px solid #e5e7eb', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0', overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 12px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none', color: '#111827' }}>
          <span style={{ fontSize: '17px' }}>🌱</span>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>OpenFounder</span>
        </Link>
      </div>

      <div style={{ padding: '0 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Business context */}
        {hasProfile ? (
          <div style={{ padding: '12px', background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Your business</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{profile?.businessName || 'Untitled'}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {[profile?.entityType?.toUpperCase(), profile?.state].filter(Boolean).join(' · ')}
            </div>
            {profile?.founderName && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{profile.founderName}</div>}
          </div>
        ) : (
          <div style={{ padding: '12px', background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5 }}>
              Your business details will appear here as you chat.
            </div>
          </div>
        )}

        {/* Pending items */}
        {incomplete.length > 0 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Up next · {incomplete.length} remaining
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {incomplete.slice(0, 5).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1.5px solid #d1d5db', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '11px', color: '#374151', lineHeight: 1.4 }}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated documents */}
        {documents.length > 0 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Documents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {documents.map((doc, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>📄</span> {doc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Quick actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              hasProfile ? 'What\'s my next step?' : null,
              'Show my launch checklist',
              'I need a client contract',
              'Help me choose a website builder',
              'Set up professional email',
              'What POS system should I use?',
              'Check my deadlines',
            ].filter(Boolean).map(q => (
              <button key={q!} onClick={() => onQuickAction(q!)}
                style={{ textAlign: 'left', background: 'none', border: 'none', padding: '4px 2px', fontSize: '12px', color: '#374151', cursor: 'pointer', lineHeight: 1.4 }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ padding: '12px 16px', borderTop: '0.5px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link href="/start" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none' }}>Guided questionnaire →</Link>
        <Link href="/dashboard" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none' }}>Dashboard →</Link>
      </div>
    </aside>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const LS_MESSAGES = 'workspace_messages_v2'
const LS_PROFILE  = 'workspace_profile_v2'

export default function WorkspacePage() {
  const [messages, setMessages] = useState<WorkspaceMessage[]>([])
  const [profile, setProfile] = useState<Partial<FounderProfile> | null>(null)
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [saveEmail, setSaveEmail] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [showSaveBar, setShowSaveBar] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load from DB (if logged in) then fall back to localStorage
  useEffect(() => {
    async function load() {
      try {
        // Try DB first for logged-in users
        const res = await fetch('/api/workspace/load')
        const { profile: dbProfile, messages: dbMessages } = await res.json()
        if (dbMessages?.length) {
          setMessages(dbMessages)
          if (dbProfile) setProfile(dbProfile)
          return
        }
      } catch { /* fall through to localStorage */ }

      // Fall back to localStorage
      try {
        const savedMsgs = localStorage.getItem(LS_MESSAGES)
        if (savedMsgs) setMessages(JSON.parse(savedMsgs))
      } catch { /* ignore */ }

      // Profile: sessionStorage (from questionnaire) > localStorage
      try {
        const qProfile = sessionStorage.getItem('founder_profile')
        const lsProfile = localStorage.getItem(LS_PROFILE)
        const resolved = qProfile ? JSON.parse(qProfile) : lsProfile ? JSON.parse(lsProfile) : null
        if (resolved) setProfile(resolved)
      } catch { /* ignore */ }
    }
    load()
  }, [])

  // Show save bar after first completed assistant message
  useEffect(() => {
    const hasAssistantMsg = messages.some(m => m.role === 'assistant' && m.content)
    if (hasAssistantMsg && saveStatus === 'idle') setShowSaveBar(true)
  }, [messages, saveStatus])

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(LS_MESSAGES, JSON.stringify(messages)) } catch { /* ignore */ }
    }
  }, [messages])

  // Persist profile to localStorage
  useEffect(() => {
    if (profile) {
      try { localStorage.setItem(LS_PROFILE, JSON.stringify(profile)) } catch { /* ignore */ }
    }
  }, [profile])

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function clearConversation() {
    setMessages([])
    setPendingItems([])
    setDocuments([])
    setSaveStatus('idle')
    setShowSaveBar(false)
    try { localStorage.removeItem(LS_MESSAGES) } catch { /* ignore */ }
  }

  async function handleSave() {
    if (!saveEmail.trim() || saveStatus === 'saving') return
    setSaveStatus('saving')
    try {
      // Extract document cards from all messages for the vault
      const docs: { id: string; type: string; title: string; content: string; created_at: string }[] = []
      for (const msg of messages) {
        for (const card of msg.cards) {
          if (card.type === 'document') {
            const d = card.data as Record<string, unknown>
            if (d.title && d.document) {
              docs.push({
                id: `${msg.id}_${d.type ?? 'doc'}`,
                type: String(d.type ?? 'document'),
                title: String(d.title),
                content: String(d.document),
                created_at: new Date().toISOString(),
              })
            }
          }
        }
      }

      const res = await fetch('/api/workspace/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveEmail,
          profile,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          ...(docs.length ? { documents: docs } : {}),
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
      setShowSaveBar(false)
    } catch {
      setSaveStatus('error')
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim()
    if (!userText || streaming) return
    setInput('')

    const userMsg: WorkspaceMessage = { id: Date.now().toString(), role: 'user', content: userText, cards: [] }
    const assistantMsg: WorkspaceMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', cards: [], thinking: '' }
    const updatedMessages = [...messages, userMsg]
    setMessages([...updatedMessages, assistantMsg])
    setStreaming(true)

    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          let ev: Record<string, unknown>
          try { ev = JSON.parse(line.slice(6)) } catch { continue }

          if (ev.type === 'thinking') {
            setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: ev.label as string } : msg))
          } else if (ev.type === 'profile_update') {
            setProfile(p => ({ ...p, ...(ev.updates as Partial<FounderProfile>) }))
          } else if (ev.type === 'card') {
            const card = ev.card as WorkspaceCard
            setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: '', cards: [...msg.cards, card] } : msg))
            // Track generated documents
            if (card.type === 'document') {
              const title = String((card.data as Record<string, unknown>).title || 'Document')
              setDocuments(d => d.includes(title) ? d : [...d, title])
            }
          } else if (ev.type === 'text') {
            setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: '', content: msg.content + (ev.content as string) } : msg))
          } else if (ev.type === 'done') {
            setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: '' } : msg))
          } else if (ev.type === 'error') {
            setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: '', content: `Error: ${ev.message}` } : msg))
          }
        }
      }
    } catch (err) {
      setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, thinking: '', content: err instanceof Error ? err.message : 'Something went wrong.' } : msg))
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }, [messages, profile, streaming])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#fff', overflow: 'hidden' }}>
      <Sidebar profile={profile} pendingItems={pendingItems} documents={documents} onQuickAction={sendMessage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ borderBottom: '0.5px solid #e5e7eb', flexShrink: 0 }}>
          <div style={{ padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              {profile?.businessName || 'AI Business Advisor'}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {saveStatus === 'saved' && (
                <span style={{ fontSize: '12px', color: '#166534' }}>✓ Saved — check your inbox</span>
              )}
              {messages.length > 0 && (
                <button onClick={clearConversation} style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                  New chat
                </button>
              )}
              <Link href="/dashboard" style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none', border: '0.5px solid #e5e7eb', borderRadius: '6px', padding: '5px 10px' }}>
                Dashboard
              </Link>
            </div>
          </div>

          {/* Save bar — appears after first exchange */}
          {showSaveBar && saveStatus !== 'saved' && (
            <div style={{ padding: '8px 20px', background: '#f0fdf4', borderTop: '0.5px solid #86efac', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: 500, whiteSpace: 'nowrap' }}>
                💾 Save your work
              </span>
              <input
                type="email"
                placeholder="your@email.com"
                value={saveEmail}
                onChange={e => setSaveEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                style={{ flex: 1, fontSize: '13px', padding: '5px 10px', border: '0.5px solid #86efac', borderRadius: '6px', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
              />
              <button
                onClick={handleSave}
                disabled={!saveEmail.trim() || saveStatus === 'saving'}
                style={{ fontSize: '12px', fontWeight: 500, color: '#fff', background: saveStatus === 'saving' ? '#9ca3af' : '#166534', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Send link →'}
              </button>
              <button onClick={() => setShowSaveBar(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 2px' }}>×</button>
              {saveStatus === 'error' && <span style={{ fontSize: '11px', color: '#dc2626' }}>Failed — try again</span>}
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {messages.length === 0 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>What are you building?</div>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                  Form your business, check name availability, draft contracts and NDAs, get your EIN, understand taxes — all in one conversation.
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {STARTERS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} onItemsExtracted={setPendingItems} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: '14px 32px 18px', borderTop: '0.5px solid #e5e7eb', flexShrink: 0 }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business..."
              disabled={streaming}
              rows={1}
              style={{ flex: 1, fontSize: '14px', padding: '11px 14px', border: '0.5px solid #d1d5db', borderRadius: '10px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: '140px', overflowY: 'auto', background: streaming ? '#f9fafb' : '#fff' }}
              onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 140)}px` }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              style={{ background: !input.trim() || streaming ? '#e5e7eb' : '#166534', color: !input.trim() || streaming ? '#9ca3af' : '#fff', border: 'none', borderRadius: '10px', width: '42px', height: '42px', flexShrink: 0, cursor: !input.trim() || streaming ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div style={{ maxWidth: '700px', margin: '6px auto 0', fontSize: '11px', color: '#d1d5db', textAlign: 'center' }}>
            Enter to send · Shift+Enter for new line · Not legal advice
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
      `}</style>
    </div>
  )
}
