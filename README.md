# AT26 Recruitment Portal 🚀

Recruitment platform for **Aatmatrisha 2026** — PES University's annual techno-cultural fest.

**Stack:** Next.js 15 • Supabase • TypeScript • Tailwind CSS

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/aatmatrisha26/AT26_Recruitment.git
cd AT26_Recruitment

# 2. Checkout Develop (we work here!)
git checkout develop

# 3. Install
npm install

# 4. Secrets
# Ask Dennis/Ashmith for `.env.local` file

# 5. Run!
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌿 How We Work (Simple Git Flow)

We use **two main branches**:
- `main` → **Production** (Don't touch this directly!)
- `develop` → **Working Code** (All PRs go here first)

### 🛠️ Working on a Feature

1. **Start fresh**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Make your branch**:
   ```bash
   git checkout -b feature/cool-new-thing
   ```

3. **Code & Commit**:
   ```bash
   git add .
   git commit -m "feat: added cool new thing"
   ```
   *(Prefixes: `feat:`, `fix:`, `style:`, `docs:`)*

4. **Push & PR**:
   ```bash
   git push origin feature/cool-new-thing
   ```
   👉 Go to GitHub and open a **Pull Request** to `develop`.

---

## 📁 Key Folders

- `src/app` — Pages & Routes
- `src/components` — UI Components
- `src/actions` — Server Actions (Backend Logic)
- `src/lib` — Helpers & Supabase Client
- `supabase-schema.sql` — Database Structure

---

## 🔑 Env Variables

You need these in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🆘 Need Help?
Ping **@DennisPhilip** or **@ashmithr** on WhatsApp/GitHub!
