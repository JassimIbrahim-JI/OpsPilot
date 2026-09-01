# TaskFlow Pro — Gumroad Release Package

This folder contains everything you need to publish **TaskFlow Pro** on Gumroad.

## 📦 Contents

| File | Purpose |
|------|---------|
| `SALES_COPY.md` | High-converting marketing copy (paste into Gumroad) |
| `../README.md` | Buyer setup guide (< 5 minutes) |
| `../LICENSE` | MIT license |

## 🚀 How to Publish on Gumroad

1. **Build the project** (from the project root):
   ```bash
   npm run build
   ```

2. **Create a ZIP** of the project (excluding `node_modules` and `dist`):
   ```bash
   # On Windows (PowerShell):
   Compress-Archive -Path src,public,index.html,package.json,vite.config.js,tailwind.config.js,postcss.config.js,playwright.config.js,tests,README.md,LICENSE -DestinationPath TaskFlowPro.zip
   ```

3. **Go to Gumroad** → "New product" → upload `TaskFlowPro.zip`

4. **Paste the sales copy** from `SALES_COPY.md`

5. **Set the price** to **$79** (or $149 for premium)

6. **Add a cover image** (screenshot of the dashboard)

## ✅ Done!

Your product is live and ready to sell.
