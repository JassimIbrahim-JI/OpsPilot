import express from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 4000)
const isServerless = process.env.VERCEL === '1'
const app = express()
const sessions = new Map()
let runtimeTasks = null

const dataDir = path.join(__dirname, 'data')
const usersFile = path.join(dataDir, 'users.json')
const tasksFile = path.join(dataDir, 'tasks.json')

const seedTasks = [
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

const demoUser = {
  id: 'user_demo',
  name: 'Jassim Abuanzeh',
  email: 'demo@flowpilot.app',
  passwordHash: '',
  createdAt: Date.now(),
}

const ensureDataFiles = () => {
  fs.mkdirSync(dataDir, { recursive: true })

  if (!fs.existsSync(usersFile)) {
    const seededUsers = [{ ...demoUser, passwordHash: hashPassword('demo123') }]
    fs.writeFileSync(usersFile, JSON.stringify(seededUsers, null, 2))
  }

  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify(seedTasks, null, 2))
  }
}

const ensureDemoSession = () => {
  const users = readUsers()
  const demoAccount = users.find((entry) => entry.email.toLowerCase() === 'demo@flowpilot.app')
  if (demoAccount) {
    sessions.set('demo-token', demoAccount.id)
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false
  const [salt, hash] = storedHash.split(':')
  const derived = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

const readUsers = () => {
  ensureDataFiles()
  try {
    const raw = fs.readFileSync(usersFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeUsers = (users) => {
  if (isServerless) return
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

const readTasks = () => {
  if (isServerless && runtimeTasks) return runtimeTasks
  ensureDataFiles()
  try {
    const raw = fs.readFileSync(tasksFile, 'utf8')
    const parsed = JSON.parse(raw)
    const tasks = sanitizeTasks(Array.isArray(parsed) ? parsed : [])
    if (isServerless) runtimeTasks = tasks
    return tasks
  } catch {
    return []
  }
}

const writeTasks = (tasks) => {
  const sanitized = sanitizeTasks(tasks)
  if (isServerless) {
    runtimeTasks = sanitized
    return
  }
  fs.writeFileSync(tasksFile, JSON.stringify(sanitized, null, 2))
}

const normalizeTask = (taskInput = {}) => {
  const nextId = taskInput.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const nextTitle = String(taskInput.title || '').trim()

  return {
    id: nextId,
    userId: taskInput.userId || 'user_demo',
    title: nextTitle,
    description: String(taskInput.description || ''),
    status: ['todo', 'in_progress', 'done'].includes(taskInput.status) ? taskInput.status : 'todo',
    priority: ['low', 'medium', 'high'].includes(taskInput.priority) ? taskInput.priority : 'medium',
    due: taskInput.due || 'Today',
    tags: Array.isArray(taskInput.tags) ? taskInput.tags.filter(Boolean).slice(0, 5) : [],
    createdAt: Number(taskInput.createdAt) || Date.now(),
  }
}

const sanitizeTasks = (entries = []) => {
  if (!Array.isArray(entries)) return []

  return entries
    .filter(Boolean)
    .map((entry) => normalizeTask(entry))
    .filter((entry) => {
      const title = String(entry.title || '').trim()
      return title.length > 0 && title.toLowerCase() !== 'untitled task'
    })
}

const buildStats = (tasks) => {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'done').length
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length
  const high = tasks.filter((task) => task.priority === 'high').length
  const completion = total ? Math.round((done / total) * 100) : 0

  return { total, done, inProgress, high, completion }
}

const createSessionToken = () => crypto.randomBytes(32).toString('hex')

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  const userId = token === 'demo-token' ? 'user_demo' : sessions.get(token)
  if (!userId) {
    return res.status(401).json({ message: 'Session expired or invalid.' })
  }

  const users = readUsers()
  const user = users.find((entry) => entry.id === userId)
  if (!user) {
    return res.status(401).json({ message: 'User not found.' })
  }

  req.user = { id: user.id, name: user.name, email: user.email }
  return next()
}

app.use(express.json({ limit: '1mb' }))

ensureDemoSession()

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'opspilot-api', time: new Date().toISOString() })
})

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  const users = readUsers()
  const normalizedEmail = String(email).trim().toLowerCase()
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(String(password)),
    createdAt: Date.now(),
  }

  users.push(newUser)
  writeUsers(users)

  const token = createSessionToken()
  sessions.set(token, newUser.id)
  return res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    message: 'Account created successfully.',
  })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const users = readUsers()
  const user = users.find((entry) => entry.email.toLowerCase() === String(email).trim().toLowerCase())
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = createSessionToken()
  sessions.set(token, user.id)

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
    message: 'Logged in successfully.',
  })
})

app.post('/api/auth/demo-login', (_req, res) => {
  ensureDemoSession()
  const users = readUsers()
  const user = users.find((entry) => entry.email.toLowerCase() === 'demo@flowpilot.app')
  if (!user) {
    return res.status(404).json({ message: 'Demo user missing.' })
  }

  const token = isServerless ? 'demo-token' : createSessionToken()
  sessions.set(token, user.id)

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
    message: 'Demo session ready.',
  })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

