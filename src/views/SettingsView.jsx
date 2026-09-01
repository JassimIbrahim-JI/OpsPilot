import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Palette, User } from 'lucide-react'
import { Card, Button } from '../components/ui.jsx'
import { useStore } from '../store.js'
import { fadeUp, stagger, item } from '../lib/motion.jsx'

export default function SettingsView() {
  const toast = useStore((s) => s.toast)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [accent, setAccent] = useState('emerald')

  const accents = [
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'indigo', label: 'Indigo', color: '#6366f1' },
    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  ]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-500 mt-1">Customize your TaskFlow Pro experience.</p>
      </motion.div>

      <div className="max-w-2xl flex flex-col gap-4">
        {/* Appearance */}
        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" /> Appearance
            </h3>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                <span className="text-sm text-slate-300">Dark Mode</span>
              </div>
              <button
                onClick={() => {
                  setDarkMode(!darkMode)
                  toast(darkMode ? 'Light mode coming soon' : 'Dark mode enabled', 'info')
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo' : 'bg-white/[0.1]'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                  animate={{ left: darkMode ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="mt-4">
              <span className="text-sm text-slate-400">Accent Color</span>
              <div className="flex gap-3 mt-2">
                {accents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAccent(a.id)
                      toast(`Accent set to ${a.label}`, 'success')
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      accent === a.id
                        ? 'bg-white/[0.08] border border-white/[0.2] text-slate-100'
                        : 'glass text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" /> Notifications
            </h3>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-300">Push notifications</span>
              <button
                onClick={() => {
                  setNotifications(!notifications)
                  toast(notifications ? 'Notifications disabled' : 'Notifications enabled', 'success')
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-gradient-to-r from-brand-emerald to-brand-indigo' : 'bg-white/[0.1]'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                  animate={{ left: notifications ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Account */}
        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" /> Account
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">Jassim Abuanzeh</div>
                <div className="text-xs text-slate-500">jassim.ibrhm@gmail.com</div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => toast('Profile editing coming soon', 'info')}>
                Edit Profile
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
