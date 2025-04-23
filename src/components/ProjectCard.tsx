'use client'

import { ReactNode, useState } from 'react'
import { ProjectDetailPage } from './ProjectDetailPage'
import { Project } from '@/app/page'

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { title, description, progress, progressColor, iconType, actions } = project
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'todo' | 'notes' | 'files' | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const icon = <ProjectIcon type={iconType} />
  
  const handleActionClick = (action: string) => {
    if (action === 'OPEN') {
      setIsDetailOpen(true)
      
      // Set default tab based on project type
      if (actions.includes('TODO')) {
        setActiveTab('todo')
      } else if (actions.includes('NOTES')) {
        setActiveTab('notes')
      } else if (actions.includes('FILES')) {
        setActiveTab('files')
      }
    } else if (action === 'DETAILS') {
      setIsDetailOpen(true)
      setActiveTab(null)
    } else if (action === 'TODO') {
      setIsDetailOpen(true)
      setActiveTab('todo')
    } else if (action === 'NOTES') {
      setIsDetailOpen(true)
      setActiveTab('notes')
    } else if (action === 'FILES') {
      setIsDetailOpen(true)
      setActiveTab('files')
    } else if (action === 'EDIT') {
      onEdit()
    } else if (action === 'DELETE') {
      setShowDeleteConfirm(true)
    }
  }
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false)
  }
  
  const handleConfirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="project-card bg-[#252525] rounded-lg overflow-hidden relative">
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-10 p-4">
            <p className="text-center mb-4">Are you sure you want to delete this project?</p>
            <div className="flex space-x-3">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button 
                className="px-4 py-2 bg-[#333] text-white rounded-md hover:bg-[#444]"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      
        <div className="project-header p-5">
          <h3 className="project-title text-lg font-semibold mb-1">{title}</h3>
          <div className="project-description text-[#999] text-sm mb-4">{description}</div>
          <div className="progress-container mb-4">
            <div className="progress-label flex justify-between text-[#999] text-xs mb-2">
              <span>PROGRESS</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar h-1 bg-[#333] rounded-full overflow-hidden">
              <div 
                className={`progress h-full rounded-full ${
                  progressColor === 'coral' ? 'bg-[#f8a387]' : 'bg-[#e2b04a]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="icon-container bg-[#2c2c2c] flex justify-center items-center py-8">
          {icon}
        </div>
        <div className="project-actions flex flex-wrap border-t border-[#333]">
          {actions.map((action, index) => (
            <button
              key={action}
              className={`action-btn flex-1 py-3 bg-transparent border-none text-white text-sm cursor-pointer hover:bg-[#2a2a2a] transition-all ${
                index !== actions.length - 1 && index % 2 === 0 ? 'border-r border-[#333]' : ''
              } ${
                index < actions.length - 2 ? 'border-b border-[#333]' : ''
              }`}
              onClick={() => handleActionClick(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      
      {isDetailOpen && (
        <ProjectDetailPage
          project={project}
          onClose={handleCloseDetail}
          initialTab={activeTab}
        />
      )}
    </>
  )
}

import { ProjectIcon } from './ProjectIcons'