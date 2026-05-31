# DEV LOG – Portfolio AI Builder

## Project Overview

This project is a full-stack AI-powered portfolio builder where users can create and manage personal portfolios with authentication, project uploads, and dynamic portfolio pages.

---

## Tech Stack

* Next.js (Frontend + API routes)
* Prisma ORM
* MySQL (Aiven Cloud Database)
* Cloudinary (Image storage)
* NextAuth (Authentication)
* Vercel (Deployment)

---

## Development Progress

### 1. Initial Setup

* Created Next.js project structure
* Configured Prisma with MySQL
* Designed database schema for users, projects, skills, and portfolio data

---

### 2. Authentication System

* Implemented NextAuth authentication
* Added login and registration flow
* Protected dashboard routes using middleware

---

### 3. Backend APIs

* Built REST API routes for:

  * Projects
  * Skills
  * Certifications
  * Education
  * Portfolio data
* Connected all APIs with Prisma ORM

---

### 4. File Upload System

* Integrated Cloudinary for image uploads
* Removed all local file storage
* Ensured scalable cloud-based media handling

---

### 5. Database Migration

* Moved from local MySQL to Aiven cloud MySQL
* Fixed Prisma migration issues
* Used `db push` for final schema sync

---

### 6. Deployment

* Deployed project on Vercel
* Configured environment variables
* Connected production database and Cloudinary

---

## Final Status

✔ Fully functional full-stack portfolio builder
✔ Cloud-based storage and database
✔ Authentication system working
✔ Deployed successfully on Vercel

---

## Known Improvements (Future Work)

* Add analytics dashboard improvements
* Improve UI responsiveness
* Add email verification system
* Add portfolio templates system
