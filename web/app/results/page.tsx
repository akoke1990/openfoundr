'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import type { FounderProfile } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

interface GeneratedPackage {
  stateInfo: AnyData | null
  entityRec: AnyData | null
  operatingAgreement: AnyData | null
  checklist: AnyData | null
  einGuide: AnyData | null
  bankingGuide: AnyData | null
  summary: string
}

type Status = 'loading' | 'generating' | 'done' | 'error'

const TOOL_LABELS: Record<string, string> = {
  get_state_info: 'Looking up state requirements...',
  recommend_entity_type: 'Analyzing your situation...',
  generate_operating_agreement: 'Drafting your operating agreement...',
  generate_launch_checklist: 'Building your launch checklist...',
  get_ein_guide: 'Preparing EIN walkthrough...',
  get_banking_guide: 'Finding banking options...',
}

// ─── Download helper ──────────────────────────────────────────────────────────

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      marginBottom: '16px',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Section({
  title, badge, children, downloadLabel, downloadContent, downloadFilename,
}: {
  title: string
  badge?: string
  children: React.ReactNode
  downloadLabel?: string
  downloadContent?: string
  downloadFilename?: string
}) {
  const [open, setOpen] = useState(true)
  return (
    <Card>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderBottom: open ? '0.5px solid var(--color-border-tertiary)' : 'none',
          background: 'var(--color-background-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{title}</span>
          {badge && (
            <span style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
              background: 'var(--color-background-success)', color: 'var(--color-text-success)', fontWeight: 500,
            }}>{badge}</span>
          )}
        </div>
        <span style={{
          fontSize: '18px', color: 'var(--color-text-tertiary)',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          display: 'inline-block',
        }}>›</span>
      </div>
      {open && (
        <div style={{ padding: '18px' }}>
          {children}
          {downloadLabel && downloadContent && downloadFilename && (
            <button
              onClick={() => download(downloadContent, downloadFilename)}
              style={{
                marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                background: '#166534', color: 'white', border: 'none',
                borderRadius: 'var(--border-radius-md)', padding: '10px 18px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {downloadLabel}
            </button>
          )}
        </div>
      )}
    </Card>
  )
}

function GreenBtn({ onClick, href, children }: { onClick?: () => void; href?: string; children: React.ReactNode }) {
  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: '#166534', color: 'white', border: 'none',
    borderRadius: 'var(--border-radius-md)', padding: '8px 16px',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    textDecoration: 'none', fontFamily: 'var(--font-sans)',
  }
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>
  return <button onClick={onClick} style={style}>{children}</button>
}

// ─── Section renderers ────────────────────────────────────────────────────────

