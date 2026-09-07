import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bell, CheckSquare, Sparkles, Settings, LayoutDashboard, LogIn, UserPlus, Sun, Moon } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import AmbientBackground from './components/AmbientBackground.jsx'
import Toasts from './components/Toasts.jsx'
import Dashboard from './views/Dashboard.jsx'
import TasksView from './views/TasksView.jsx'
import AiView from './views/AiView.jsx'
import SettingsView from './views/SettingsView.jsx'
import { useStore } from './store.js'

const views = {
  dashboard: { component: Dashboard, title: 'Dashboard', icon: LayoutDashboard },
  tasks: { component: TasksView, title: 'Mission control', icon: CheckSquare },
  ai: { component: AiView, title: 'Ops copilot', icon: Sparkles },
  settings: { component: SettingsView, title: 'Settings', icon: Settings },
}

function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('demo@flowpilot.app')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const login = useStore((s) => s.login)
  const signup = useStore((s) => s.signup)
  const demoLogin = useStore((s) => s.demoLogin)
  const toast = useStore((s) => s.toast)

  const submit = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      toast('Please fill in all required fields', 'error')
      return
    }

    try {
      setLoading(true)
      if (mode === 'signup') {
        await signup({ name, email, password })
        toast('Account created successfully', 'success')
      } else {
        await login({ email, password })
        toast('Signed in successfully', 'success')
      }
    } catch (error) {
      toast(error.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    try {
      setLoading(true)
      await demoLogin()
      toast('Demo account ready', 'success')
    } catch (error) {
      toast(error.message || 'Demo login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass max-w-md w-full rounded-3xl p-6 shadow-glow">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center shadow-glow">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">OpsPilot</h1>
          <p className="text-slate-500 mt-1">Your operating system for meaningful work</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${mode === 'login' ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white' : 'glass text-slate-400'}`}
            onClick={() => setMode('login')}
          >
            <span className="inline-flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
          </button>
          <button
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white' : 'glass text-slate-400'}`}
            onClick={() => setMode('signup')}
          >
            <span className="inline-flex items-center gap-2"><UserPlus className="w-4 h-4" /> Sign Up</span>
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-emerald to-brand-indigo text-white py-2.5 font-semibold disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Continue'}
          </button>
          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full rounded-xl glass text-slate-200 py-2.5 font-medium disabled:opacity-60"
          >
            Use demo account
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const search = useStore((s) => s.search)
  const setSearch = useStore((s) => s.setSearch)
  const toast = useStore((s) => s.toast)
  const hydrateTasks = useStore((s) => s.hydrateTasks)
  const bootstrapAuth = useStore((s) => s.bootstrapAuth)
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    bootstrapAuth().finally(() => {
      hydrateTasks()
    })
  }, [bootstrapAuth, hydrateTasks])

  if (!token || !user) return <AuthScreen />

  const ActiveView = views[active].component

  return (
    <div className="min-h-screen flex">
      <AmbientBackground />
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-6 py-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, tags, descriptions…"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/20 transition-all"
            />
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl glass text-slate-400 hover:text-slate-200 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => toast('No new notifications', 'info')}
            className="relative p-2.5 rounded-xl glass text-slate-400 hover:text-slate-200 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-emerald animate-pulse-glow" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center text-white font-bold text-sm shadow-glow">
            {(user?.name || 'J').charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveView onNavigate={setActive} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toasts />
    </div>
  )
}
