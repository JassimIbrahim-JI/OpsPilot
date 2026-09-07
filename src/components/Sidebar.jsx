import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Settings,
  Search,
  Bell,
  Plus,
} from 'lucide-react'
import { useStore, selectStats } from '../store'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Mission control', icon: CheckSquare },
  { id: 'ai', label: 'Ops copilot', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ active, onNavigate }) {
  const stats = useStore(selectStats)
  const toast = useStore((s) => s.toast)

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 glass rounded-2xl m-4 p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center shadow-glow">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-slate-100 leading-tight">OpsPilot</div>
          <div className="text-[11px] text-slate-500">Work operating system</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-emerald/20 to-brand-indigo/20 border border-white/[0.08]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Quick add */}
      <button
        aria-label="Quick add"
        onClick={() => {
          toast('Opening a new outcome…', 'info')
          onNavigate('tasks')
        }}
        className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-indigo text-white font-semibold text-sm shadow-glow hover:shadow-glow-emerald transition-all"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>

      {/* Stats mini */}
      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span>Completion</span>
          <span className="text-emerald-400 font-semibold">{stats.completion}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-emerald to-brand-indigo"
            initial={{ width: 0 }}
            animate={{ width: `${stats.completion}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </aside>
  )
}
