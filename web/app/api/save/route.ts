import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { computeDeadlines } from '@/lib/deadlines'
import type { FounderProfile } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { email, profile, package: pkg, formation_date } = await req.json()

    if (!email || !profile) {
      return Response.json({ error: 'email and profile are required' }, { status: 400 })
    }

    const cleanEmail = (email as string).toLowerCase().trim()
    const formationDate = formation_date ? new Date(formation_date) : new Date()

    // Upsert profile by email
    const { data, error } = await supabase
      .from('founder_profiles')
      .upsert(
        {
          email: cleanEmail,
          profile,
          package: pkg ?? null,
          formation_date: formationDate.toISOString().slice(0, 10),
          reminders_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select('id, token')
      .single()

    if (error) {
      console.error('Supabase upsert error:', error)
      return Response.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    // Compute and store deadline reminders
    try {
      const deadlines = computeDeadlines(profile as FounderProfile, formationDate)

      if (deadlines.length > 0) {
        // Remove stale reminders for this profile, then insert fresh ones
        await supabase.from('reminders').delete().eq('profile_id', data.id)

        const rows = deadlines.map(d => ({
          profile_id: data.id,
          email: cleanEmail,
          type: d.type,
          label: d.label,
          due_date: d.due_date.toISOString().slice(0, 10),
          details: d.details,
          fee: d.fee ?? null,
          link: d.link,
          send_days_before: d.send_days_before,
        }))

        const { error: remErr } = await supabase.from('reminders').insert(rows)
        if (remErr) console.error('Reminder insert error:', remErr)
      }
    } catch (deadlineErr) {
      // Non-fatal — profile is saved, reminders failed
      console.error('Deadline computation error:', deadlineErr)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const businessName = (profile as FounderProfile).businessName || 'your business'

    // Generate a magic link so the email both confirms the save AND logs them in
    let magicLink = `${appUrl}/profile/${data.token}` // fallback: plain return link
    try {
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: cleanEmail,
        options: { redirectTo: `${appUrl}/auth/callback` },
      })
      if (linkData?.properties?.action_link) {
        magicLink = linkData.properties.action_link
      }
    } catch (linkErr) {
      console.error('Magic link generation failed, falling back to return link:', linkErr)
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'OpenFounder <onboarding@resend.dev>',
      to: email,
      subject: `Your ${businessName} business package is ready`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111827; background: #ffffff;">
  <div style="margin-bottom: 28px;">
    <span style="font-size: 22px;">🌱</span>
    <span style="font-weight: 500; font-size: 16px; margin-left: 8px; color: #111827;">OpenFounder</span>
  </div>

  <h1 style="font-size: 20px; font-weight: 500; margin: 0 0 10px; color: #111827;">
    Your business package is saved
  </h1>
  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 28px;">
    Click below to access your dashboard for <strong>${businessName}</strong>. You'll see your full business package, upcoming deadlines, and can ask your AI advisor anything.
  </p>

  <a href="${magicLink}" style="display: inline-block; background: #166534; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
    Open my dashboard →
  </a>

  <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 36px 0 0;">
    This link logs you in automatically — keep it private. We'll send reminders before your state filing deadlines and quarterly tax payments. Reply "unsubscribe" to any reminder email to stop.
  </p>
</body>
</html>
      `.trim(),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return Response.json({ error: 'Profile saved but email failed to send' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Save error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
