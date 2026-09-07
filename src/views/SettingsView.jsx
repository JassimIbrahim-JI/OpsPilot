import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Palette, User, ShieldCheck } from 'lucide-react'
import { Card, Button } from '../components/ui.jsx'
import { useStore } from '../store.js'
import { fadeUp, stagger, item } from '../lib/motion.jsx'

export default function SettingsView() {
  const toast = useStore((s) => s.toast)
  const logout = useStore((s) => s.logout)
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const updateProfile = useStore((s) => s.updateProfile)
  const [darkMode, setDarkMode] = useState(theme === 'dark')
  const [notifications, setNotifications] = useState(true)
  const [accent, setAccent] = useState('emerald')
  const [editing, setEditing] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || 'Jassim Abuanzeh')
  const [profileEmail, setProfileEmail] = useState(user?.email || 'demo@flowpilot.app')

  useEffect(() => {
    setDarkMode(theme === 'dark')
  }, [theme])

  useEffect(() => {
    setProfileName(user?.name || 'Jassim Abuanzeh')
    setProfileEmail(user?.email || 'demo@flowpilot.app')
  }, [user])

  const accents = [
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'indigo', label: 'Indigo', color: '#6366f1' },
    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  ]

  const handleToggleDarkMode = () => {
    const nextMode = !darkMode
    setDarkMode(nextMode)
    setTheme(nextMode ? 'dark' : 'light')
    toast(nextMode ? 'Dark mode enabled' : 'Light mode enabled', 'success')
  }

  const handleSaveProfile = () => {
    updateProfile({ name: profileName, email: profileEmail })
    setEditing(false)
    toast('Profile updated', 'success')
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-500 mt-1">Shape your FlowPilot workspace around outcomes, not busywork.</p>
      </motion.div>

      <div className="max-w-2xl flex flex-col gap-4">
        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" /> Appearance
            </h3>

            <div className="flex items-center justify-between py-2 cursor-pointer" onClick={handleToggleDarkMode}>
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                <span className="text-sm text-slate-300">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleToggleDarkMode()
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

        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" /> Account
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center text-white font-bold">
                {(user?.name || 'J').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{user?.name || 'Jassim Abuanzeh'}</div>
                <div className="text-xs text-slate-500">{user?.email || 'demo@flowpilot.app'}</div>
              </div>
            </div>

            {editing ? (
              <div className="mt-4 space-y-3">
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50"
                  placeholder="Full name"
                />
                <input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50"
                  placeholder="Email"
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveProfile}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
                <Button variant="ghost" onClick={() => { logout(); toast('Signed out successfully', 'success') }}>Sign Out</Button>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security
            </h3>
            <p className="text-sm text-slate-400">Protected session active. Your tasks are synced to your current account.</p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