app.get('/api/tasks', requireAuth, (_req, res) => {
  const tasks = readTasks().filter((task) => task.userId === _req.user.id)
  res.json({ tasks })
})

app.get('/api/stats', requireAuth, (req, res) => {
  const tasks = readTasks().filter((task) => task.userId === req.user.id)
  res.json({ stats: buildStats(tasks) })
})

app.post('/api/copilot', requireAuth, (req, res) => {
  const prompt = String(req.body?.prompt || '').trim()
  if (!prompt) {
    return res.status(400).json({ message: 'A copilot question is required.' })
  }

  const tasks = readTasks().filter((task) => task.userId === req.user.id)
  const active = tasks.filter((task) => task.status !== 'done')
  const highImpact = active.filter((task) => task.priority === 'high')
  const overdue = active.filter((task) => task.due === 'Yesterday')
  const inProgress = active.filter((task) => task.status === 'in_progress')
  const next = [...active].sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 }
    return priority[a.priority] - priority[b.priority] || a.createdAt - b.createdAt
  })[0]
  const lowerPrompt = prompt.toLowerCase()
  const asksRisk = /risk|problem|block|danger|خطر|مشكلة|عالق/.test(lowerPrompt)
  const asksPlan = /plan|how|step|start|خطة|كيف|خطوات|ابدأ/.test(lowerPrompt)
  const decision = overdue.length
    ? `Resolve the overdue item "${overdue[0].title}" before starting new work.`
    : next
      ? `Move "${next.title}" into a focused execution block next.`
      : 'Review the operating system and define the next measurable outcome.'
  const steps = next
    ? [
        `Clarify the done condition for "${next.title}" in one sentence.`,
        `Break it into one 25-minute first action and remove one dependency.`,
        `Work on it without switching context, then mark the result or blocker.`,
      ]
    : ['Define the outcome', 'Choose the smallest verifiable action', 'Schedule a review point']
  const risks = [
    ...(overdue.length ? [`Overdue work: ${overdue.map((task) => task.title).join(', ')}`] : []),
    ...(highImpact.length > 2 ? ['Too many high-impact items are competing for attention.'] : []),
    ...(inProgress.length > 1 ? ['Context switching risk: multiple items are in progress.'] : []),
  ]
  return res.json({
    decision,
    rationale: asksRisk
      ? `The main risk is execution spread across ${active.length} active items. Reduce work in progress before adding scope.`
      : asksPlan
        ? `This plan prioritizes impact and reversibility using the current ${active.length}-item operating context.`
        : `I reviewed ${tasks.length} work signals and selected the next move using priority, status, and due date.`,
    steps,
    risks: risks.length ? risks : ['No immediate risk detected; keep the review cadence active.'],
    confidence: next ? 0.86 : 0.62,
    context: { active: active.length, highImpact: highImpact.length, overdue: overdue.length },
  })
})

app.post('/api/tasks', requireAuth, (req, res) => {
  const incomingTitle = String(req.body?.title || '').trim()
  if (!incomingTitle || incomingTitle.toLowerCase() === 'untitled task') {
    return res.status(400).json({ message: 'Task title is required.' })
  }

  const tasks = readTasks()
  const task = normalizeTask({
    ...req.body,
    title: incomingTitle,
    userId: req.user.id,
    createdAt: Date.now(),
  })

  const nextTasks = [task, ...tasks]
  writeTasks(nextTasks)
  return res.status(201).json({ task, message: 'Task created' })
})

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
  const tasks = readTasks()
  const taskIndex = tasks.findIndex((task) => task.id === req.params.id && task.userId === req.user.id)

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }

  const incomingTitle = typeof req.body?.title === 'string' ? String(req.body.title).trim() : null
  if (incomingTitle !== null && (!incomingTitle || incomingTitle.toLowerCase() === 'untitled task')) {
    return res.status(400).json({ message: 'Task title is required.' })
  }

  const updatedTask = normalizeTask({
    ...tasks[taskIndex],
    ...req.body,
    title: incomingTitle || tasks[taskIndex].title,
    id: tasks[taskIndex].id,
    userId: req.user.id,
    createdAt: tasks[taskIndex].createdAt,
  })

  tasks[taskIndex] = updatedTask
  writeTasks(tasks)

  return res.json({ task: updatedTask, message: 'Task updated' })
})

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  const tasks = readTasks()
  const nextTasks = tasks.filter((task) => !(task.id === req.params.id && task.userId === req.user.id))

  if (nextTasks.length === tasks.length) {
    return res.status(404).json({ message: 'Task not found' })
  }

  writeTasks(nextTasks)
  return res.json({ deletedId: req.params.id, message: 'Task deleted' })
})

const distPath = path.resolve(__dirname, '../dist')

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    return res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('*', (_req, res) => {
    res.status(200).json({
      ok: true,
      message: 'OpsPilot API is running. Run the frontend with Vite in development mode.',
    })
  })
}

export { app }

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OpsPilot API listening on http://localhost:${PORT}`)
  })
}
