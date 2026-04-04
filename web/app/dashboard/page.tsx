import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase-server'
import { supabase as adminClient } from '@/lib/supabase'
import type { FounderProfile } from '@/lib/types'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = getServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile and upcoming reminders
  const { data: profileRow } = await adminClient
    .from('founder_profiles')
    .select('id, token, profile, package, documents, formation_date, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const today = new Date().toISOString().slice(0, 10)

  const { data: reminders } = profileRow
    ? await adminClient
        .from('reminders')
        .select('id, label, due_date, details, fee, link, send_days_before')
        .eq('profile_id', profileRow.id)
        .is('sent_at', null)
        .gte('due_date', today)
        .order('due_date', { ascending: true })
        .limit(10)
    : { data: [] }

  const profile = profileRow?.profile as FounderProfile | null
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Collect documents from package (results page) + documents column (workspace)
  type DocEntry = { id: string; type: string; title: string; content: string }
  const allDocuments: DocEntry[] = []
  if (profileRow?.package) {
    const pkg = profileRow.package as Record<string, unknown>
    if (pkg.operatingAgreement) {
      const oa = pkg.operatingAgreement as Record<string, unknown>
      if (oa.document) allDocuments.push({ id: 'oa', type: 'operating_agreement', title: String(oa.title || 'Operating Agreement'), content: String(oa.document) })
    }
  }
  if (profileRow?.documents && Array.isArray(profileRow.documents)) {
    for (const d of profileRow.documents as DocEntry[]) {
      if (!allDocuments.find(x => x.type === d.type)) allDocuments.push(d)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '40px 20px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '22px' }}>🌱</span>
            <span style={{ fontWeight: 500, fontSize: '16px', marginLeft: '8px', color: '#111827' }}>OpenFounder</span>
          </div>
          <LogoutButton />
        </div>

        {!profile ? (
          // No profile yet
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>👋</div>
            <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 10px', color: '#111827' }}>
              Welcome to OpenFounder
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              You don't have a business package yet. Answer a few questions to get your personalized plan.
            </p>
            <a href="/start" style={{
              display: 'inline-block',
              background: '#166534',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '11px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Build my business package →
            </a>
          </div>
        ) : (
          <>
            {/* Business summary card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    Your business
                  </div>
                  <h1 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 4px', color: '#111827' }}>
                    {profile.businessName || 'Your Business'}
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    {profile.businessType || 'LLC'} · {profile.state}
                    {profileRow?.formation_date && ` · formed ${profileRow.formation_date}`}
                  </p>
                </div>
                {profileRow?.token && (
                  <a
                    href={`${appUrl}/profile/${profileRow.token}`}
                    style={{
                      display: 'inline-block',
                      background: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #86efac',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Full profile →
                  </a>
                )}
              </div>

              {profile.businessTypeOther && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb',
                  color: '#374151',
                  fontSize: '14px',
                }}>
                  {profile.businessTypeOther}
                </div>
              )}
            </div>

            {/* Upcoming deadlines */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 16px', color: '#111827' }}>
                Upcoming deadlines
              </h2>

              {!reminders || reminders.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                  No upcoming deadlines. You're all caught up!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reminders.map((r: {
                    id: string
                    label: string
                    due_date: string
                    details: string | null
                    fee: string | null
                    link: string | null
                    send_days_before: number
                  }) => {
                    const dueDate = new Date(r.due_date + 'T00:00:00')
                    const todayDate = new Date()
                    todayDate.setHours(0, 0, 0, 0)
                    const daysUntil = Math.round((dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
                    const isUrgent = daysUntil <= 30
                    const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

                    return (
                      <div key={r.id} style={{
                        padding: '14px 16px',
                        border: `1px solid ${isUrgent ? '#fca5a5' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        background: isUrgent ? '#fff7f7' : '#f9fafb',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: '14px', color: '#111827', marginBottom: '2px' }}>
                              {r.label}
                            </div>
                            <div style={{ fontSize: '13px', color: isUrgent ? '#dc2626' : '#6b7280' }}>
                              Due {formattedDate} · {daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `${daysUntil} days`}
                            </div>
                            {r.fee && (
                              <div style={{ fontSize: '13px', color: '#374151', marginTop: '4px', fontWeight: 500 }}>
                                {r.fee}
                              </div>
                            )}
                          </div>
                          {r.link && (
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                background: '#166534',
                                color: '#ffffff',
                                textDecoration: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              File →
                            </a>
                          )}
                        </div>
                        {r.details && (
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', lineHeight: 1.5 }}>
                            {r.details}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Document vault */}
            {allDocuments.length > 0 && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '20px',
              }}>
                <h2 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 16px', color: '#111827' }}>
                  Your documents
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {allDocuments.map(doc => (
                    <div key={doc.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb',
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}>{doc.title}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', textTransform: 'capitalize' }}>
                          {doc.type.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(doc.content)}`}
                        download={`${doc.title.replace(/\s+/g, '_')}.md`}
                        style={{
                          display: 'inline-block',
                          background: '#f0fdf4',
                          color: '#166534',
                          border: '1px solid #86efac',
                          textDecoration: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              flexWrap: 'wrap',
            }}>
              <a href="/workspace" style={{
                display: 'inline-block',
                background: '#166534',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
              }}>
                Open workspace →
              </a>
              {profileRow?.token && (
                <a href={`${appUrl}/profile/${profileRow.token}`} style={{
                  display: 'inline-block',
                  background: '#f9fafb',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}>
                  View full package
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
