import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Bot, BrainCircuit, Rocket, Target, ListChecks, AlertTriangle, BookOpen } from 'lucide-react'
import { Card } from '../components/ui.jsx'
import { useStore } from '../store.js'
import { fadeUp } from '../lib/motion.jsx'

function generateInsight(tasks, memory) {
  const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'done')
  const overdue = tasks.filter((t) => t.due === 'Yesterday' && t.status !== 'done')
  const done = tasks.filter((t) => t.status === 'done').length
  const focus = tasks.filter((t) => t.status === 'in_progress').length

  const lines = []
  if (high.length) lines.push(`⚡ ${high.length} high-impact task${high.length > 1 ? 's' : ''} need your attention today.`)
  if (overdue.length) lines.push(`⏰ ${overdue.length} overdue task${overdue.length > 1 ? 's are' : ' is'} slowing momentum.`)
  if (focus) lines.push(`🧠 ${focus} task${focus > 1 ? 's are' : ' is'} already in motion; keep the system moving.`)
  if (done > 0) lines.push(`🎉 ${done} task${done > 1 ? 's' : ''} already shipped — momentum is healthy.`)
  if (!lines.length) lines.push('✨ All clear. Your workload is balanced and healthy.')

  return `${lines.join('\n')}\n\nMemory anchor: “${memory || 'Focus on shipping the highest-impact work.'}”`
}

