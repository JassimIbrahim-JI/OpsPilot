import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Bot } from 'lucide-react'
import { Card } from '../components/ui.jsx'
import { useStore } from '../store.js'
import { fadeUp } from '../lib/motion.jsx'

// Lightweight local "AI" — generates smart suggestions from task data.
// (Swap with a real LLM endpoint in production.)
function generateInsight(tasks) {
  const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'done')
  const overdue = tasks.filter((t) => t.due === 'Yesterday' && t.status !== 'done')
  const done = tasks.filter((t) => t.status === 'done').length

  const lines = []
  if (high.length) {
    lines.push(`⚡ You have ${high.length} high-priority task${high.length > 1 ? 's' : ''} needing attention.`)
  }
  if (overdue.length) {
    lines.push(`⏰ ${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue — consider rescheduling.`)
  }
  if (done > 0) {
    lines.push(`🎉 Great momentum — ${done} task${done > 1 ? 's' : ''} completed. Keep it up!`)
  }
  if (!lines.length) {
    lines.push('✨ All clear! Your task list is in great shape.')
  }
  return lines.join('\n')
}

export default function AiView() {
  const tasks = useStore((s) => s.tasks)
  const [messages, setMessages] = useState([
    { role: 'ai', text: generateInsight(tasks) },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setInput('')

    // Simulate a helpful AI reply (deterministic, no dead clicks)
    setTimeout(() => {
      const reply = `I've analyzed your ${tasks.length} tasks. ${generateInsight(tasks)}`
      setMessages((m) => [...m, { role: 'ai', text: reply }])
    }, 500)
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-7 h-7 gradient-text" /> AI Insights
        </h1>
        <p className="text-slate-500 mt-1">Smart, predictive analysis of your workload.</p>
      </div>

      <Card hover={false} className="max-w-2xl">
        <div className="flex flex-col gap-3 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white'
                    : 'bg-white/[0.04] text-slate-200 border border-white/[0.06]'
                }`}
              >
                {m.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Assistant</span>
                  </div>
                )}
                <span className="whitespace-pre-line">{m.text}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about your tasks…"
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50 transition-all"
          />
          <button
            onClick={send}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-indigo text-white shadow-glow hover:shadow-glow-emerald transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </motion.div>
  )
}
