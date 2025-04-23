'use client'

import { Home, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()

  return (
    <div className="fixed top-4 right-4 flex space-x-2 z-50">
      <button
        onClick={() => router.push('/')}
        className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
        aria-label="ホーム"
      >
        <Home className="w-5 h-5" />
      </button>
      <button
        onClick={() => router.push('/settings')}
        className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
        aria-label="設定"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
} 