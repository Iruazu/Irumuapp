'use client'

import { useState } from 'react'
import { Plus, Folder, FolderOpen, Trash, Edit2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  noteCount: number
  isOpen: boolean
}

interface CategoryManagerProps {
  onCategorySelect: (categoryId: string | null) => void
  onCategoryCreate: (name: string) => void
  onCategoryDelete: (id: string) => void
  onCategoryRename: (id: string, newName: string) => void
  categories: Category[]
  selectedCategoryId: string | null
}

export function CategoryManager({
  onCategorySelect,
  onCategoryCreate,
  onCategoryDelete,
  onCategoryRename,
  categories,
  selectedCategoryId
}: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCategoryCreate(newCategoryName.trim())
      setNewCategoryName('')
      setIsCreating(false)
    }
  }

  const handleRenameCategory = (id: string) => {
    if (editingName.trim()) {
      onCategoryRename(id, editingName.trim())
      setEditingCategoryId(null)
      setEditingName('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400">カテゴリー</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
          aria-label="新しいカテゴリーを作成"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full flex items-center px-2 py-1 rounded-md text-sm ${
            selectedCategoryId === null
              ? 'bg-[#2a2a2a] text-white'
              : 'text-gray-400 hover:bg-[#2a2a2a]'
          }`}
        >
          <Folder className="w-4 h-4 mr-2" />
          すべてのノート
        </button>

        {categories.map((category) => (
          <div key={category.id} className="group">
            <div className="flex items-center">
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`flex-1 flex items-center px-2 py-1 rounded-md text-sm ${
                  selectedCategoryId === category.id
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a]'
                }`}
              >
                {category.isOpen ? (
                  <FolderOpen className="w-4 h-4 mr-2" />
                ) : (
                  <Folder className="w-4 h-4 mr-2" />
                )}
                {editingCategoryId === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameCategory(category.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameCategory(category.id)
                      }
                    }}
                    className="bg-transparent border-none outline-none"
                    autoFocus
                  />
                ) : (
                  <span>{category.name}</span>
                )}
                <span className="ml-2 text-xs text-gray-500">
                  ({category.noteCount})
                </span>
              </button>

              <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                <button
                  onClick={() => {
                    setEditingCategoryId(category.id)
                    setEditingName(category.name)
                  }}
                  className="p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
                  aria-label="カテゴリー名を編集"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onCategoryDelete(category.id)}
                  className="p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
                  aria-label="カテゴリーを削除"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {isCreating && (
          <div className="flex items-center px-2 py-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onBlur={handleCreateCategory}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCategory()
                }
              }}
              placeholder="新しいカテゴリー名"
              className="flex-1 bg-transparent border-none outline-none text-sm"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  )
} 