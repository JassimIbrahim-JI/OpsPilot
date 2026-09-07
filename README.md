# ╔══════════════════════════════════════════════════╗
# ║  🏛️ Jassim Abuanzeh — Software Engineer  ║
# ║  📧 jassim.ibrhm@gmail.com               ║
# ║  © 2026 All Rights Reserved              ║
# ╚══════════════════════════════════════════════════╝

# ✅ OpsPilot — Work operating system

OpsPilot is a full-stack work operating system for freelancers and small teams. It connects goals, projects, decisions, risks, and execution signals in one focused workspace instead of adding another generic task list.

Built with React + Vite + Express + Tailwind CSS + Framer Motion + Zustand.

---

## ✨ Included

- Premium dark dashboard with glassmorphism and motion
- Full task CRUD with status, priority, filters, and search
- Outcome-focused dashboard for weekly planning and progress reviews
- Demo auth flow with protected API routes
- Persistent local JSON database for tasks and users
- AI insight panel with workflow memory
- Theme toggle and profile editing surface
- Render-ready production configuration
- Playwright smoke tests for UI verification

---

## 🚀 Run locally

### Prerequisites
- Node.js 18+

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

API endpoints:
- http://localhost:4000/api/health
- http://localhost:4000/api/tasks
- http://localhost:4000/api/auth/login

### Production

```bash
npm run build
npm run start
```

Open http://localhost:4000

---

## ☁️ Deploy on Render

1. Push this project to GitHub.
2. Go to Render and create a new Web Service.
3. Connect the repository.
4. Use:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
5. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`

This repository already includes a `render.yaml` file for a Node-based deployment.

---

## 📦 Marketing package

The project includes a sales and launch kit in the `gumroad-release/` folder:

- `SALES_COPY.md` — product copy for Gumroad / marketplace listings
- `RENDER_GUIDE.md` — deployment walkthrough
- `ALL_PLATFORMS_GUIDE.md` — multi-platform distribution guidance
- `CODECANYON_SUBMISSION.md` — CodeCanyon-style submission brief

Recommended launch pricing:
- Standard: $79
- Premium: $149
- Bundle: $299

---

## 🧪 QA

```bash
npx playwright install
npm run test:e2e
```

---

## 📁 Project structure

```bash
FlowPilot/
├── server/
│   ├── data/
│   │   ├── tasks.json
│   │   └── users.json
│   └── index.js
├── src/
│   ├── App.jsx
│   ├── store.js
│   ├── index.css
│   ├── components/
│   └── views/
├── gumroad-release/
│   ├── SALES_COPY.md
│   ├── RENDER_GUIDE.md
│   ├── CODECANYON_SUBMISSION.md
│   └── ALL_PLATFORMS_GUIDE.md
├── tests/
├── dist/
├── render.yaml
├── Dockerfile
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

---

## 📄 License

MIT

---

Built for premium product delivery, deployment readiness, and marketplace packaging.
