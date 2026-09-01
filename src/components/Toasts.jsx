import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useStore } from '../store'

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const tones = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-indigo-400',
  warning: 'text-amber-400',
}

export default function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 min-w-[280px] shadow-glow"
            >
              <Icon className={`w-5 h-5 ${tones[t.type]}`} />
              <span className="text-sm text-slate-200 flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
