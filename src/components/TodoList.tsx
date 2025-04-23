'use client'

import { useState } from 'react'
import { Plus, X, Calendar, Edit2, Trash2, SortAsc, SortDesc } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Navigation } from './Navigation'

interface TodoItem {
  id: number
  title: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
}

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: 'プロジェクトの要件定義', completed: false, dueDate: '2024-03-15', priority: 'high' },
    { id: 2, title: 'UIデザインの作成', completed: false, dueDate: '2024-03-20', priority: 'medium' },
    { id: 3, title: 'データベース設計', completed: true, dueDate: '2024-03-10', priority: 'high' }
  ])
  const [newTodo, setNewTodo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [todoForm, setTodoForm] = useState({
    title: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        title: newTodo,
        completed: false,
        priority: 'medium'
      }
      setTodos([...todos, newTodoItem])
      setNewTodo('')
    }
  }

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo)
    setTodoForm({
      title: todo.title,
      dueDate: todo.dueDate || '',
      priority: todo.priority
    })
    setShowModal(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id
          ? { ...todo, ...todoForm }
          : todo
      ))
    } else {
      const newTodo: TodoItem = {
        id: Date.now(),
        title: todoForm.title,
        completed: false,
        dueDate: todoForm.dueDate,
        priority: todoForm.priority
      }
      setTodos([...todos, newTodo])
    }
    setShowModal(false)
    setEditingTodo(null)
  }

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
    }
  }

  // カレンダー表示用の関数
  const getCalendarDays = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const days = []
    const startDay = firstDayOfMonth.getDay()
    
    // 前月の日付を追加
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(firstDayOfMonth)
      date.setDate(date.getDate() - (i + 1))
      days.push(date)
    }
    
    // 当月の日付を追加
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i)
      days.push(date)
    }
    
    // 次月の日付を追加（カレンダーを6行にするため）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDayOfMonth)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  // タスクのフィルタリングとソート
  const getFilteredAndSortedTodos = () => {
    let filteredTodos = [...todos]
    
    if (selectedDate) {
      filteredTodos = filteredTodos.filter(todo => todo.dueDate === selectedDate)
    }
    
    return filteredTodos.sort((a, b) => {
      if (sortBy === 'date') {
        if (!a.dueDate || !b.dueDate) return 0
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return sortOrder === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Navigation />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">To Do List</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
              className="bg-[#2c2c2c] border border-[#444] rounded-md text-white px-3 py-1"
            >
              <option value="date">日付</option>
              <option value="priority">優先度</option>
              <option value="title">タイトル</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-md hover:bg-[#2a2a2a]"
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>
          </div>
          <button
            onClick={() => {
              setEditingTodo(null)
              setTodoForm({ title: '', dueDate: '', priority: 'medium' })
              setShowModal(true)
            }}
            className="flex items-center space-x-2 bg-[#333] text-white px-4 py-2 rounded-md hover:bg-[#444]"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#252525] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Tasks</h3>
          <div className="space-y-4">
            {getFilteredAndSortedTodos().map(todo => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-4 bg-[#2c2c2c] rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="w-5 h-5 rounded border-[#444] bg-[#333]"
                  />
                  <div>
                    <p className={`${todo.completed ? 'line-through text-[#666]' : 'text-white'}`}>
                      {todo.title}
                    </p>
                    {todo.dueDate && (
                      <p className="text-sm text-[#999] flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {format(new Date(todo.dueDate), 'yyyy年MM月dd日', { locale: ja })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getPriorityColor(todo.priority)}`}>
                    {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                  </span>
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="text-[#999] hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-[#999] hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#252525] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
          <div className="grid grid-cols-7 gap-2">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center text-[#999] text-sm">
                {day}
              </div>
            ))}
            {getCalendarDays().map((date, index) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const dayTodos = todos.filter(todo => todo.dueDate === dateStr)
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              const isCurrentMonth = date.getMonth() === new Date().getMonth()
              const isSelected = selectedDate === dateStr
              
              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg cursor-pointer ${
                    isSelected ? 'bg-[#f8a387]' :
                    isToday ? 'bg-[#333]' :
                    isCurrentMonth ? 'bg-[#2c2c2c]' : 'bg-[#252525]'
                  }`}
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                >
                  <div className={`text-sm mb-1 ${isCurrentMonth ? 'text-[#999]' : 'text-[#666]'}`}>
                    {format(date, 'd')}
                  </div>
                  {dayTodos.map(todo => (
                    <div
                      key={todo.id}
                      className={`text-xs p-1 rounded mb-1 ${
                        todo.completed ? 'bg-[#444] text-[#666]' : 'bg-[#333] text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTodo(todo)
                      }}
                    >
                      {todo.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252525] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingTodo ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#999] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={todoForm.title}
                    onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                    placeholder="Task Title"
                    className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="date"
                    value={todoForm.dueDate}
                    onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
                    className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <select
                    value={todoForm.priority}
                    onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-3 bg-[#2c2c2c] border border-[#444] rounded-md text-white"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#333] text-white rounded-md hover:bg-[#444]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f8a387] text-[#1a1a1a] font-medium rounded-md hover:opacity-90"
                >
                  {editingTodo ? 'Update' : 'Add'} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}