'use client'

import { ReactNode, useState, useEffect } from 'react'
import { X, Plus, File, FileText, Image, Table, Search, Upload } from 'lucide-react'
import { TodoList } from './TodoList'
import { Project } from '@/app/page'
import { ProjectIcon } from './ProjectIcons'
import { RichNote, NoteItem } from './RichNote'
import { Navigation } from './Navigation'

interface ProjectDetailPageProps {
  project: Project
  onClose: () => void
  initialTab: 'todo' | 'notes' | 'files' | null
}

interface FileItem {
  id: number
  name: string
  type: string
  size: string
  date: string
  version: number
  sharedWith: string[]
  previewUrl?: string
  file?: File
}

export function ProjectDetailPage({
  project,
  onClose,
  initialTab
}: ProjectDetailPageProps) {
  const { title, description, progress, progressColor, iconType } = project
  const [activeTab, setActiveTab] = useState<'todo' | 'notes' | 'files' | null>(initialTab)
  const icon = <ProjectIcon type={iconType} />
  
  // Rich Note state
  const [notes, setNotes] = useState<NoteItem[]>([])
  
  useEffect(() => {
    const savedNotes = localStorage.getItem('projectNotes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('projectNotes', JSON.stringify(notes))
  }, [notes])
  
  // File state and handlers
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: 'project_requirements.pdf',
      type: 'PDF',
      size: '2.4 MB',
      date: '2025-04-05',
      version: 1,
      sharedWith: ['team@example.com'],
      previewUrl: 'https://example.com/preview/1'
    },
    {
      id: 2,
      name: 'color_palette.png',
      type: 'Image',
      size: '840 KB',
      date: '2025-04-12',
      version: 2,
      sharedWith: ['team@example.com', 'client@example.com'],
      previewUrl: 'https://example.com/preview/2'
    }
  ])
  const [showFileModal, setShowFileModal] = useState(false)
  const [fileForm, setFileForm] = useState({ 
    name: '', 
    type: 'Document', 
    size: '',
    sharedWith: [] as string[],
    currentShareEmail: ''
  })
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleAddNote = (note: Omit<NoteItem, 'id' | 'date'>) => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      ...note,
      date: new Date().toISOString()
    }
    setNotes([...notes, newNote])
  }
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }
  
  const handleUpdateNote = (id: string, updatedNote: Partial<NoteItem>) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updatedNote } : note
    ))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFileForm({ ...fileForm, [name]: value })
  }
  
  const handleAddShareEmail = () => {
    if (fileForm.currentShareEmail && !fileForm.sharedWith.includes(fileForm.currentShareEmail)) {
      setFileForm({
        ...fileForm,
        sharedWith: [...fileForm.sharedWith, fileForm.currentShareEmail],
        currentShareEmail: ''
      })
    }
  }
  
  const handleRemoveShareEmail = (email: string) => {
    setFileForm({
      ...fileForm,
      sharedWith: fileForm.sharedWith.filter(e => e !== email)
    })
  }
  
  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault()
    const newFile: FileItem = {
      id: Date.now(),
      name: fileForm.name,
      type: fileForm.type,
      size: fileForm.size || '0 KB',
      date: new Date().toISOString().split('T')[0],
      version: 1,
      sharedWith: fileForm.sharedWith
    }
    setFiles([...files, newFile])
    setFileForm({ 
      name: '', 
      type: 'Document', 
      size: '',
      sharedWith: [],
      currentShareEmail: ''
    })
    setShowFileModal(false)
  }
  
  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(file => file.id !== id))
  }

  const handlePreviewFile = (file: FileItem) => {
    setSelectedFile(file)
    setShowPreview(true)
  }

  const handleUpdateVersion = (id: number) => {
    setFiles(files.map(file => 
      file.id === id 
        ? { ...file, version: file.version + 1 }
        : file
    ))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFile: FileItem = {
        id: Date.now(),
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        size: formatFileSize(file.size),
        date: new Date().toISOString().split('T')[0],
        version: 1,
        sharedWith: [],
        file: file
      }
      setFiles([...files, newFile])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Helper function to get the appropriate file icon
  const getFileIcon = (type: string): ReactNode => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-400" size={20} />
      case 'image':
        return <Image className="text-blue-400" size={20} />
      case 'spreadsheet':
        return <Table className="text-green-400" size={20} />
      default:
        return <File className="text-gray-400" size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <Navigation />
      <div className="fixed inset-0 bg-[#1a1a1a] z-50 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="mr-4">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-wider">{title}</h1>
                <p className="text-[#999] text-sm">{description}</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="progress-container mb-8">
            <div className="progress-label flex justify-between text-[#999] text-sm mb-2">
              <span>PROGRESS</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar h-2 bg-[#333] rounded-full overflow-hidden">
              <div 
                className={`progress h-full rounded-full ${
                  progressColor === 'coral' ? 'bg-[#f8a387]' : 'bg-[#e2b04a]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="tabs-container border-b border-[#333] mb-8">
            <div className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === null ? 'text-white border-b-2 border-white' : 'text-[#999]'
                }`}
                onClick={() => setActiveTab(null)}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'todo' ? 'text-white border-b-2 border-white' : 'text-[#999]'
                }`}
                onClick={() => setActiveTab('todo')}
              >
                To Do List
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'notes' ? 'text-white border-b-2 border-white' : 'text-[#999]'
                }`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'files' ? 'text-white border-b-2 border-white' : 'text-[#999]'
                }`}
                onClick={() => setActiveTab('files')}
              >
                Files
              </button>
            </div>
          </div>
          
          <div className="content-container">
            {activeTab === null && (
              <div className="overview-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#252525] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[#999] text-sm">Title</p>
                        <p>{title}</p>
                      </div>
                      <div>
                        <p className="text-[#999] text-sm">Description</p>
                        <p>{description}</p>
                      </div>
                      <div>
                        <p className="text-[#999] text-sm">Progress</p>
                        <p>{progress}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#f8a387] rounded-full mr-3"></div>
                        <p className="text-sm">Project created</p>
                        <p className="text-[#999] text-sm ml-auto">April 21, 2025</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#f8a387] rounded-full mr-3"></div>
                        <p className="text-sm">Progress updated to {progress}%</p>
                        <p className="text-[#999] text-sm ml-auto">April 21, 2025</p>
                      </div>
                      {notes.length > 0 && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#f8a387] rounded-full mr-3"></div>
                          <p className="text-sm">Added note: {notes[notes.length - 1].title}</p>
                          <p className="text-[#999] text-sm ml-auto">{notes[notes.length - 1].date}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'todo' && (
              <div className="todo-content">
                <TodoList />
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="notes-content">
                <RichNote 
                  notes={notes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onUpdateNote={handleUpdateNote}
                />
              </div>
            )}
            
            {activeTab === 'files' && (
              <div className="files-content">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999]" size={16} />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <label className="bg-transparent text-white border border-[#444] rounded-full px-4 py-2 flex items-center text-sm hover:bg-[#2a2a2a] transition-all cursor-pointer">
                      <Upload size={16} className="mr-1" />
                      Upload File
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button 
                      onClick={() => setShowFileModal(true)}
                      className="bg-transparent text-white border border-[#444] rounded-full px-4 py-2 flex items-center text-sm hover:bg-[#2a2a2a] transition-all"
                    >
                      <Plus size={16} className="mr-1" />
                      Add File
                    </button>
                  </div>
                </div>

                {filteredFiles.length === 0 ? (
                  <div className="text-center py-8 text-[#999]">
                    {searchQuery ? 'No files found matching your search.' : 'No files yet. Add your first file to get started.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredFiles.map(file => (
                      <div key={file.id} className="bg-[#252525] p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getFileIcon(file.type)}
                            <div>
                              <h4 className="font-medium">{file.name}</h4>
                              <div className="text-[#999] text-sm">
                                {file.type} • {file.size} • Version {file.version}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePreviewFile(file)}
                              className="text-[#999] hover:text-white"
                              title="Preview"
                            >
                              <Image size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateVersion(file.id)}
                              className="text-[#999] hover:text-white"
                              title="Update Version"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-[#999] hover:text-red-400"
                              title="Delete"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-[#999] text-sm">
                          <div>Last modified: {file.date}</div>
                          {file.sharedWith.length > 0 && (
                            <div className="mt-1">
                              Shared with: {file.sharedWith.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showFileModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#252525] rounded-lg p-6 w-full max-w-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add New File</h3>
                        <button
                          onClick={() => setShowFileModal(false)}
                          className="text-[#999] hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <form onSubmit={handleAddFile}>
                        <div className="space-y-4">
                          <div>
                            <input
                              type="text"
                              name="name"
                              value={fileForm.name}
                              onChange={handleFileChange}
                              placeholder="File Name"
                              className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                            />
                          </div>
                          
                          <div>
                            <select
                              name="type"
                              value={fileForm.type}
                              onChange={handleFileChange}
                              className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                            >
                              <option value="Document">Document</option>
                              <option value="PDF">PDF</option>
                              <option value="Image">Image</option>
                              <option value="Spreadsheet">Spreadsheet</option>
                            </select>
                          </div>
                          
                          <div>
                            <input
                              type="text"
                              name="size"
                              value={fileForm.size}
                              onChange={handleFileChange}
                              placeholder="File Size (e.g., 2.4 MB)"
                              className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                            />
                          </div>
                          
                          <div>
                            <div className="flex items-center">
                              <input
                                type="email"
                                value={fileForm.currentShareEmail}
                                onChange={(e) => setFileForm({ ...fileForm, currentShareEmail: e.target.value })}
                                placeholder="Share with email..."
                                className="flex-grow p-2 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddShareEmail}
                                className="ml-2 px-3 py-2 bg-[#333] text-white rounded-md hover:bg-[#444]"
                              >
                                Add
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {fileForm.sharedWith.map(email => (
                                <span
                                  key={email}
                                  className="flex items-center px-2 py-1 bg-[#333] text-white text-sm rounded-full"
                                >
                                  {email}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveShareEmail(email)}
                                    className="ml-1 text-[#999] hover:text-white"
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setShowFileModal(false)}
                            className="px-4 py-2 bg-[#333] text-white rounded-md hover:bg-[#444]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#f8a387] text-[#1a1a1a] font-medium rounded-md hover:opacity-90"
                          >
                            Add File
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {showPreview && selectedFile && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#252525] rounded-lg p-6 w-full max-w-4xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Preview: {selectedFile.name}</h3>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="text-[#999] hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="bg-[#2c2c2c] rounded-lg p-4">
                        {selectedFile.previewUrl ? (
                          <iframe
                            src={selectedFile.previewUrl}
                            className="w-full h-[60vh] border-0"
                            title="File Preview"
                          />
                        ) : (
                          <div className="text-center py-8 text-[#999]">
                            Preview not available for this file type.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}