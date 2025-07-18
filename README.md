# Matt Dinh Blog

![Logo](public/logo.png)

A modern, bilingual (EN/VI) personal blog and portfolio platform built with Next.js, Supabase, and Vercel. Designed for performance, maintainability, and a seamless authoring experience.

---

## 🚀 Features

- ✍️ **Blog & Portfolio**: Publish articles and showcase projects
- 🌐 **Bilingual**: Full English & Vietnamese support
- 🔒 **Admin Dashboard**: Manage posts, categories, tags, users, and more
- 🖼️ **Rich Media**: Cover images, thumbnails, and responsive design
- 📊 **Analytics**: View counts, activity logs, and dashboard stats
- 🧩 **Modular Components**: Reusable, maintainable React components
- 🌓 **Dark Mode**: Accessible, high-contrast UI
- 🔍 **Search**: Fast, language-aware article search
- 🕒 **Reading Time**: Language-specific reading time estimates
- 🧭 **Breadcrumbs & Navigation**: User-friendly, responsive navigation
- 🗂️ **Collapsible Sidebar**: Persistent admin sidebar with tooltips
- 🛡️ **Protected Routes**: Authenticated admin area
- ☁️ **Deployed on Vercel**: Fast, global CDN

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router, SSR, SSG)
- [Supabase](https://supabase.com/) (Postgres, Auth, Storage)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) (CI/CD, hosting)
- [Lucide Icons](https://lucide.dev/)

---

## ⚡ Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/matt-dinh13/matt-dinh-blog.git
   cd matt-dinh-blog
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🧑‍💻 Development Workflow

- **Lint:** `npm run lint`
- **Type Check:** `npx tsc --noEmit`
- **Build:** `npm run build`
- **Format:** `npm run format`
- **Test:** (add your test command if available)

---

## 🚀 Deployment

- **Production:** Automatically deployed to [Vercel](https://vercel.com/)
- **Manual Deploy:**
  ```bash
  vercel --prod
  ```

---

## 📁 Project Structure

```
src/
  app/           # Next.js app directory (pages, API routes)
  components/    # Reusable React components
  lib/           # Utilities, Supabase client, helpers
  public/        # Static assets (images, icons, etc.)
  scripts/       # SQL and setup scripts
```

---

## 🎨 Customization & Theming

- **Colors:** Centralized in `src/components/constants.ts` for easy updates
- **Dark/Light Mode:** Automatic and manual switching
- **Layout:** Easily extendable with modular components

---

## 🌏 Internationalization (i18n)

- **Languages:** English (`en`), Vietnamese (`vi`)
- **LanguageProvider:** Centralized context for language switching
- **Content:** Articles and UI support both languages

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 🗃️ Backup & Context

- See `CONVERSATION_BACKUP.md` for AI-assisted design decisions, context, and refactor history.
- All major UI/UX and architectural decisions are documented for future maintainers.

---

## 📝 License

[MIT](LICENSE)
