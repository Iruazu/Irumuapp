'use client'

import { ReactNode } from 'react'

export type IconType = 'desktop' | 'table' | 'circle' | 'grid' | 'timer' | 'leaf'

interface ProjectIconProps {
  type: IconType
}

export function ProjectIcon({ type }: ProjectIconProps): ReactNode {
  switch (type) {
    case 'desktop':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <rect x="20" y="60" width="20" height="20" />
          <rect x="50" y="30" width="30" height="50" />
        </svg>
      )
    case 'table':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <rect x="25" y="40" width="50" height="20" />
          <line x1="30" y1="60" x2="30" y2="70" />
          <line x1="70" y1="60" x2="70" y2="70" />
        </svg>
      )
    case 'circle':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <circle cx="50" cy="50" r="30" />
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="20" y1="50" x2="80" y2="50" />
        </svg>
      )
    case 'grid':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <line x1="25" y1="25" x2="75" y2="25" />
          <line x1="25" y1="50" x2="75" y2="50" />
          <line x1="25" y1="75" x2="75" y2="75" />
          <line x1="25" y1="25" x2="25" y2="75" />
          <line x1="50" y1="25" x2="50" y2="75" />
          <line x1="75" y1="25" x2="75" y2="75" />
        </svg>
      )
    case 'timer':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <circle cx="50" cy="60" r="20" />
          <path d="M50 40 L50 20" />
          <path d="M50 20 C50 20, 40 30, 60 30" />
        </svg>
      )
    case 'leaf':
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <path d="M50 20 C70 20, 80 50, 60 70 C40 90, 20 70, 30 50 C40 30, 60 40, 50 20" />
        </svg>
      )
    default:
      return (
        <svg className="icon w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
          <rect x="30" y="30" width="40" height="40" />
        </svg>
      )
  }
}