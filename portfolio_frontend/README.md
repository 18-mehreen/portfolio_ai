# 🚀 Portfolio AI Builder

A full-stack AI-powered portfolio builder where users can create, manage, and publish personal portfolios with authentication, cloud storage, and dynamic profile pages.

---

## 🌐 Live Demo

https://portfolio-ai-five-tan.vercel.app

---

## 🧠 Features

* 🔐 User authentication (NextAuth)
* 🧑‍💻 Dynamic portfolio creation
* 📁 Project & skill management
* 🖼️ Image uploads via Cloudinary
* 📊 Dashboard for editing profile content
* 🌍 Public portfolio pages using dynamic routes
* ⚡ Fully deployed on Vercel

---

## 🛠️ Tech Stack

* Next.js (App Router)
* TypeScript
* Prisma ORM
* MySQL (Aiven Cloud Database)
* Cloudinary (Image Storage)
* NextAuth.js (Authentication)
* Vercel (Deployment)

---

## 🏗️ Architecture

Frontend + Backend (Next.js API Routes)
Database: MySQL (Aiven Cloud)
Media Storage: Cloudinary
ORM: Prisma
Hosting: Vercel

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone <repo-url>
cd portfolio_ai/portfolio_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env` file:

```
DATABASE_URL=your_aiven_mysql_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
OPENAI_API_KEY=optional
```

### 4. Setup database

```bash
npx prisma db push
npx prisma generate
```

### 5. Run project

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📁 Project Structure

* `/app` → UI pages & API routes
* `/lib` → Prisma & auth helpers
* `/prisma` → Database schema & migrations
* `/public` → Static assets

---

## 🚀 Deployment

* Hosted on **Vercel**
* Connected with **Aiven MySQL database**
* Media stored on **Cloudinary**

---

## 📌 Project Status

✔ Fully functional
✔ Cloud database integrated
✔ Deployed and shareable
✔ Ready for portfolio/demo use

---

## 📹 Demo Video

(Add your Google Drive or YouTube link here)

---

## 👤 Author

Built as a full-stack portfolio builder project using modern web technologies.

