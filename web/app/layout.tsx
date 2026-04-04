import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenFounder — Free Business Formation for Everyone',
  description:
    'Free, open source AI guide that walks you from idea to operating business. Entity formation, operating agreements, EIN, banking, email, website — all in one place.',
  openGraph: {
    title: 'OpenFounder',
    description: 'Free business formation for everyone. No lawyers required.',
    siteName: 'OpenFounder',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
