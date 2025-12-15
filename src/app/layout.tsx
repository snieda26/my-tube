import '@/styles/globals.scss'
import '@/styles/components/index.scss'
import '@/styles/layout/index.scss'
import '@/styles/modules/index.scss'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
