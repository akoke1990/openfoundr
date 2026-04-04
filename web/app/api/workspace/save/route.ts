import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import type { FounderProfile } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { email, profile, messages, documents } = await req.json() as {
      email: string
      profile: Partial<FounderProfile> | null
      messages: { role: string; content: string }[]
      documents?: { id: string; type: string; title: string; content: string; created_at: string }[]
    }

    if (!email?.trim()) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const businessName = profile?.businessName || 'your business'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Upsert the profile + conversation
    const { data, error } = await supabase
      .from('founder_profiles')
      .upsert(
        {
          email: cleanEmail,
          profile: profile ?? {},
          workspace_messages: messages,
          ...(documents?.length ? { documents } : {}),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select('id, token')
      .single()

    if (error) {
      console.error('Workspace save error:', error)
      return Response.json({ error: 'Failed to save' }, { status: 500 })
    }

    // Generate magic link so clicking the email logs them in
    let magicLink = `${appUrl}/workspace`
    try {
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: cleanEmail,
        options: { redirectTo: `${appUrl}/auth/callback?next=/workspace` },
      })
      if (linkData?.properties?.action_link) {
        magicLink = linkData.properties.action_link
      }
    } catch (e) {
      console.error('Magic link error:', e)
    }

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'OpenFounder <onboarding@resend.dev>',
      to: cleanEmail,
      subject: `Your OpenFounder workspace is saved`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#111827;background:#fff;">
  <div style="margin-bottom:24px;">
    <span style="font-size:22px;">🌱</span>
    <span style="font-weight:600;font-size:16px;margin-left:8px;">OpenFounder</span>
  </div>
  <h1 style="font-size:20px;font-weight:500;margin:0 0 10px;">Your workspace is saved</h1>
  <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 28px;">
    Click below to pick up right where you left off${businessName !== 'your business' ? ` on <strong>${businessName}</strong>` : ''}. Your conversation and progress will be waiting.
  </p>
  <a href="${magicLink}" style="display:inline-block;background:#166534;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;">
    Return to my workspace →
  </a>
  <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:36px 0 0;">
    This link logs you in automatically — keep it private. It expires in 24 hours.
  </p>
</body>
</html>`.trim(),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return Response.json({ error: 'Profile saved but email failed to send' }, { status: 500 })
    }

    return Response.json({ ok: true, token: data.token })
  } catch (err) {
    console.error('Workspace save error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