function EntitySection({ data }: { data: AnyData }) {
  return (
    <div>
      <div style={{
        padding: '12px 16px', marginBottom: '14px',
        background: 'var(--color-background-success)',
        border: '0.5px solid var(--color-border-success)',
        borderRadius: 'var(--border-radius-md)',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-success)', marginBottom: '4px' }}>
          {String(data.recommended)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-success)' }}>{String(data.primary_reason)}</div>
      </div>

      {Array.isArray(data.key_benefits) && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Key benefits</div>
          {data.key_benefits.map((b: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <span style={{ color: '#166534', flexShrink: 0 }}>✓</span>
              {b}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.watch_out_for) && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Watch out for</div>
          {data.watch_out_for.map((w: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <span style={{ color: '#b45309', flexShrink: 0 }}>!</span>
              {w}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StateSection({ data, stateName }: { data: AnyData; stateName: string }) {
  const llc = data.llc as AnyData
  if (!llc) return <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>State data unavailable.</p>

  return (
    <div>
      {[
        ['Filing name', llc.filing_name],
        ['Filing fee', llc.filing_fee != null ? `$${llc.filing_fee}` : null],
        ['Processing time', llc.processing_time_standard],
      ].map(([label, value]) => value ? (
        <div key={String(label)} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '9px 0', borderBottom: '0.5px solid var(--color-border-tertiary)',
          fontSize: '13px',
        }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{String(value)}</span>
        </div>
      ) : null)}

      {llc.publication_requirement && (
        <div style={{
          marginTop: '14px', padding: '12px 14px',
          background: '#fffbeb', border: '0.5px solid #fcd34d', borderRadius: 'var(--border-radius-md)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#92400e', marginBottom: '4px' }}>⚠️ Publication requirement</div>
          <div style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>{String(llc.publication_notes || '')}</div>
        </div>
      )}

      {llc.filing_link && (
        <div style={{ marginTop: '16px' }}>
          <GreenBtn href={String(llc.filing_link)}>
            File with {stateName} Secretary of State →
          </GreenBtn>
        </div>
      )}

      {data.notes && (
        <p style={{ marginTop: '14px', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {String(data.notes)}
        </p>
      )}
    </div>
  )
}

// ─── Walkthrough types ────────────────────────────────────────────────────────

interface ChecklistItem {
  task: string
  fee?: string
  time?: string
  priority?: string
  link?: string
  note?: string
}

interface WalkthroughData {
  why: string
  steps: string[]
  warnings: string[]
  time_estimate: string
}

// ─── Walkthrough drawer ───────────────────────────────────────────────────────

function WalkthroughDrawer({
  item, profile, isDone, onClose, onToggleDone, cache, onCacheSet,
}: {
  item: ChecklistItem
  profile: FounderProfile | null
  isDone: boolean
  onClose: () => void
  onToggleDone: () => void
  cache: Map<string, WalkthroughData>
  onCacheSet: (key: string, val: WalkthroughData) => void
}) {
  const [data, setData] = useState<WalkthroughData | null>(cache.get(item.task) ?? null)
  const [loading, setLoading] = useState(!cache.has(item.task))
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (cache.has(item.task)) { setData(cache.get(item.task)!); setLoading(false); return }
    setLoading(true)
    setFetchError(false)
    fetch('/api/walkthrough', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: item, profile }),
    })
      .then(r => r.json())
      .then(d => { setData(d); onCacheSet(item.task, d); setLoading(false) })
      .catch(() => { setFetchError(true); setLoading(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.task])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.28)',
          zIndex: 100,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: 'var(--color-background-primary)',
        zIndex: 101,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.14)',
        fontFamily: 'var(--font-sans)',
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                {item.task}
              </span>
              {item.priority === 'critical' && (
                <span style={{
                  fontSize: '10px', background: '#fef2f2', color: '#dc2626',
                  padding: '2px 7px', borderRadius: '10px', fontWeight: 500, flexShrink: 0,
                }}>Critical</span>
              )}
            </div>
            {(item.fee || item.time) && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                {[item.fee, item.time].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-tertiary)', fontSize: '18px', lineHeight: 1,
              padding: '4px', flexShrink: 0, marginTop: '-2px',
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {loading && (
            <div style={{ textAlign: 'center', paddingTop: '48px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌱</div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Building your walkthrough...
              </div>
            </div>
          )}

          {fetchError && (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', paddingTop: '20px', lineHeight: 1.6 }}>
              Couldn&apos;t load walkthrough. Check your connection and try again.
            </p>
          )}

          {data && !loading && (
            <div>
              {/* Why it matters */}
              <div style={{
                background: 'var(--color-background-info)',
                border: '0.5px solid var(--color-border-info)',
                borderRadius: 'var(--border-radius-md)',
                padding: '12px 14px', marginBottom: '22px',
              }}>
                <div style={{
                  fontSize: '10px', fontWeight: 600, color: 'var(--color-text-info)',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px',
                }}>Why this matters</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                  {data.why}
                </div>
              </div>

              {/* Steps */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{
                  fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px',
                }}>How to do it</div>
                {(data.steps || []).map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: '#166534', color: 'white',
                      fontSize: '12px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}>{i + 1}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, paddingTop: '3px' }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {data.warnings && data.warnings.length > 0 && (
                <div style={{
                  background: '#fffbeb', border: '0.5px solid #fcd34d',
                  borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '22px',
                }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 600, color: '#92400e',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px',
                  }}>Watch out</div>
                  {data.warnings.map((w, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5, marginBottom: i < data.warnings.length - 1 ? '6px' : 0 }}>
                      • {w}
                    </div>
                  ))}
                </div>
              )}

              {/* Time estimate */}
              {data.time_estimate && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)', padding: '6px 12px', marginBottom: '20px',
                }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{data.time_estimate}</span>
                </div>
              )}

              {/* Official link */}
              {item.link && (
                <div style={{ marginBottom: '8px' }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#166534', color: 'white', textDecoration: 'none',
                      borderRadius: 'var(--border-radius-md)', padding: '10px 16px',
                      fontSize: '13px', fontWeight: 500,
                    }}
                  >
                    Go to official site →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '0.5px solid var(--color-border-tertiary)',
          display: 'flex', gap: '10px',
        }}>
          <button
            onClick={() => { onToggleDone(); if (!isDone) onClose() }}
            style={{
              flex: 1,
              background: isDone ? 'var(--color-background-secondary)' : '#166534',
              color: isDone ? 'var(--color-text-secondary)' : 'white',
              border: isDone ? '0.5px solid var(--color-border-tertiary)' : 'none',
              borderRadius: 'var(--border-radius-md)',
              padding: '11px 16px', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            {isDone ? '↩ Mark incomplete' : '✓ Mark complete'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)', padding: '11px 16px',
              fontSize: '14px', color: 'var(--color-text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Focus card ───────────────────────────────────────────────────────────────

function FocusCard({
  entry, profile, cache, onCacheSet, onMarkComplete, totalItems, completedCount,
}: {
  entry: { item: ChecklistItem; id: string } | null
  profile: FounderProfile | null
  cache: Map<string, WalkthroughData>
  onCacheSet: (key: string, val: WalkthroughData) => void
  onMarkComplete: () => void
  totalItems: number
  completedCount: number
}) {
  const [walkthrough, setWalkthrough] = useState<WalkthroughData | null>(
    entry ? (cache.get(entry.item.task) ?? null) : null
  )
  const [loading, setLoading] = useState(!!entry && !cache.has(entry.item.task))

  useEffect(() => {
    if (!entry) { setWalkthrough(null); setLoading(false); return }
    const cached = cache.get(entry.item.task)
    if (cached) { setWalkthrough(cached); setLoading(false); return }
    setLoading(true)
    setWalkthrough(null)
    fetch('/api/walkthrough', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: entry.item, profile }),
    })
      .then(r => r.json())
      .then(d => { setWalkthrough(d); onCacheSet(entry.item.task, d); setLoading(false) })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.item.task])

  // All done
  if (!entry) return (
    <div style={{
      background: 'var(--color-background-success)',
      border: '1.5px solid var(--color-border-success)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '24px 22px', marginBottom: '20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎉</div>
      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-success)', marginBottom: '4px' }}>
        All tasks complete!
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-success)' }}>
        {completedCount} of {totalItems} items done
      </div>
    </div>
  )

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '1.5px solid #166534',
      borderRadius: 'var(--border-radius-lg)',
      marginBottom: '20px', overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        padding: '12px 18px',
        background: '#f0fdf4',
        borderBottom: '0.5px solid var(--color-border-success)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>
            Next up · {completedCount} of {totalItems} complete
          </div>
          {/* Mini progress dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalItems }).map((_, i) => (
              <div key={i} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: i < completedCount ? '#166534' : 'var(--color-border-tertiary)',
              }} />
            ))}
          </div>
        </div>
        {entry.item.priority === 'critical' && (
          <span style={{
            fontSize: '10px', background: '#fef2f2', color: '#dc2626',
            padding: '3px 8px', borderRadius: '10px', fontWeight: 600, flexShrink: 0,
          }}>Critical</span>
        )}
      </div>

      {/* Task title */}
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: '4px' }}>
          {entry.item.task}
        </div>
        {(entry.item.fee || entry.item.time) && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            {[entry.item.fee, entry.item.time].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>

      {/* Walkthrough content */}
      <div style={{ padding: '16px 18px' }}>
        {loading && (
          <div style={{ padding: '12px 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '16px' }}>🌱</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Building your walkthrough...</div>
          </div>
        )}

        {walkthrough && !loading && (
          <div>
            {/* Why it matters */}
            <p style={{
              fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7,
              marginBottom: '16px', paddingBottom: '16px',
              borderBottom: '0.5px solid var(--color-border-tertiary)',
            }}>
              {walkthrough.why}
            </p>

            {/* Steps */}
            <div style={{ marginBottom: '16px' }}>
              {(walkthrough.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#166534', color: 'white',
                    fontSize: '11px', fontWeight: 600, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, paddingTop: '2px' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Warnings */}
            {walkthrough.warnings?.length > 0 && (
              <div style={{
                background: '#fffbeb', border: '0.5px solid #fcd34d',
                borderRadius: 'var(--border-radius-md)', padding: '10px 14px', marginBottom: '16px',
              }}>
                {walkthrough.warnings.map((w, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.5, marginBottom: i < walkthrough.warnings.length - 1 ? '4px' : 0 }}>• {w}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {entry.item.link && (
            <a href={entry.item.link} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '13px', color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-info)',
              borderRadius: 'var(--border-radius-md)',
              padding: '9px 14px', textDecoration: 'none', whiteSpace: 'nowrap' as const,
            }}>Official site →</a>
          )}
          <button onClick={onMarkComplete} style={{
            flex: 1, background: '#166534', color: 'white', border: 'none',
            borderRadius: 'var(--border-radius-md)', padding: '10px 16px',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            ✓ Mark complete, show next →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Checklist section ────────────────────────────────────────────────────────

function ChecklistSection({ data, profile }: { data: AnyData; profile: FounderProfile | null }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openEntry, setOpenEntry] = useState<{ item: ChecklistItem; id: string } | null>(null)
  const [cache, setCache] = useState<Map<string, WalkthroughData>>(new Map())

  const phases = data.phases as Array<{ name: string; items: ChecklistItem[] }>
  const summary = data.summary as { total_items: number; critical_items: number }

  const toggle = (id: string) => setChecked(s => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const handleCacheSet = (key: string, val: WalkthroughData) =>
    setCache(prev => new Map(prev).set(key, val))

  // Flat ordered list for focus card — critical items first, then phase order
  const flatItems: Array<{ item: ChecklistItem; id: string }> = []
  ;(phases || []).forEach((phase, pi) => {
    phase.items.forEach((item, ii) => flatItems.push({ item, id: `${pi}-${ii}` }))
  })
  const sortedItems = [
    ...flatItems.filter(x => x.item.priority === 'critical'),
    ...flatItems.filter(x => x.item.priority !== 'critical'),
  ]
  const focusEntry = sortedItems.find(x => !checked.has(x.id)) ?? null

  const checklistText = (phases || []).map(p =>
    `## ${p.name}\n\n` + p.items.map(i =>
      `- [ ] ${i.task}${i.fee ? ` — ${i.fee}` : ''}${i.time ? ` · ${i.time}` : ''}${i.link ? `\n  ${i.link}` : ''}`
    ).join('\n')
  ).join('\n\n')

  return (
    <div>
      {/* Focus card — next task with inline walkthrough */}
      <FocusCard
        key={focusEntry?.id ?? 'done'}
        entry={focusEntry}
        profile={profile}
        cache={cache}
        onCacheSet={handleCacheSet}
        onMarkComplete={() => focusEntry && toggle(focusEntry.id)}
        totalItems={summary?.total_items ?? flatItems.length}
        completedCount={checked.size}
      />

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'total', value: summary?.total_items ?? 0, color: 'var(--color-text-primary)' },
          { label: 'critical first', value: summary?.critical_items ?? 0, color: '#dc2626' },
          { label: 'done', value: checked.size, color: '#166534' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1, background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)', padding: '10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 500, color }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Items */}
      {(phases || []).map((phase, pi) => (
        <div key={pi} style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 500, color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px',
          }}>
            {phase.name}
          </div>
          {phase.items.map((item, ii) => {
            const id = `${pi}-${ii}`
            const done = checked.has(id)
            return (
              <div
                key={ii}
                onClick={() => setOpenEntry({ item, id })}
                style={{
                  display: 'flex', gap: '10px', padding: '10px 12px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)', marginBottom: '6px',
                  cursor: 'pointer',
                  opacity: done ? 0.6 : 1,
                  background: done ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                  transition: 'opacity 0.15s',
                }}
              >
                {/* Checkbox — click toggles without opening drawer */}
                <div
                  onClick={e => { e.stopPropagation(); toggle(id) }}
                  title={done ? 'Mark incomplete' : 'Mark complete'}
                  style={{
                    width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '2px',
                    border: done ? 'none' : item.priority === 'critical' ? '1.5px solid #dc2626' : '1.5px solid var(--color-border-secondary)',
                    background: done ? '#166534' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {done && (
                    <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    textDecoration: done ? 'line-through' : 'none',
                    display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
                  }}>
                    {item.task}
                    {item.priority === 'critical' && !done && (
                      <span style={{
                        fontSize: '10px', background: '#fef2f2', color: '#dc2626',
                        padding: '1px 6px', borderRadius: '10px', fontWeight: 500,
                      }}>Critical</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    {[item.fee, item.time].filter(Boolean).join(' · ')}
                    {!done && <span style={{ marginLeft: item.fee || item.time ? '8px' : 0, color: 'var(--color-text-info)' }}>View walkthrough →</span>}
                  </div>
                </div>

                {/* Row chevron */}
                <div style={{
                  color: 'var(--color-text-tertiary)', fontSize: '18px',
                  flexShrink: 0, alignSelf: 'center', lineHeight: 1,
                }}>›</div>
              </div>
            )
          })}
        </div>
      ))}

      <GreenBtn onClick={() => download(checklistText, 'launch-checklist.md')}>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download checklist
      </GreenBtn>

      {/* Walkthrough drawer */}
      {openEntry && (
        <WalkthroughDrawer
          item={openEntry.item}
          profile={profile}
          isDone={checked.has(openEntry.id)}
          onClose={() => setOpenEntry(null)}
          onToggleDone={() => toggle(openEntry.id)}
          cache={cache}
          onCacheSet={handleCacheSet}
        />
      )}
    </div>
  )
}

function EINSection({ data }: { data: AnyData }) {
  const [phase, setPhase] = useState<'intro' | 'prep' | 'steps' | 'done'>('intro')
  const [stepIdx, setStepIdx] = useState(0)

  const steps = (data.steps as string[]) || []
  const warnings = (data.warnings as string[]) || []
  const irsLink = String(data.link || 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online')

  const navBtn = (label: string, onClick: () => void, primary = true) => (
    <button onClick={onClick} style={{
      flex: primary ? 1 : undefined,
      background: primary ? '#166534' : 'none',
      color: primary ? 'white' : 'var(--color-text-secondary)',
      border: primary ? 'none' : '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-md)',
      padding: '11px 18px', fontSize: '14px', fontWeight: primary ? 500 : 400,
      cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' as const,
    }}>{label}</button>
  )

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[['Cost', data.cost || 'Free'], ['Time', data.time || '10 min']].map(([label, value]) => (
          <div key={String(label)} style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)', padding: '10px 16px',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{String(value)}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
        {String(data.what || 'An EIN is your business\'s tax ID — like a Social Security Number for your company. You need it to open a business bank account, hire employees, and file taxes. It\'s free and takes 10 minutes online.')}
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        {navBtn("Let's get your EIN →", () => setPhase('prep'))}
      </div>
    </div>
  )

  // ── Prep ───────────────────────────────────────────────────────────────────
  if (phase === 'prep') return (
    <div>
      <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        Before you start — have these ready
      </div>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
        The IRS application takes about 10 minutes and you can&apos;t save partway. Grab these first.
      </p>
      <div style={{ marginBottom: '24px' }}>
        {[
          { item: 'Your Social Security Number (SSN)', note: 'The IRS links your EIN to your SSN. This stays private — it\'s never public.' },
          { item: 'Your legal name (exactly as it appears on your SSN card)' },
          { item: 'Your business name', note: 'Leave blank if you haven\'t decided yet — you can update it later.' },
          { item: 'Your business address' },
          { item: 'Your entity type', note: 'LLC, sole proprietorship, etc. — already decided above.' },
        ].map(({ item, note }, i) => (
          <div key={i} style={{
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            padding: '12px 0', borderBottom: '0.5px solid var(--color-border-tertiary)',
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0, marginTop: '1px',
              background: 'var(--color-background-success)', border: '0.5px solid var(--color-border-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" fill="none" stroke="#166534" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{item}</div>
              {note && <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px', lineHeight: 1.5 }}>{note}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {navBtn('← Back', () => setPhase('intro'), false)}
        {navBtn("I'm ready — start the application →", () => { setStepIdx(0); setPhase('steps') })}
      </div>
    </div>
  )

  // ── Done ───────────────────────────────────────────────────────────────────
  if (phase === 'done') return (
    <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
      <div style={{ fontSize: '44px', marginBottom: '14px' }}>🎉</div>
      <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
        EIN application submitted!
      </div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 24px' }}>
        Your EIN appears on screen immediately. Screenshot that page or copy the number somewhere safe — you&apos;ll need it every time you open a bank account, hire someone, or file taxes.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={irsLink} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#166534', color: 'white', textDecoration: 'none',
          borderRadius: 'var(--border-radius-md)', padding: '10px 18px',
          fontSize: '13px', fontWeight: 500,
        }}>Apply on IRS.gov →</a>
        <button onClick={() => { setPhase('intro'); setStepIdx(0) }} style={{
          background: 'none', border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)', padding: '10px 16px',
          fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}>Review steps again</button>
      </div>
    </div>
  )

  // ── Steps ──────────────────────────────────────────────────────────────────
  const isLast = stepIdx === steps.length - 1
  const pct = ((stepIdx + 1) / steps.length) * 100

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Step {stepIdx + 1} of {steps.length}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
          {Math.round(pct)}% through
        </div>
      </div>
      <div style={{ height: '4px', background: 'var(--color-border-tertiary)', borderRadius: '2px', marginBottom: '24px' }}>
        <div style={{ height: '100%', background: '#166534', borderRadius: '2px', width: `${pct}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Step card */}
      <div style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '20px 22px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#166534', color: 'white',
            fontSize: '14px', fontWeight: 600, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{stepIdx + 1}</div>
          <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.7, margin: 0, paddingTop: '5px' }}>
            {steps[stepIdx]}
          </p>
        </div>
      </div>

      {/* IRS link — shown on step 1 (index 0) */}
      {stepIdx === 0 && (
        <div style={{ marginBottom: '16px' }}>
          <a href={irsLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--color-text-info)',
            border: '0.5px solid var(--color-border-info)',
            borderRadius: 'var(--border-radius-md)',
            padding: '8px 14px', textDecoration: 'none',
          }}>
            Open IRS EIN application in new tab →
          </a>
        </div>
      )}

      {/* Warnings on last step */}
      {isLast && warnings.length > 0 && (
        <div style={{
          background: '#fffbeb', border: '0.5px solid #fcd34d',
          borderRadius: 'var(--border-radius-md)', padding: '12px 16px', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Watch out
          </div>
          {warnings.map((w, i) => (
            <div key={i} style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.6, marginBottom: i < warnings.length - 1 ? '6px' : 0 }}>
              • {w}
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {navBtn('← Back', () => {
          if (stepIdx === 0) setPhase('prep')
          else setStepIdx(i => i - 1)
        }, false)}
        {navBtn(
          isLast ? "I've submitted my EIN application →" : 'Done, next step →',
          () => isLast ? setPhase('done') : setStepIdx(i => i + 1)
        )}
      </div>
    </div>
  )
}

function BankingSection({ data }: { data: AnyData }) {
  const recs = Array.isArray(data.recommendations) ? data.recommendations : []
  return (
    <div>
      {data.why_it_matters && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          {String(data.why_it_matters)}
        </p>
      )}
      {recs.map((r: AnyData, i: number) => (
        <div key={i} style={{
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{String(r.name)}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginLeft: '8px' }}>{String(r.type)}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#166534' }}>{String(r.fee)}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>{String(r.why)}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Best for: {String(r.best_for)}</span>
            {r.link && (
              <a href={String(r.link)} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '12px', color: 'var(--color-text-info)' }}>
                Open account →
              </a>
            )}
          </div>
        </div>
      ))}
      {Array.isArray(data.what_to_bring) && (
        <div style={{
          marginTop: '10px', padding: '10px 14px',
          background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
            What to bring to open your account
          </div>
          {data.what_to_bring.map((item: string, i: number) => (
            <div key={i} style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '3px' }}>
              • {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Name checker ────────────────────────────────────────────────────────────

interface DomainResult {
  tld: string
  domain: string
  status: 'available' | 'taken' | 'unknown'
}

function NameChecker({ profile }: { profile: FounderProfile | null }) {
  const [name, setName] = useState(profile?.businessName || '')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    slug: string
    domains: DomainResult[]
    stateSearch: { url: string; label: string } | null
  } | null>(null)
  const [checked, setChecked] = useState(false)

  async function check(nameToCheck = name) {
    if (!nameToCheck.trim()) return
    setLoading(true)
    setChecked(false)
    try {
      const res = await fetch('/api/name-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameToCheck, stateAbbr: profile?.stateAbbr || '' }),
      })
      const data = await res.json()
      setResults(data)
    } finally {
      setLoading(false)
      setChecked(true)
    }
  }

  // Auto-check on first render if we have a name
  useEffect(() => {
    if (profile?.businessName) check(profile.businessName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusColor = (s: DomainResult['status']) =>
    s === 'available' ? '#166534' : s === 'taken' ? '#dc2626' : '#9ca3af'
  const statusBg = (s: DomainResult['status']) =>
    s === 'available' ? '#f0fdf4' : s === 'taken' ? '#fef2f2' : '#f9fafb'
  const statusBorder = (s: DomainResult['status']) =>
    s === 'available' ? '#86efac' : s === 'taken' ? '#fca5a5' : '#e5e7eb'
  const statusLabel = (s: DomainResult['status']) =>
    s === 'available' ? 'Available' : s === 'taken' ? 'Taken' : '?'

  return (
    <div style={{ padding: '18px 22px 22px' }}>
      {/* Search row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Business name"
          style={{
            flex: 1, fontSize: '14px', padding: '9px 12px',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-md)',
            outline: 'none', fontFamily: 'var(--font-sans)',
          }}
        />
        <button
          onClick={() => check()}
          disabled={loading || !name.trim()}
          style={{
            background: loading || !name.trim() ? 'var(--color-border-tertiary)' : '#166534',
            color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)',
            padding: '9px 16px', fontSize: '14px', fontWeight: 500,
            cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {/* Domain results */}
      {checked && results && (
        <>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Domains for <strong style={{ color: 'var(--color-text-primary)' }}>{results.slug}</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {results.domains.map(d => (
              <div key={d.tld} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px',
                background: statusBg(d.status),
                border: `0.5px solid ${statusBorder(d.status)}`,
                borderRadius: 'var(--border-radius-md)',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {d.domain}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: statusColor(d.status),
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {statusLabel(d.status)}
                </span>
              </div>
            ))}
          </div>

          {/* State business name search */}
          {results.stateSearch && (
            <a
              href={results.stateSearch.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: 'var(--color-text-info)',
                border: '0.5px solid var(--color-border-info)',
                borderRadius: 'var(--border-radius-md)',
                padding: '8px 14px', textDecoration: 'none',
              }}
            >
              Check business name with {results.stateSearch.label} →
            </a>
          )}
        </>
      )}
    </div>
  )
}

// ─── Advisor chat ─────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'How do I pay myself?',
  'When are my quarterly taxes due?',
  'Do I need a business license?',
  'How do I open a business bank account?',
  'What contracts do I need with clients?',
  'When should I hire my first employee?',
]

function AdvisorChat({ profile }: { profile: FounderProfile }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useCallback((el: HTMLDivElement | null) => { el?.scrollIntoView({ behavior: 'smooth' }) }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  async function send(text = input) {
    const userMsg = text.trim()
    if (!userMsg || streaming) return
    setInput('')
    const updated: ChatMessage[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(updated)
    setStreaming(true)

    let reply = ''
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const reader = res.body!.getReader()
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
          try {
            const evt = JSON.parse(line.slice(6))
            if (evt.type === 'text') {
              reply += evt.content
              setMessages(m => {
                const next = [...m]
                next[next.length - 1] = { role: 'assistant', content: reply }
                return next
              })
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch {
      setMessages(m => {
        const next = [...m]
        next[next.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again.' }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#166534', color: 'white',
          border: 'none', borderRadius: '28px',
          padding: '12px 20px', fontSize: '14px', fontWeight: 500,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,101,52,0.35)',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-sans)', zIndex: 90,
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask your advisor
      </button>

      {/* Panel */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: 'min(440px, 100vw)',
            background: 'var(--color-background-primary)',
            zIndex: 101, display: 'flex', flexDirection: 'column',
            boxShadow: '-4px 0 32px rgba(0,0,0,0.14)',
            fontFamily: 'var(--font-sans)',
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Your advisor</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                  Knows your {profile.businessName || 'business'} profile
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-tertiary)', lineHeight: 1 }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 && (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                    Ask anything about your business — taxes, contracts, hiring, paying yourself. I know your situation.
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {SUGGESTED_QUESTIONS.map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        style={{
                          background: 'var(--color-background-secondary)',
                          border: '0.5px solid var(--color-border-tertiary)',
                          borderRadius: '20px', padding: '6px 12px',
                          fontSize: '12px', color: 'var(--color-text-primary)',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.role === 'user' ? '#166534' : 'var(--color-background-secondary)',
                    color: m.role === 'user' ? 'white' : 'var(--color-text-primary)',
                    fontSize: '14px', lineHeight: 1.6,
                    border: m.role === 'assistant' ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--color-border-tertiary)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask a question…"
                disabled={streaming}
                style={{
                  flex: 1, fontSize: '14px', padding: '10px 12px',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                style={{
                  background: !input.trim() || streaming ? 'var(--color-border-tertiary)' : '#166534',
                  color: 'white', border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '10px 14px', cursor: !input.trim() || streaming ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [currentTool, setCurrentTool] = useState('')
  const [profile, setProfile] = useState<FounderProfile | null>(null)
  const [error, setError] = useState('')
  const [pkg, setPkg] = useState<GeneratedPackage>({
    stateInfo: null, entityRec: null, operatingAgreement: null,
    checklist: null, einGuide: null, bankingGuide: null, summary: '',
  })
  const [saveEmail, setSaveEmail] = useState('')
  const [saveFormationDate, setSaveFormationDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const generate = useCallback(async (p: FounderProfile) => {
    setStatus('generating')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      })
      if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          let ev: Record<string, unknown>
          try { ev = JSON.parse(line.slice(6)) } catch { continue }
          if (ev.type === 'tool_status') {
            setCurrentTool(TOOL_LABELS[ev.tool as string] || 'Working...')
          } else if (ev.type === 'tool_result') {
            const { tool, data: d } = ev
            setPkg(prev => {
              const n = { ...prev }
              if (tool === 'get_state_info') n.stateInfo = d as never
              if (tool === 'recommend_entity_type') n.entityRec = d as never
              if (tool === 'generate_operating_agreement') n.operatingAgreement = d as never
              if (tool === 'generate_launch_checklist') n.checklist = d as never
              if (tool === 'get_ein_guide') n.einGuide = d as never
              if (tool === 'get_banking_guide') n.bankingGuide = d as never
              return n
            })
          } else if (ev.type === 'summary') {
            setPkg(prev => ({ ...prev, summary: ev.content as string }))
          } else if (ev.type === 'summary_chunk') {
            setPkg(prev => ({ ...prev, summary: (prev.summary || '') + (ev.content as string) }))
          } else if (ev.type === 'done') {
            setStatus('done')
            setCurrentTool('')
          } else if (ev.type === 'error') {
            throw new Error(ev.message as string)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem('founder_profile')
    if (!raw) {
      setError('No profile found. Please complete the questionnaire first.')
      setStatus('error')
      return
    }
    const p: FounderProfile = JSON.parse(raw)
    setProfile(p)

    // Returning user — skip regeneration if saved package exists
    const savedPkg = sessionStorage.getItem('founder_package')
    if (savedPkg) {
      try {
        setPkg(JSON.parse(savedPkg))
        setStatus('done')
        sessionStorage.removeItem('founder_package') // consume once
        return
      } catch { /* fall through to generate */ }
    }

    generate(p)
  }, [generate])

  async function handleSave() {
    if (!saveEmail || !profile) return
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: saveEmail, profile, package: pkg, formation_date: saveFormationDate }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }

  const businessName = profile?.businessName || 'your business'

  // ── Loading ──
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
          <div style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>Loading...</div>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-sans)' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Something went wrong</div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>{error}</div>
          <Link href="/start" style={{ color: 'var(--color-text-info)', fontSize: '14px' }}>← Start over</Link>
        </div>
      </div>
    )
  }

  // ── Results ──
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)' }}>

      <header style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>OpenFounder</span>
        </Link>
        <Link href="/start" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
          Start over
        </Link>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Generating indicator */}
        {status === 'generating' && (
          <Card style={{ padding: '32px 24px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌱</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Building your business package...
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', minHeight: '20px' }}>
              {currentTool || 'Getting started...'}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[
                pkg.stateInfo, pkg.entityRec, pkg.operatingAgreement,
                pkg.checklist, pkg.einGuide, pkg.bankingGuide,
              ].map((val, i) => (
                <div key={i} style={{
                  width: '10px', height: '10px', borderRadius: '50%', transition: 'background 0.3s',
                  background: val ? '#166534' : 'var(--color-border-tertiary)',
                }} />
              ))}
            </div>
          </Card>
        )}

        {/* Summary */}
        {pkg.summary && (
          <div style={{
            background: '#f0fdf4', border: '0.5px solid #86efac',
            borderRadius: 'var(--border-radius-lg)', padding: '20px 22px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '14px', color: '#166534', lineHeight: 1.7 }}>
              <ReactMarkdown>{pkg.summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Entity recommendation */}
        {pkg.entityRec && (
          <Section title="Your entity recommendation" badge="Personalized">
            <EntitySection data={pkg.entityRec} />
          </Section>
        )}

        {/* State filing */}
        {pkg.stateInfo && !pkg.stateInfo.error && (
          <Section title={`${profile?.state || ''} filing requirements`} badge="Accurate data">
            <StateSection data={pkg.stateInfo} stateName={profile?.state || ''} />
          </Section>
        )}

        {/* Operating agreement */}
        {pkg.operatingAgreement?.document && (
          <Section
            title="Operating agreement"
            badge="Ready to sign"
            downloadLabel="Download operating agreement"
            downloadContent={String(pkg.operatingAgreement.document)}
            downloadFilename={`${businessName.toLowerCase().replace(/\s+/g, '-')}.md`}
          >
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
              Complete operating agreement for {businessName}. Review with a licensed attorney in {profile?.state} before signing.
            </p>
            <div style={{
              background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)',
              padding: '14px', maxHeight: '180px', overflowY: 'auto',
              fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6,
              whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)',
            }}>
              {String(pkg.operatingAgreement.document).slice(0, 500)}...
            </div>
          </Section>
        )}

        {/* Checklist */}
        {pkg.checklist && (
          <Section title="Your launch checklist" badge="Interactive">
            <ChecklistSection data={pkg.checklist} profile={profile} />
          </Section>
        )}

        {/* EIN */}
        {pkg.einGuide && (
          <Section title="How to get your EIN">
            <EINSection data={pkg.einGuide} />
          </Section>
        )}

        {/* Banking */}
        {pkg.bankingGuide && (
          <Section title="Business banking">
            <BankingSection data={pkg.bankingGuide} />
          </Section>
        )}

        {/* Name & domain checker */}
        {status === 'done' && (
          <Section title="Business name & domain availability">
            <NameChecker profile={profile} />
          </Section>
        )}

        {/* Save prompt */}
        {status === 'done' && saveStatus !== 'saved' && (
          <div style={{
            marginTop: '16px',
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '20px 22px',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Create your free account
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              We&apos;ll email you a link to your personal dashboard — your business package, upcoming deadlines, and your AI advisor. No password needed.
            </p>

            {/* Email */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={saveEmail}
                onChange={e => setSaveEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                disabled={saveStatus === 'saving'}
                style={{
                  width: '100%', fontSize: '14px', padding: '9px 12px',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  outline: 'none', boxSizing: 'border-box' as const,
                }}
              />
            </div>

            {/* Formation date */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Business formation date
                <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: '6px', color: 'var(--color-text-tertiary)' }}>
                  used to calculate your filing deadlines
                </span>
              </label>
              <input
                type="date"
                value={saveFormationDate}
                onChange={e => setSaveFormationDate(e.target.value)}
                disabled={saveStatus === 'saving'}
                style={{
                  fontSize: '14px', padding: '9px 12px',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
              <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                Not formed yet? Use today — you can update it later.
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!saveEmail || saveStatus === 'saving'}
              style={{
                width: '100%',
                background: !saveEmail || saveStatus === 'saving' ? 'var(--color-border-tertiary)' : '#166534',
                color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)',
                padding: '11px 16px', fontSize: '14px', fontWeight: 500,
                cursor: !saveEmail || saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {saveStatus === 'saving' ? 'Creating account…' : 'Create my free account →'}
            </button>
            {saveStatus === 'error' && (
              <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>
                Something went wrong. Try again.
              </p>
            )}
          </div>
        )}

        {status === 'done' && saveStatus === 'saved' && (
          <div style={{
            marginTop: '16px',
            background: 'var(--color-background-success)',
            border: '0.5px solid var(--color-border-success)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '16px 22px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>✓</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-success)' }}>
                Check your inbox
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-success)', marginTop: '2px' }}>
                Sent a login link to {saveEmail} — click it to open your dashboard.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Advisor — fixed floating button, outside scroll container */}
      {status === 'done' && profile && <AdvisorChat profile={profile} />}
    </div>
  )
}
