'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'ja',
    notifications: true
  })

  useEffect(() => {
    // ローカルストレージから設定を読み込む
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('appSettings', JSON.stringify(newSettings))
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <Navigation />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">設定</h1>
        
        <div className="space-y-6">
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">テーマ</h2>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full p-2 bg-[#3a3a3a] rounded"
            >
              <option value="dark">ダーク</option>
              <option value="light">ライト</option>
            </select>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">言語</h2>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full p-2 bg-[#3a3a3a] rounded"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">通知</h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="w-4 h-4"
              />
              <span>通知を有効にする</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 