import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bell, Plus, CheckSquare, Sparkles, Settings, LayoutDashboard } from 'lucide-react'
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
  tasks: { component: TasksView, title: 'Tasks', icon: CheckSquare },
  ai: { component: AiView, title: 'AI Insights', icon: Sparkles },
  settings: { component: SettingsView, title: 'Settings', icon: Settings },
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const search = useStore((s) => s.search)
  const setSearch = useStore((s) => s.setSearch)
  const toast = useStore((s) => s.toast)

  const ActiveView = views[active].component

  return (
    <div className="min-h-screen flex">
      <AmbientBackground />
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
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
            onClick={() => toast('No new notifications', 'info')}
            className="relative p-2.5 rounded-xl glass text-slate-400 hover:text-slate-200 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-emerald animate-pulse-glow" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center text-white font-bold text-sm shadow-glow">
            J
          </div>
        </header>

        {/* View content */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toasts />
    </div>
  )
}
