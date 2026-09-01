# ╔══════════════════════════════════════════════════╗
# ║  🏛️ Jassim Abuanzeh — Software Engineer  ║
# ║  📧 jassim.ibrhm@gmail.com               ║
# ║  © 2026 All Rights Reserved              ║
# ╚══════════════════════════════════════════════════╝

# ✅ TaskFlow Pro — Premium Task Management Platform

A **premium, production-ready task management platform** with a world-class
dark-mode UI, buttery-smooth animations, and a built-in AI assistant.

Built with **React + Vite + Tailwind CSS + Framer Motion + Zustand**.

---

## ✨ Features

- 🎨 **Ultra-modern dark UI** — glassmorphism, neon gradients, ambient motion
- ⚡ **Butter-smooth animations** — Framer Motion micro-interactions everywhere
- ✅ **Full task CRUD** — create, edit, delete, filter, search, status toggle
- 📊 **Live dashboard** — animated stats, completion ring, recent tasks
- 🤖 **AI Insights** — smart, predictive workload analysis
- 🔔 **Toast notifications** — success / error / warning feedback
- 🎛️ **Settings** — dark mode, accent colors, notifications (all wired up)
- 📱 **Fully responsive** — mobile-first, no horizontal scroll

---

## 🚀 Quick Start (< 5 minutes)

### Prerequisites
- **Node.js 18+** (https://nodejs.org)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open **http://localhost:5173** — done! 🎉

### Production build

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build
```

---

## 🧪 Run E2E Tests (Playwright)

```bash
npx playwright install   # first time only
npm run test:e2e
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| State | Zustand 4 |
| Icons | Lucide React |
| Testing | Playwright |

---

## 📁 Project Structure

```
TaskFlowPro/
├── src/
│   ├── App.jsx              # Root layout + routing
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles + glassmorphism
│   ├── store.js             # Zustand store (tasks + toasts)
│   ├── lib/
│   │   └── motion.jsx       # Reusable animation variants
│   ├── components/
│   │   ├── ui.jsx           # Button, Card, Badge, Input
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Toasts.jsx       # Toast notifications
│   │   └── AmbientBackground.jsx  # Animated background
│   └── views/
│       ├── Dashboard.jsx    # Stats + progress ring
│       ├── TasksView.jsx    # Task CRUD + filters
│       ├── AiView.jsx       # AI assistant
│       └── SettingsView.jsx # Preferences
├── tests/
│   └── e2e.spec.js          # Playwright E2E tests
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

**Crafted with ❤️ by Jassim Abuanzeh**
