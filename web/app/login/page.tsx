'use client'

import { useState } from 'react'
import { getBrowserClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const supabase = getBrowserClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        padding: '20px',
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>📬</div>
          <h1 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 10px', color: '#111827' }}>
            Check your email
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            We sent a login link to <strong>{email}</strong>. Click it to access your dashboard.
            The link expires in 1 hour.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      padding: '20px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
      }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '22px' }}>🌱</span>
          <span style={{ fontWeight: 500, fontSize: '16px', marginLeft: '8px', color: '#111827' }}>
            OpenFounder
          </span>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 8px', color: '#111827' }}>
          Sign in to your account
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px' }}>
          Enter your email and we'll send a magic link — no password needed.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              boxSizing: 'border-box',
              marginBottom: '16px',
              outline: 'none',
            }}
          />

          {status === 'error' && (
            <p style={{ color: '#dc2626', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '11px 20px',
              background: status === 'loading' ? '#9ca3af' : '#166534',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'loading' ? 'Sending…' : 'Send magic link →'}
          </button>
        </form>

        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '20px', lineHeight: 1.5 }}>
          Don't have an account yet?{' '}
          <a href="/start" style={{ color: '#166534', textDecoration: 'none' }}>
            Build your business package →
          </a>
        </p>
      </div>
    </div>
  )
}
