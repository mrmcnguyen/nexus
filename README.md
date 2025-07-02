# Nexus Productivity Suite

A modern productivity and project management platform built with Next.js, Supabase, and Tailwind CSS. Nexus combines personal productivity tools (Eisenhower Matrix, Kanban, To-Do, Pomodoro, 1-3-5) with collaborative team/project management features.

---

## ✨ Features

- **Supabase Authentication** (Email/Password, Google, Microsoft OAuth)
- **Personal Productivity Tools:**
  - Eisenhower Matrix (prioritize tasks by urgency/importance)
  - Kanban Board (drag-and-drop, epics, priorities, filters)
  - To-Do List (with timers and minimal focus mode)
  - Pomodoro Timer (focus sessions)
  - 1-3-5 Method (daily task planning)
- **Team & Project Management:**
  - Create/join teams
  - Manage projects, members, and sectors
  - Dashboard with personal and team tasks
- **Modern UI:**
  - Dark, glassy design
  - Animated transitions
  - Responsive and accessible

---

## 🚀 Getting Started

### 1. Clone the repository
bash
git clone https://github.com/yourusername/nexus.git
cd nexus


### 2. Install dependencies
bash
npm install
# or
yarn install


### 3. Configure environment variables
Create a .env.local file in the root directory with the following:

env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key


You can find these in your [Supabase project settings](https://app.supabase.com/).

### 4. Run the development server
bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Authentication
- Email/password sign-in and sign-up
- Google and Microsoft OAuth (with proper redirect handling)
- Middleware-protected routes for authenticated access

---

## 🗂️ Project Structure

- src/app/nexusME/ — Personal productivity tools
  - kanban/ — Kanban board, epics, tasks
  - eisenhower-matrix/ — Eisenhower Matrix
  - to-do-list/ — To-Do List
  - pomodoro/ — Pomodoro Timer
  - 1-3-5/ — 1-3-5 daily planner
- src/app/nexusTEAMS/ — Team and project management
  - allTeams/ — Team dashboards
  - projects/ — Project dashboards, members, sectors
  - createTeam/ — Multi-stage team creation
- src/app/dashboard/ — Unified dashboard for personal and team tasks
- src/app/signIn/ & src/app/signUp/ — Authentication pages
- src/app/auth/callback/ — OAuth redirect handler
- supabase/ — Supabase client and middleware

---

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)

---

## 📝 Notes
- Make sure your Supabase project has authentication enabled and the correct redirect URLs set for OAuth.
- For local development, use .env.local for your secrets.
- For deployment, set the same environment variables in your hosting provider (e.g., Vercel).