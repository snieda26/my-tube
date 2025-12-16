import { Inter } from 'next/font/google'

import '@/styles/globals.scss'
import '@/styles/components/index.scss'
import '@/styles/layout/index.scss'
import '@/styles/modules/index.scss'
import { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'MyTube',
  description: 'Discover, watch, and share videos on MyTube',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
