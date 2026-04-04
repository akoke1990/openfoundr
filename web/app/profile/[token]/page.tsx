'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProfileReturnPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Invalid link.')
      return
    }

    fetch(`/api/profile/${token}`)
      .then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || 'Profile not found')
        }
        return res.json()
      })
      .then(({ profile, package: pkg }) => {
        sessionStorage.setItem('founder_profile', JSON.stringify(profile))
        if (pkg) {
          sessionStorage.setItem('founder_package', JSON.stringify(pkg))
        }
        router.replace('/results')
      })
      .catch(err => {
        setError(err.message || 'Could not load your profile.')
      })
  }, [token, router])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px',
        fontFamily: 'var(--font-sans)', background: 'var(--color-background-tertiary)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Link not found
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
            {error}
          </div>
          <Link href="/start" style={{ color: 'var(--color-text-info)', fontSize: '14px' }}>
            Start a new profile →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'var(--font-sans)',
      background: 'var(--color-background-tertiary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
        <div style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>
          Loading your profile...
        </div>
      </div>
    </div>
  )
}
