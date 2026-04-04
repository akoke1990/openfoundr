import { getServerClient } from '@/lib/supabase-server'
import { supabase as adminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ messages: null, profile: null })
  }

  const { data } = await adminClient
    .from('founder_profiles')
    .select('profile, workspace_messages')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  return Response.json({
    profile: data?.profile ?? null,
    messages: data?.workspace_messages ?? null,
  })
}
