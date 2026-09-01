import { motion } from 'framer-motion'
import { pressScale } from '../lib/motion'

// ── Button with delightful micro-interactions ────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 disabled:opacity-40 disabled:cursor-not-allowed select-none'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-emerald to-brand-indigo text-white shadow-glow hover:shadow-glow-emerald',
    secondary:
      'glass text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.15]',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...pressScale}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ── Glass card container ─────────────────────────────────────────────
export function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-300 ${
        hover ? 'hover:border-white/[0.15] hover:shadow-glow' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ── Badge / pill ─────────────────────────────────────────────────────
export function Badge({ children, tone = 'slate', className = '' }) {
  const tones = {
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

// ── Input field ──────────────────────────────────────────────────────
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/20 transition-all ${className}`}
      {...props}
    />
  )
}

// ── Textarea ─────────────────────────────────────────────────────────
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/20 transition-all resize-none ${className}`}
      {...props}
    />
  )
}
