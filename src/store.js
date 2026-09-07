import { create } from 'zustand'

const fallbackTasks = [
  {
    id: 't1',
    userId: 'user_demo',
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
    userId: 'user_demo',
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
    userId: 'user_demo',
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
    userId: 'user_demo',
    title: 'Write API documentation',
    description: 'Document all endpoints with examples and auth flow.',
    status: 'todo',
    priority: 'low',
    due: 'Next week',
    tags: ['docs'],
    createdAt: Date.now() - 7200000,
  },
]

const apiRequest = async (url, options = {}) => {
  const requestHeaders = new Headers({
    'Content-Type': 'application/json',
  })

  const extraHeaders = options.headers || {}
  Object.entries(extraHeaders).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      requestHeaders.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    ...options,
    headers: requestHeaders,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

const getStoredToken = () => {
  try {
    return localStorage.getItem('flowpilot-token') || localStorage.getItem('taskflow-token') || 'demo-token'
  } catch {
    return 'demo-token'
  }
}

const getStoredTheme = () => {
  try {
    return localStorage.getItem('flowpilot-theme') ||
      localStorage.getItem('taskflow-theme') || 'dark'
  } catch {
    return 'dark'
  }
}

const getStoredMemory = () => {
  try {
    return (
      localStorage.getItem('flowpilot-memory') ||
      localStorage.getItem('taskflow-memory') ||
      'My priority is to reduce bottlenecks and finish the highest-impact work first.'
    )
  } catch {
    return 'My priority is to reduce bottlenecks and finish the highest-impact work first.'
  }
}

export const useStore = create((set, get) => ({
  tasks: [],
  filter: 'all',
  search: '',
  toasts: [],
  isHydrated: false,
  token: getStoredToken(),
  user: { id: 'user_demo', name: 'Jassim Abuanzeh', email: 'demo@flowpilot.app' },
  authLoading: false,
  theme: getStoredTheme(),
  aiMemory: getStoredMemory(),

  setAuthSession: (token, user) => {
    if (token) {
      localStorage.setItem('flowpilot-token', token)
    } else {
      localStorage.removeItem('flowpilot-token')
      localStorage.removeItem('taskflow-token')
    }
    set({ token, user })
  },

  setTheme: (theme) => {
    const nextTheme = theme === 'light' ? 'light' : 'dark'
    try {
      localStorage.setItem('flowpilot-theme', nextTheme)
    } catch {}
    set({ theme: nextTheme })
  },

  setAiMemory: (memory) => {
    const nextMemory = String(memory || '').trim() || 'My priority is to reduce bottlenecks and finish the highest-impact work first.'
    try {
      localStorage.setItem('flowpilot-memory', nextMemory)
    } catch {}
    set({ aiMemory: nextMemory })
  },

  login: async ({ email, password }) => {
    const payload = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    set({ token: payload.token, user: payload.user, authLoading: false })
    localStorage.setItem('flowpilot-token', payload.token)
    return payload
  },

  signup: async ({ name, email, password }) => {
    const payload = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    set({ token: payload.token, user: payload.user, authLoading: false })
    localStorage.setItem('flowpilot-token', payload.token)
    return payload
  },

  demoLogin: async () => {
    const payload = await apiRequest('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ email: 'demo@flowpilot.app', password: 'demo123' }),
    })
    set({ token: payload.token, user: payload.user, authLoading: false })
    localStorage.setItem('flowpilot-token', payload.token)
    return payload
  },

  bootstrapAuth: async () => {
    const savedToken = getStoredToken()
    if (!savedToken || savedToken === 'demo-token') {
      try {
        const payload = await get().demoLogin()
        return payload
      } catch (error) {
        set({ token: '', user: null, authLoading: false })
        return null
      }
    }

    try {
      const payload = await apiRequest('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      set({ token: savedToken, user: payload.user, authLoading: false })
      return payload
    } catch (error) {
      localStorage.removeItem('flowpilot-token')
      localStorage.removeItem('taskflow-token')
      set({ token: '', user: null, authLoading: false })
      return null
    }
  },

  logout: () => {
    localStorage.removeItem('flowpilot-token')
    localStorage.removeItem('taskflow-token')
    set({ token: '', user: null, tasks: [] })
  },

  updateProfile: (profile) => {
    const current = get().user || { id: 'user_demo', name: 'Jassim Abuanzeh', email: 'demo@flowpilot.app' }
    const nextUser = {
      ...current,
      name: profile.name || current.name,
      email: profile.email || current.email,
    }
    set({ user: nextUser })
  },

  hydrateTasks: async () => {
    const token = get().token || getStoredToken()
    if (!token) {
      set({ tasks: fallbackTasks, isHydrated: true })
      return fallbackTasks
    }

    try {
      const payload = await apiRequest('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ tasks: payload.tasks || [], isHydrated: true })
      return payload.tasks || []
    } catch (error) {
      set({ tasks: fallbackTasks, isHydrated: true })
      get().toast(error.message || 'Unable to load tasks', 'error')
      return fallbackTasks
    }
  },

  askCopilot: async (prompt) => {
    const token = get().token || getStoredToken()
    return apiRequest('/api/copilot', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prompt }),
    })
  },

  addTask: async (task) => {
    const token = get().token || getStoredToken()
    const payload = await apiRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: { Authorization: `Bearer ${token}` },
    })

    set((state) => ({ tasks: [payload.task, ...state.tasks] }))
    return payload.task
  },

  updateTask: async (id, patch) => {
    const token = get().token || getStoredToken()
    const payload = await apiRequest(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
      headers: { Authorization: `Bearer ${token}` },
    })

    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? payload.task : task)),
    }))

    return payload.task
  },

  deleteTask: async (id) => {
    const token = get().token || getStoredToken()
    await apiRequest(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
  },

  toggleStatus: async (id) => {
    const token = get().token || getStoredToken()
    const task = get().tasks.find((item) => item.id === id)
    if (!task) return null

    const order = ['todo', 'in_progress', 'done']
    const nextStatus = order[(order.indexOf(task.status) + 1) % order.length]

    const payload = await apiRequest(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
      headers: { Authorization: `Bearer ${token}` },
    })

    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === id ? payload.task : item)),
    }))

    return payload.task
  },

  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),

  toast: (message, type = 'success') => {
    const id = `toast-${Date.now()}`
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toastItem) => toastItem.id !== id) }))
    }, 3000)
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toastItem) => toastItem.id !== id) })),
}))

export const selectFilteredTasks = (state) => {
  const { tasks, filter, search } = state
  let result = tasks

  if (filter !== 'all') result = result.filter((task) => task.status === filter)

  if (search) {
    const query = search.toLowerCase()
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return result
}

export const selectStats = (state) => {
  const total = state.tasks.length
  const done = state.tasks.filter((task) => task.status === 'done').length
  const inProgress = state.tasks.filter((task) => task.status === 'in_progress').length
  const high = state.tasks.filter((task) => task.priority === 'high').length
  const completion = total ? Math.round((done / total) * 100) : 0

  return { total, done, inProgress, high, completion }
}
