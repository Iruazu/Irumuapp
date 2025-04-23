import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { AppAnimation } from '@/components/AppAnimation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PROGRESS PALETTE',
  description: 'A modern note-taking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppAnimation>
          <div className="min-h-screen bg-[#1a1a1a] text-white">
            <Navigation />
            <main className="p-8">
              {children}
            </main>
          </div>
        </AppAnimation>
      </body>
    </html>
  )
} 