export default function AiView() {
  const tasks = useStore((s) => s.tasks)
  const askCopilot = useStore((s) => s.askCopilot)
  const memory = useStore((s) => s.aiMemory)
  const setAiMemory = useStore((s) => s.setAiMemory)
  const [messages, setMessages] = useState(() => [{ role: 'ai', text: generateInsight(tasks, memory) }])
  const [input, setInput] = useState('')
  const [memoryDraft, setMemoryDraft] = useState(memory)
  const [isThinking, setIsThinking] = useState(false)
  const [activeTab, setActiveTab] = useState('conversation')
  const [latestDecision, setLatestDecision] = useState(null)

  useEffect(() => {
    setMemoryDraft(memory)
  }, [memory])

  const send = async () => {
    if (!input.trim() || isThinking) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setIsThinking(true)

    try {
      const result = await askCopilot(userMsg)
      setLatestDecision(result)
      setActiveTab('decision')
      setMessages((m) => [...m, {
        role: 'ai',
        text: result.decision,
      }])
    } catch (error) {
      setMessages((m) => [...m, { role: 'ai', text: `I could not reach the decision service: ${error.message}` }])
    } finally {
      setIsThinking(false)
    }
  }

  const saveMemory = () => {
    setAiMemory(memoryDraft)
    setMessages((m) => [...m, { role: 'ai', text: `Memory saved: “${memoryDraft}”` }])
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-7 h-7 gradient-text" /> Ops copilot
        </h1>
        <p className="text-slate-500 mt-1">A persistent operating conversation for priorities, decisions, risks, and next moves.</p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto" role="tablist" aria-label="Copilot workspace">
        {[
          { id: 'conversation', label: 'Conversation', icon: Bot },
          { id: 'decision', label: 'Latest decision', icon: Target },
          { id: 'deployment', label: 'Client deployment guide', icon: Rocket },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white shadow-glow'
                  : 'glass text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'conversation' && (
      <div className="grid lg:grid-cols-[1.5fr_0.8fr] gap-4">
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
            {isThinking && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl text-sm bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                  Copilot is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask your copilot about priorities, risks, or next steps…"
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

        <Card hover={false}>
          <div className="flex items-center gap-2 text-slate-100 font-semibold mb-3">
            <BrainCircuit className="w-4 h-4 text-indigo-400" /> Memory
          </div>
          <textarea
            value={memoryDraft}
            onChange={(e) => setMemoryDraft(e.target.value)}
            rows={6}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50 transition-all resize-none"
          />
          <button onClick={saveMemory} className="mt-3 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 py-2.5 font-medium hover:bg-white/[0.06]">
            Save memory
          </button>
        </Card>
      </div>
      )}

      {activeTab === 'decision' && (
        <Card hover={false} className="max-w-3xl">
          {latestDecision ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <Target className="w-4 h-4" /> Recommended decision
                </div>
                <h2 className="text-2xl font-bold text-slate-100">{latestDecision.decision}</h2>
                <p className="text-slate-400 mt-2">{latestDecision.rationale}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-3">
                  <ListChecks className="w-4 h-4 text-indigo-400" /> Execution steps
                </div>
                <ol className="space-y-2">
                  {latestDecision.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-slate-300">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-500/15 text-indigo-300 flex items-center justify-center font-semibold">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-500/10 border border-amber-400/15 p-4">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2"><AlertTriangle className="w-4 h-4" /> Risks</div>
                  {latestDecision.risks.map((risk) => <p key={risk} className="text-sm text-slate-300">{risk}</p>)}
                </div>
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/15 p-4">
                  <div className="text-emerald-300 font-semibold text-sm mb-2">Confidence</div>
                  <div className="text-3xl font-bold text-slate-100">{Math.round(latestDecision.confidence * 100)}%</div>
                  <p className="text-xs text-slate-400 mt-1">{latestDecision.context.active} active items · {latestDecision.context.highImpact} high impact · {latestDecision.context.overdue} overdue</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyTab icon={Target} title="No decision yet" text="Ask the Copilot a question in Conversation to generate an evidence-based decision." />
          )}
        </Card>
      )}

      {activeTab === 'deployment' && <DeploymentGuide />}
    </motion.div>
  )
}

function EmptyTab({ icon: Icon, title, text }) {
  return (
    <div className="py-16 text-center">
      <Icon className="w-10 h-10 mx-auto text-indigo-400 mb-3" />
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <p className="text-sm text-slate-400 mt-2">{text}</p>
    </div>
  )
}

function DeploymentGuide() {
  const steps = [
    ['Prepare the repository', 'Push the OpsPilot folder to a private or public GitHub repository. Keep server/data as the initial demo database and never commit real passwords or secrets.'],
    ['Create the service', 'On Render, choose New > Web Service, connect the repository, and select the project root. The included render.yaml can also configure the service automatically.'],
    ['Use the production commands', 'Build command: npm install && npm run build. Start command: npm run start. Runtime: Node 18 or newer.'],
    ['Add environment variables', 'Set NODE_ENV=production and PORT=10000. Add any future database, OAuth, email, or AI provider keys only in Render Environment Variables, never in the code.'],
    ['Deploy and verify', 'After deployment, open the generated URL, create a test account, sign in, create a task, and test Ops Copilot. Also check /api/health before sharing the link with the client.'],
    ['Handover to the client', 'Give the client the live URL, a test account or invitation flow, and a short admin note explaining backups, user management, and how to contact you for updates.'],
  ]

  return (
    <Card hover={false} className="max-w-4xl">
      <div className="flex items-center gap-2 text-slate-100 font-semibold mb-2">
        <BookOpen className="w-5 h-5 text-indigo-400" /> Client deployment guide
      </div>
      <p className="text-sm text-slate-400 mb-6">A practical handover explanation for publishing OpsPilot safely and showing the client what happens.</p>
      <div className="space-y-4">
        {steps.map(([title, text], index) => (
          <div key={title} className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-indigo text-white flex items-center justify-center font-bold">{index + 1}</div>
            <div>
              <h3 className="font-semibold text-slate-100">{title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-6">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
        <div className="flex items-center gap-2 text-indigo-200 font-semibold text-sm"><BookOpen className="w-4 h-4" /> What to tell the client</div>
        <p className="text-sm text-slate-300 mt-2 leading-6">“We will publish OpsPilot as a secure web service. You will receive a live URL, create your own account, and use the dashboard from any browser. I will verify login, task creation, data persistence, and the Copilot before handover. Production credentials stay private and are stored in the hosting provider, not inside the project files.”</p>
      </div>
    </Card>
  )
}
