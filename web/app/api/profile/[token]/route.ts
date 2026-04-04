import { supabase } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params

  if (!token) {
    return Response.json({ error: 'Token required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('founder_profiles')
    .select('profile, package')
    .eq('token', token)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Profile not found' }, { status: 404 })
  }

  return Response.json({ profile: data.profile, package: data.package })
}
