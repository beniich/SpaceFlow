import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BEECARBONIT Serverless',
  description: 'Next-gen facility management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
