'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Bold, Italic, List, Link, Image, AlignLeft, CheckSquare, Code, Plus, Search, SortAsc, SortDesc, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Navigation } from './Navigation'
import { CategoryManager } from './CategoryManager'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
  const [newNote, setNewNote] = useState<Partial<NoteItem>>({
    title: '',
    content: '',
    categoryId: null
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deletedNotes, setDeletedNotes] = useState<NoteItem[]>([])
  const editorRef = useRef<HTMLTextAreaElement>(null)

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
                        className="p-4 bg-[#2a2a2a] rounded-lg cursor-move"
                        onClick={() => {
                          setEditingNote(note)
                          setIsModalOpen(true)
                        }}
                      >
                        <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                        <p className="text-gray-400">{note.content}</p>
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingNote ? 'ノートを編集' : '新規ノート'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="タイトル"
                  value={editingNote?.title || newNote.title || ''}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, title: e.target.value })
                    } else {
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded"
                />
                <textarea
                  placeholder="内容"
                  value={editingNote?.content || newNote.content || ''}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, content: e.target.value })
                    } else {
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded h-32"
                />
                <select
                  value={editingNote?.categoryId || newNote.categoryId || ''}
                  onChange={(e) => {
                    const value = e.target.value || null
                    if (editingNote) {
                      setEditingNote({ ...editingNote, categoryId: value })
                    } else {
                      setNewNote({ ...newNote, categoryId: value })
                    }
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded"
                >
                  <option value="">未分類</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingNote(null)
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

