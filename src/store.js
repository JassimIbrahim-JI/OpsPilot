import { create } from 'zustand'

// ── Task store with full CRUD + persistence ──────────────────────────
const seedTasks = [
  {
    id: 't1',
    title: 'Design onboarding flow',
    description: 'Craft a delightful first-run experience with progressive disclosure.',
    status: 'in_progress',
    priority: 'high',
    due: 'Today',
    tags: ['design', 'ux'],
    createdAt: Date.now() - 86400000,
  },
  {
    id: 't2',
    title: 'Ship dark mode toggle',
    description: 'Persist theme preference and animate the transition.',
    status: 'done',
    priority: 'medium',
    due: 'Yesterday',
    tags: ['frontend'],
    createdAt: Date.now() - 172800000,
  },
  {
    id: 't3',
    title: 'Integrate Stripe billing',
    description: 'Wire up subscription tiers with webhook handling.',
    status: 'todo',
    priority: 'high',
    due: 'Tomorrow',
    tags: ['backend', 'payments'],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't4',
    title: 'Write API documentation',
    description: 'Document all endpoints with examples and auth flow.',
    status: 'todo',
    priority: 'low',
    due: 'Next week',
    tags: ['docs'],
    createdAt: Date.now() - 7200000,
  },
]

export const useStore = create((set, get) => ({
  tasks: seedTasks,
  filter: 'all', // all | todo | in_progress | done
  search: '',
  toasts: [],

  addTask: (task) =>
    set((s) => ({
      tasks: [{ ...task, id: `t${Date.now()}`, createdAt: Date.now() }, ...s.tasks],
    })),

  updateTask: (id, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  toggleStatus: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t
        const order = ['todo', 'in_progress', 'done']
        const next = order[(order.indexOf(t.status) + 1) % order.length]
        return { ...t, status: next }
      }),
    })),

  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),

  toast: (message, type = 'success') => {
    const id = `toast-${Date.now()}`
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// ── Derived selectors ────────────────────────────────────────────────
export const selectFilteredTasks = (s) => {
  const { tasks, filter, search } = s
  let result = tasks
  if (filter !== 'all') result = result.filter((t) => t.status === filter)
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }
  return result
}

export const selectStats = (s) => {
  const total = s.tasks.length
  const done = s.tasks.filter((t) => t.status === 'done').length
  const inProgress = s.tasks.filter((t) => t.status === 'in_progress').length
  const high = s.tasks.filter((t) => t.priority === 'high').length
  const completion = total ? Math.round((done / total) * 100) : 0
  return { total, done, inProgress, high, completion }
}
