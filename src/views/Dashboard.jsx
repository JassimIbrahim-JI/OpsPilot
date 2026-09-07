import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  ListTodo,
  Zap,
  ArrowRight,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Card } from '../components/ui.jsx'
import { useStore, selectStats } from '../store.js'
import { fadeUp, stagger, item } from '../lib/motion.jsx'

const statCards = [
  { key: 'total', label: 'Active outcomes', icon: ListTodo, tone: 'text-indigo-400' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, tone: 'text-amber-400' },
  { key: 'done', label: 'Completed', icon: CheckCircle2, tone: 'text-emerald-400' },
  { key: 'high', label: 'High Priority', icon: Flame, tone: 'text-red-400' },
]

function HeroScene() {
  const [tilt, setTilt] = useState({ x: 12, y: -12 })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -22
    setTilt({ x: y, y: x })
  }

  return (
    <div className="hero-shell" onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 12, y: -12 })}>
      <motion.div
        className="taskflow-orb"
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: [0, -8, 0] }}
        transition={{ rotateX: { duration: 0.35 }, rotateY: { duration: 0.35 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="orb-core" />
        <div className="orb-ring ring-one" />
        <div className="orb-ring ring-two" />
      </motion.div>

      <motion.div className="floating-chip chip-top" animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
        <Sparkles className="w-4 h-4 text-emerald-300" />
        AI planning
      </motion.div>
      <motion.div className="floating-chip chip-right" animate={{ y: [0, 10, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
        <Rocket className="w-4 h-4 text-violet-300" />
        2.4x focus gain
      </motion.div>
      <motion.div className="floating-chip chip-bottom" animate={{ y: [0, -12, 0] }} transition={{ duration: 4.2, repeat: Infinity }}>
        <ShieldCheck className="w-4 h-4 text-cyan-300" />
        Real-time status
      </motion.div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const stats = useStore(selectStats)
  const tasks = useStore((s) => s.tasks)
  const user = useStore((s) => s.user)
  const [focusMode, setFocusMode] = useState(false)

  const focusTasks = [...tasks]
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 3)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="hero-panel mb-8">
        <div className="hero-copy">
          <div className="inline-flex items-center gap-2 glass badge-pill px-3 py-1.5 text-xs font-medium text-slate-200 uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            OpsPilot
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mt-5">
            Ship smarter work with <span className="gradient-text">AI clarity</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl text-base md:text-lg">
            Connect goals, projects, decisions, risks, and execution in one operating view built for people who ship.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('tasks')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-indigo text-white font-semibold shadow-glow hover:shadow-glow-emerald transition-all"
            >
              Launch dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('metrics')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2.5 rounded-xl glass text-slate-200 font-medium hover:text-white transition-all"
            >
              View metrics
            </button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
            <span>34 active flows</span>
            <span>96% focus efficiency</span>
            <span>3.4x faster handoff</span>
          </div>
        </div>

        <HeroScene />
      </motion.div>

      <motion.div variants={fadeUp} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Jassim'}</span>
        </h2>
        <p className="text-slate-500 mt-1">
          You have {stats.inProgress} outcomes in motion and {stats.high} high-impact items.
        </p>
      </motion.div>

      <motion.div id="metrics" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, tone }) => (
          <motion.div key={key} variants={item} whileHover={{ y: -4, scale: 1.01 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-100">{stats[key]}</div>
                  <div className="text-sm text-slate-500 mt-1">{label}</div>
                </div>
                <Icon className={`w-8 h-8 ${tone}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={item} className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Progress
            </h3>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - stats.completion / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-100">{stats.completion}%</span>
                  <span className="text-xs text-slate-500">complete</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Recent outcomes</h3>
              <button
                onClick={() => setFocusMode((current) => !current)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:text-slate-100 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {focusMode ? 'Deep work on' : 'Focus sprint'}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(focusMode ? focusTasks : tasks.slice(0, 5)).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      t.status === 'done'
                        ? 'bg-emerald-400'
                        : t.status === 'in_progress'
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="flex-1 text-sm text-slate-200 truncate">{t.title}</span>
                  <span className="text-xs text-slate-500">{t.due}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
