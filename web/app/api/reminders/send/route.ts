import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

// Called by Vercel Cron daily at 2pm UTC.
// Also callable manually: GET /api/reminders/send with Authorization: Bearer {CRON_SECRET}
export async function GET(req: Request) {
  // Verify cron secret
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // PostgREST can't do column arithmetic in filters, so we fetch all pending
  // and filter in JS — fine for the scale this app will see.
  const { data: allPending, error: allErr } = await supabase
    .from('reminders')
    .select('*')
    .is('sent_at', null)

  if (allErr) {
    console.error('Fetch reminders error:', allErr)
    return Response.json({ error: 'Failed to fetch reminders' }, { status: 500 })
  }

  // Filter to reminders that should send today
  const due = (allPending ?? []).filter(r => {
    const dueDate = new Date(r.due_date)
    const sendDate = new Date(dueDate)
    sendDate.setDate(sendDate.getDate() - r.send_days_before)
    return sendDate.toISOString().slice(0, 10) === today
  })

  if (due.length === 0) {
    return Response.json({ sent: 0, message: 'No reminders due today' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openfoundr.com'
  const from = process.env.RESEND_FROM_EMAIL || 'OpenFounder <onboarding@resend.dev>'

  const results = await Promise.allSettled(
    due.map(async reminder => {
      const dueDate = new Date(reminder.due_date)
      const daysOut = reminder.send_days_before
      const formattedDate = dueDate.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })

      // Look up return link for this email
      const { data: profileRow } = await supabase
        .from('founder_profiles')
        .select('token, profile')
        .eq('id', reminder.profile_id)
        .single()

      const returnUrl = profileRow ? `${appUrl}/profile/${profileRow.token}` : appUrl
      const businessName = (profileRow?.profile as Record<string, string> | null)?.businessName || 'your business'

      const { error: emailErr } = await resend.emails.send({
        from,
        to: reminder.email,
        subject: `Reminder: ${reminder.label} — due ${formattedDate}`,
        html: reminderEmail({
          label: reminder.label,
          daysOut,
          dueDate: formattedDate,
          details: reminder.details,
          fee: reminder.fee,
          link: reminder.link,
          returnUrl,
          businessName,
        }),
      })

      if (emailErr) throw new Error(`Resend error: ${emailErr.message}`)

      // Mark sent
      await supabase
        .from('reminders')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', reminder.id)
    })
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  console.log(`Reminders: ${sent} sent, ${failed} failed`)
  return Response.json({ sent, failed })
}

// ─── Email template ───────────────────────────────────────────────────────────

function reminderEmail({
  label, daysOut, dueDate, details, fee, link, returnUrl, businessName,
}: {
  label: string
  daysOut: number
  dueDate: string
  details: string | null
  fee: string | null
  link: string | null
  returnUrl: string
  businessName: string
}) {
  const urgency = daysOut <= 7 ? '⚠️ Coming up soon' : '📅 Upcoming deadline'
  const urgencyColor = daysOut <= 7 ? '#dc2626' : '#2563eb'

  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111827; background: #ffffff;">
  <div style="margin-bottom: 28px;">
    <span style="font-size: 22px;">🌱</span>
    <span style="font-weight: 500; font-size: 16px; margin-left: 8px; color: #111827;">OpenFounder</span>
  </div>

  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 22px; margin-bottom: 24px;">
    <div style="font-size: 12px; font-weight: 600; color: ${urgencyColor}; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">
      ${urgency} · ${daysOut} days away
    </div>
    <div style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 4px;">${label}</div>
    <div style="font-size: 14px; color: #6b7280;">Due ${dueDate} · ${businessName}</div>
    ${fee ? `<div style="font-size: 13px; color: #374151; margin-top: 8px; font-weight: 500;">Amount: ${fee}</div>` : ''}
  </div>

  ${details ? `<p style="color: #6b7280; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">${details}</p>` : ''}

  <div style="display: flex; gap: 12px; margin-bottom: 32px;">
    ${link ? `<a href="${link}" style="display: inline-block; background: #166534; color: #ffffff; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">File now →</a>` : ''}
    <a href="${returnUrl}" style="display: inline-block; background: #f9fafb; color: #374151; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-size: 14px; border: 1px solid #e5e7eb;">View my profile →</a>
  </div>

  <hr style="margin: 0 0 24px; border: none; border-top: 1px solid #e5e7eb;" />

  <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
    You're receiving this because you enabled deadline reminders for ${businessName} on OpenFounder.
    Reply "unsubscribe" to stop all reminders.
  </p>
</body>
</html>
  `.trim()
}

