import { motion } from 'framer-motion'

// ── Reusable motion variants for buttery-smooth transitions ──────────
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}

// ── Button press scale (micro-interaction) ────────────────────────────
export const pressScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
}

// ── Animated presence wrapper ─────────────────────────────────────────
export function AnimatedCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
