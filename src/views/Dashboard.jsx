import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Flame, TrendingUp, ListTodo } from 'lucide-react'
import { Card } from '../components/ui.jsx'
import { useStore, selectStats } from '../store.js'
import { fadeUp, stagger, item } from '../lib/motion.jsx'

const statCards = [
  { key: 'total', label: 'Total Tasks', icon: ListTodo, tone: 'text-indigo-400' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, tone: 'text-amber-400' },
  { key: 'done', label: 'Completed', icon: CheckCircle2, tone: 'text-emerald-400' },
  { key: 'high', label: 'High Priority', icon: Flame, tone: 'text-red-400' },
]

export default function Dashboard() {
  const stats = useStore(selectStats)
  const tasks = useStore((s) => s.tasks)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Welcome back, <span className="gradient-text">Jassim</span>
        </h1>
        <p className="text-slate-500 mt-1">
          You have {stats.inProgress} tasks in progress and {stats.high} high-priority items.
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, tone }) => (
          <motion.div key={key} variants={item}>
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

      {/* Completion ring + recent */}
      <div className="grid lg:grid-cols-3 gap-4">
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

        {/* Recent tasks */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4">Recent Tasks</h3>
            <div className="flex flex-col gap-2">
              {tasks.slice(0, 5).map((t) => (
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
