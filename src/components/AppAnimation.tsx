'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppAnimationProps {
  children: React.ReactNode
}

export function AppAnimation({ children }: AppAnimationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // ローディングアニメーションの時間を設定
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // コンテンツ表示の遅延を設定
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2500)

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[#1a1a1a]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-4xl font-bold text-white mb-4"
              >
                Note App
              </motion.div>
              <motion.div
                className="w-32 h-1 bg-blue-600 rounded-full mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 