import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SecureInvest - Premium Blockchain Micro-Investment Platform',
  description: 'Start your investment journey with confidence. Blockchain-powered platform with fraud protection, KYC verification, and transparent returns for first-time investors.',
  keywords: 'blockchain investment, micro-investment, cryptocurrency, KYC, fraud detection, secure investing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
