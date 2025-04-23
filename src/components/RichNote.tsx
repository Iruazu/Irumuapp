'use client'

import { useState, useEffect, useRef } from 'react'
import { CategoryManager } from './CategoryManager'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Eye, Edit2, X, Maximize2, Minimize2 } from 'lucide-react'

export interface NoteItem {
  id: string
  title: string
  content: string
  date: string
  categoryId: string | null
}

interface Category {
  id: string
  name: string
  noteCount: number
  isOpen: boolean
}

interface RichNoteProps {
  notes: NoteItem[]
  onAddNote: (note: Omit<NoteItem, 'id' | 'date'>) => void
  onDeleteNote: (id: string) => void
  onUpdateNote: (id: string, note: Partial<NoteItem>) => void
}

export function RichNote({ notes, onAddNote, onDeleteNote, onUpdateNote }: RichNoteProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null)
  const [viewingNote, setViewingNote] = useState<NoteItem | null>(null)
  const [newNote, setNewNote] = useState<Partial<NoteItem>>({
    title: '',
    content: '',
    categoryId: null
  })
  const [modalSize, setModalSize] = useState({ width: 'md', height: 'auto' })

  const modalRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories')
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  // カテゴリーの作成
  const handleCreateCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      noteCount: 0,
      isOpen: true
    }
    setCategories([...categories, newCategory])
  }

  // カテゴリーの削除
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  // カテゴリーの名前変更
  const handleRenameCategory = (id: string, newName: string) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    ))
  }

  // ノートの作成・更新
  const handleSaveNote = () => {
    if (editingNote) {
      onUpdateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        categoryId: editingNote.categoryId
      })
    } else if (newNote.title && newNote.content) {
      onAddNote({
        title: newNote.title,
        content: newNote.content,
        categoryId: newNote.categoryId || null
      })
    }
    setIsModalOpen(false)
    setEditingNote(null)
    setViewingNote(null)
    setNewNote({ title: '', content: '', categoryId: null })
  }

  // ドラッグ＆ドロップの処理
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const noteId = result.draggableId
    const newCategoryId = destination.droppableId === 'uncategorized' ? null : destination.droppableId

    const note = notes.find(n => n.id === noteId)
    if (note) {
      onUpdateNote(noteId, { categoryId: newCategoryId })
    }
  }

  // カテゴリーごとのノート数を更新
  useEffect(() => {
    const updatedCategories = categories.map(category => ({
      ...category,
      noteCount: notes.filter(note => note.categoryId === category.id).length
    }))
    setCategories(updatedCategories)
  }, [notes])

  const filteredNotes = selectedCategoryId
    ? notes.filter(note => note.categoryId === selectedCategoryId)
    : notes

  const getModalSizeClass = () => {
    switch (modalSize.width) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-lg'
      case 'xl': return 'max-w-xl'
      default: return 'max-w-md'
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('resize-handle')) {
      setIsResizing(true)
      setStartPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !modalRef.current) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    const newWidth = Math.max(400, modalRef.current.offsetWidth + deltaX)
    const newHeight = Math.max(300, modalRef.current.offsetHeight + deltaY)

    modalRef.current.style.width = `${newWidth}px`
    modalRef.current.style.height = `${newHeight}px`

    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const toggleMaximize = () => {
    if (!modalRef.current) return

    if (isMaximized) {
      modalRef.current.style.width = '80%'
      modalRef.current.style.height = '80%'
      modalRef.current.style.top = '10%'
      modalRef.current.style.left = '10%'
    } else {
      modalRef.current.style.width = '95%'
      modalRef.current.style.height = '95%'
      modalRef.current.style.top = '2.5%'
      modalRef.current.style.left = '2.5%'
    }

    setIsMaximized(!isMaximized)
  }

  return (
    <div className="flex h-full">
      <div className="w-64 p-4 border-r border-gray-700">
        <CategoryManager
          onCategorySelect={setSelectedCategoryId}
          onCategoryCreate={handleCreateCategory}
          onCategoryDelete={handleDeleteCategory}
          onCategoryRename={handleRenameCategory}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">ノート</h2>
          <button
            onClick={() => {
              setNewNote({ title: '', content: '', categoryId: null })
              setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            新規ノート
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notes" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 bg-[#2a2a2a] rounded-lg cursor-move hover:bg-[#3a3a3a] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{note.title}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setViewingNote(note)
                                setIsModalOpen(true)
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingNote(note)
                                setIsModalOpen(true)
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-3">{note.content}</p>
                        {note.categoryId && (
                          <span className="mt-2 inline-block px-2 py-1 text-xs bg-[#3a3a3a] rounded">
                            {categories.find(c => c.id === note.categoryId)?.name}
                          </span>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {(isModalOpen && (editingNote || viewingNote || newNote)) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              ref={modalRef}
              className="bg-[#1a1a1a] p-6 rounded-lg relative"
              style={{
                width: '80%',
                height: '80%',
                minWidth: '400px',
                minHeight: '300px',
                maxWidth: '95%',
                maxHeight: '95%',
                top: '10%',
                left: '10%',
                position: 'fixed',
                overflow: 'auto'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingNote ? 'ノートを編集' : viewingNote ? 'ノートを表示' : '新規ノート'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleMaximize}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingNote(null)
                      setViewingNote(null)
                      setNewNote({ title: '', content: '', categoryId: null })
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 h-[calc(100%-4rem)]">
                <input
                  type="text"
                  placeholder="タイトル"
                  value={editingNote?.title || viewingNote?.title || newNote.title || ''}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, title: e.target.value })
                    } else if (!viewingNote) {
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded"
                  disabled={!!viewingNote}
                />
                <textarea
                  placeholder="内容"
                  value={editingNote?.content || viewingNote?.content || newNote.content || ''}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, content: e.target.value })
                    } else if (!viewingNote) {
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded flex-1 h-[calc(100%-8rem)]"
                  disabled={!!viewingNote}
                />
                <select
                  value={editingNote?.categoryId || viewingNote?.categoryId || newNote.categoryId || ''}
                  onChange={(e) => {
                    const value = e.target.value || null
                    if (editingNote) {
                      setEditingNote({ ...editingNote, categoryId: value })
                    } else if (!viewingNote) {
                      setNewNote({ ...newNote, categoryId: value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded"
                  disabled={!!viewingNote}
                >
                  <option value="">未分類</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!viewingNote && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(false)
                        setEditingNote(null)
                        setViewingNote(null)
                        setNewNote({ title: '', content: '', categoryId: null })
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </div>
                )}
              </div>

              {/* リサイズハンドル */}
              <div
                className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={handleMouseDown}
              >
                <div className="w-full h-full border-r-2 border-b-2 border-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

