'use client'

import { useRouter } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = getBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'none',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '7px 14px',
        fontSize: '13px',
        color: '#6b7280',
        cursor: 'pointer',
      }}
    >
      Sign out
    </button>
  )
}
