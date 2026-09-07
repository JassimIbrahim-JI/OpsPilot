import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Clock, X } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '../components/ui.jsx'
import { useStore, selectFilteredTasks } from '../store.js'
import { stagger, item } from '../lib/motion.jsx'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'Todo' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

const statusIcon = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
}

const statusTone = {
  todo: 'slate',
  in_progress: 'amber',
  done: 'emerald',
}

const priorityTone = {
  low: 'slate',
  medium: 'indigo',
  high: 'red',
}

export default function TasksView() {
  const tasks = useStore(selectFilteredTasks)
  const filter = useStore((s) => s.filter)
  const setFilter = useStore((s) => s.setFilter)
  const addTask = useStore((s) => s.addTask)
  const updateTask = useStore((s) => s.updateTask)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleStatus = useStore((s) => s.toggleStatus)
  const toast = useStore((s) => s.toast)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const openCreate = () => {
    setEditing(null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setTitle(t.title)
    setDescription(t.description)
    setPriority(t.priority)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast('Title is required', 'error')
      return
    }

    try {
      if (editing) {
        await updateTask(editing.id, { title, description, priority })
        toast('Task updated', 'success')
      } else {
        await addTask({ title, description, priority, status: 'todo', due: 'Today', tags: [] })
        toast('Task created', 'success')
      }
      setModalOpen(false)
    } catch (error) {
      toast(error.message || 'Unable to save task', 'error')
    }
  }

  const handleDelete = async (t) => {
    try {
      await deleteTask(t.id)
      toast('Task deleted', 'warning')
    } catch (error) {
      toast(error.message || 'Unable to delete task', 'error')
    }
  }

  const handleToggle = async (t) => {
    try {
      await toggleStatus(t.id)
      toast('Status updated', 'success')
    } catch (error) {
      toast(error.message || 'Unable to update status', 'error')
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Mission control</h1>
          <p className="text-slate-500 mt-1">{tasks.length} execution signals in view</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add execution signal
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white shadow-glow'
                : 'glass text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Task list */}
      <motion.div variants={stagger} className="flex flex-col gap-3">
        <AnimatePresence>
          {tasks.map((t) => {
            const StatusIcon = statusIcon[t.status]
            return (
              <motion.div
                key={t.id}
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="group">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggle(t)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold text-slate-100 ${
                            t.status === 'done' ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {t.title}
                        </h3>
                        <Badge tone={statusTone[t.status]}>{t.status.replace('_', ' ')}</Badge>
                        <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                      </div>
                      {t.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500">{t.due}</span>
                        {t.tags?.map((tag) => (
                          <span key={tag} className="text-xs text-indigo-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div variants={item} className="text-center py-16 text-slate-500">
            No tasks found. Click "New Task" to get started.
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100">
                  {editing ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  autoFocus
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                />
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                        priority === p
                          ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white'
                          : 'glass text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSave}>
                    {editing ? 'Save Changes' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
