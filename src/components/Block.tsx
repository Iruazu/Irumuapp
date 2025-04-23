'use client'

import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, GripVertical, X, ExternalLink } from 'lucide-react'

export interface Block {
  id: string
  type: 'text' | 'page' | 'embed' | 'image'
  content: string
  metadata?: {
    title?: string
    description?: string
    thumbnail?: string
    url?: string
  }
}

interface BlockProps {
  block: Block
  index: number
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
  onAddBlock: (index: number) => void
}

export function Block({ block, index, onUpdate, onDelete, onAddBlock }: BlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/' && !isEditing) {
      setShowBlockMenu(true)
    }
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div
            ref={contentRef}
            contentEditable={isEditing}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
            className="min-h-[1.5em] outline-none"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )
      case 'page':
        return (
          <div className="p-4 border border-gray-700 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{block.metadata?.title || '無題のページ'}</h3>
              <a href={block.metadata?.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="text-gray-400 hover:text-white" />
              </a>
            </div>
            {block.metadata?.description && (
              <p className="text-sm text-gray-400 mt-2">{block.metadata.description}</p>
            )}
          </div>
        )
      case 'embed':
        return (
          <div className="p-4 border border-gray-700 rounded-lg">
            {block.metadata?.thumbnail && (
              <img
                src={block.metadata.thumbnail}
                alt={block.metadata.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{block.metadata?.title}</h3>
                {block.metadata?.description && (
                  <p className="text-sm text-gray-400 mt-1">{block.metadata.description}</p>
                )}
              </div>
              <a href={block.metadata?.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>
        )
      case 'image':
        return (
          <div className="relative group">
            <img
              src={block.content}
              alt="画像"
              className="max-w-full h-auto rounded-lg"
            />
            {isEditing && (
              <button
                onClick={() => onDelete(block.id)}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="group relative"
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-move"
            >
              <GripVertical size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              {renderBlockContent()}
            </div>
          </div>
          <button
            onClick={() => onAddBlock(index + 1)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#2a2a2a] rounded"
          >
            <Plus size={16} className="text-gray-400" />
          </button>
        </div>
      )}
    </Draggable>
  )
} 