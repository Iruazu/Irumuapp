'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Block, Block as BlockType } from './Block'
import { Plus, Search } from 'lucide-react'

interface BlockEditorProps {
  initialBlocks?: BlockType[]
  onSave?: (blocks: BlockType[]) => void
}

export function BlockEditor({ initialBlocks = [], onSave }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType['type'] | null>(null)

  useEffect(() => {
    if (onSave) {
      onSave(blocks)
    }
  }, [blocks, onSave])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setBlocks(items)
  }

  const addBlock = (index: number, type: BlockType['type']) => {
    const newBlock: BlockType = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index, 0, newBlock)
    setBlocks(newBlocks)
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const fetchOGPData = async (url: string) => {
    try {
      const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('OGPデータの取得に失敗しました:', error)
      return null
    }
  }

  const handleEmbedUrl = async (url: string, blockId: string) => {
    const ogpData = await fetchOGPData(url)
    if (ogpData) {
      setBlocks(blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              type: 'embed',
              content: url,
              metadata: {
                title: ogpData.title,
                description: ogpData.description,
                thumbnail: ogpData.image,
                url
              }
            }
          : block
      ))
    }
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Block
                  key={block.id}
                  block={block}
                  index={index}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                  onAddBlock={(index) => {
                    setShowBlockMenu(true)
                    setSelectedBlockType(null)
                  }}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showBlockMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-4 rounded-lg w-96">
            <div className="flex items-center gap-2 mb-4">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="ブロックを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#2a2a2a] p-2 rounded"
              />
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  addBlock(blocks.length, 'text')
                  setShowBlockMenu(false)
                }}
                className="w-full p-2 text-left hover:bg-[#2a2a2a] rounded"
              >
                テキスト
              </button>
              <button
                onClick={() => {
                  addBlock(blocks.length, 'page')
                  setShowBlockMenu(false)
                }}
                className="w-full p-2 text-left hover:bg-[#2a2a2a] rounded"
              >
                ページ
              </button>
              <button
                onClick={() => {
                  addBlock(blocks.length, 'embed')
                  setShowBlockMenu(false)
                }}
                className="w-full p-2 text-left hover:bg-[#2a2a2a] rounded"
              >
                埋め込み
              </button>
              <button
                onClick={() => {
                  addBlock(blocks.length, 'image')
                  setShowBlockMenu(false)
                }}
                className="w-full p-2 text-left hover:bg-[#2a2a2a] rounded"
              >
                画像
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 