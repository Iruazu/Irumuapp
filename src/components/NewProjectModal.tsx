'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Project } from '@/app/page'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (projectData: NewProjectData) => void
  editProject: Project | null
}

export interface NewProjectData {
  title: string
  description: string
  progress: number
  progressColor: 'coral' | 'yellow'
  iconType: 'desktop' | 'table' | 'circle' | 'grid' | 'timer' | 'leaf'
  actions: string[]
}

export function NewProjectModal({ isOpen, onClose, onSave, editProject }: NewProjectModalProps) {
  const [formData, setFormData] = useState<NewProjectData>({
    title: '',
    description: '',
    progress: 0,
    progressColor: 'coral',
    iconType: 'desktop',
    actions: ['OPEN', 'DETAILS']
  })

  useEffect(() => {
    if (editProject) {
      // Filter out EDIT and DELETE from actions since we'll add them automatically later
      const basicActions = editProject.actions.filter(action => 
        action !== 'EDIT' && action !== 'DELETE'
      )
      
      setFormData({
        title: editProject.title,
        description: editProject.description,
        progress: editProject.progress,
        progressColor: editProject.progressColor,
        iconType: editProject.iconType,
        actions: basicActions
      })
    } else {
      resetForm()
    }
  }, [editProject, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'progress') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      })
    } else if (name === 'actions') {
      setFormData({
        ...formData,
        actions: (value as string).split(',').map(item => item.trim())
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      progress: 0,
      progressColor: 'coral',
      iconType: 'desktop',
      actions: ['OPEN', 'DETAILS']
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252525] rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">
          {editProject ? 'Edit Project' : 'Create New Project'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
              placeholder="PROJECT TITLE"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
              placeholder="PROJECT DESCRIPTION"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Progress ({formData.progress}%)
            </label>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Progress Color
            </label>
            <select
              name="progressColor"
              value={formData.progressColor}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
            >
              <option value="coral">Coral</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon Type
            </label>
            <select
              name="iconType"
              value={formData.iconType}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
            >
              <option value="desktop">Desktop</option>
              <option value="table">Table</option>
              <option value="circle">Circle</option>
              <option value="grid">Grid</option>
              <option value="timer">Timer</option>
              <option value="leaf">Leaf</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Actions (comma separated)
            </label>
            <input
              type="text"
              name="actions"
              value={formData.actions.join(', ')}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
              placeholder="OPEN, DETAILS"
            />
            <p className="text-[#999] text-xs mt-1">
              EDIT and DELETE actions will be added automatically
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-[#444] text-white rounded-md hover:bg-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#f8a387] text-[#1a1a1a] font-medium rounded-md hover:opacity-90"
            >
              {editProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}