<div align="center">
  <img src="./public/logo.png" alt="ConvertHub Logo" width="120" />
  <h1>ConvertHub Engine</h1>
  <p><strong>The Enterprise-Grade, High-Performance File Transformation & processing Suite</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.22.0-1B222D?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![SQLite/PostgreSQL](https://img.shields.io/badge/Database-Prisma_ORM-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
</div>

<br />

ConvertHub is a robust, secure, and highly intuitive web application engineered for comprehensive document and image transformations. It features an extensive suite of **17 specialized tools**, providing everything from complex PDF manipulation and optical character recognition (OCR) to seamless multi-format image conversions—all wrapped in a premium, responsive UI.

---

## ✨ Comprehensive Feature Suite

ConvertHub provides a complete ecosystem for document management. Below is the detailed breakdown of all available tools:

### 📄 Core PDF Manipulation
1. **Merge PDF**: Combine multiple PDF documents into a single, cohesive file.
2. **Split PDF**: Extract specific page ranges or separate a PDF into multiple individual files.
3. **Compress PDF**: Drastically reduce file sizes while maintaining near-lossless visual quality using adaptive compression algorithms.
4. **Organize PDF**: Visually reorder, rotate, or delete pages using an intuitive drag-and-drop interface.
5. **Add Page Numbers**: Inject customizable page numbering formats (position, font size, margin).

### 🛡️ Security & Integrity
6. **Protect PDF**: Encrypt documents with robust 128/256-bit password protection to secure sensitive data.
7. **Unlock PDF**: Strip passwords and security restrictions from owned PDFs.
8. **Watermark PDF**: Stamp documents with custom image or text layers (adjustable opacity, angle, and position) for intellectual property protection.
9. **Repair PDF**: Recover, validate, and rebuild corrupted or malformed PDF structures.

### 🔄 Multi-Format Document Conversion
10. **Markdown to PDF**: Render standard Markdown into beautifully formatted PDFs with syntax highlighting.
11. **Word to PDF**: Convert DOCX files to secure, uneditable PDF formats.
12. **Web to PDF**: Capture full webpages (via URL) and render them accurately as high-fidelity PDFs.
13. **Image to PDF**: Compile a gallery of images (JPG, PNG, WEBP) into a single PDF album.

### 📥 Advanced Export & Extraction
14. **PDF to Word**: Convert PDFs back into editable DOCX format with high layout retention.
15. **PDF to Image**: Extract every page of a PDF as high-resolution PNGs (packaged in a ZIP file).
16. **OCR to Text**: Perform precise Optical Character Recognition on scanned PDFs or images to extract raw, editable text.

### 📊 Data Visualization
17. **Markdown to Graph**: Instantly parse complex Markdown text and render it into scalable SVG node-graphs for visual mind-mapping.

---

## 🏗️ Technical Architecture & Stack

ConvertHub is architected for scalability, performance, and security.

### Frontend Technologies
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router paradigm for optimal server-side rendering).
- **Core Library**: [React 18](https://react.dev/) with heavy utilization of functional components and hooks.
- **Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/) for rapid, utility-first UI development, ensuring a premium "Google Standard" aesthetic.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid, dynamic micro-interactions.
- **Icons**: [Lucide React](https://lucide.dev/) for a crisp, consistent iconography system.

### Backend Infrastructure
- **Server**: Next.js Node Environment (API Routes & Server Actions).
- **Database ORM**: [Prisma](https://www.prisma.io/). Configured for `SQLite` in development and easily deployable to `PostgreSQL` for production.
- **Authentication**: [NextAuth.js (v5)](https://next-auth.js.org/) supporting robust credential-based login, secure password hashing (`bcryptjs`), and JWT session management.
- **Security Middleware**: Custom Next.js Middleware guarding `/dashboard` and `/api` routes against unauthenticated access.

### 🧠 The "Download Engine" Innovation
A major engineering focus was placed on robust file downloads. Traditional browser Blob-URLs often fail to trigger correct filenames or extensions on restricted mobile environments. ConvertHub solves this by implementing an ephemeral Server-Side Download Proxy (`/api/download-file`). 
Files are temporarily buffered in server memory, and downloaded via proper `Content-Disposition: attachment; filename="..."` headers, guaranteeing perfect file metadata execution across all Chromium, WebKit, and Gecko browsers.

---

## �️ Database Schema Overview

The database is structured to support multi-tenant SaaS features:

- **`User` Model**: Handles authentication credentials, role-based access control (`USER`, `ADMIN`, `OWNER`), and relational linking to transactions.
- **`Transaction` Model**: Records subscription upgrades, tracking `planName`, `amount`, `currency`, `paymentMethod`, and exact `status` (`PENDING`, `SUCCESS`, `FAILED`).
- **`Account` / `Session` Models**: NextAuth standard tables for future OAuth provider integration (Google, GitHub).

---

## 🚀 Deployment & Installation Guide

Follow these highly detailed steps to run ConvertHub on your local development machine or production server.

### 1. Repository Initialization
Clone the source code to your machine:
```bash
git clone https://github.com/SIRAJcrypto11/Converthub.git
cd Converthub
```

### 2. Environment Configuration
Create a `.env` file in the project root. This file handles secure keys and database connections.
```env
# Define the Database Connection (SQLite for local, switch to PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
# Generate a cryptographically secure 32-byte secret: openssl rand -base64 32
AUTH_SECRET="your_highly_secure_random_string_here"
```

### 3. Dependency Installation
Install the necessary Node.js packages:
```bash
npm install
# or
yarn install
```

### 4. Database Synchronization
Push the Prisma Schema to the database to generate the tables and the Prisma Client:
```bash
npx prisma db push
```

### 5. Launch the Development Engine
Start the localized Next.js development server:
```bash
npm run dev
```
The application is now comprehensively running at `http://localhost:3000`.

---

## 🛡️ Security & Role-Based Access (RBAC)

ConvertHub implements a rigid three-tier architecture:

1. **USER**: Standard tier. Has access to the main dashboard and standard file transformation tools.
2. **ADMIN**: Administrative tier. Can view aggregate transaction histories and user lists.
3. **OWNER (System Master)**: Unrestricted tier. Has sole authority to change user roles, delete accounts, modify global API limits, and verify high-tier financial transactions.

---

## 🧑‍💻 Credits & Team Architecture

ConvertHub represents a standard of engineering excellence, built with precision and ❤️ by the software development team at **[SNISHOP](https://snishop.com/)**.

### Lead Systems Architect
**Siraj Nur Ihrom**
- 🌐 Professional Portfolio: [sirajnurihrom.vercel.app](https://sirajnurihrom.vercel.app/)
- 💻 GitHub Profile: [@SIRAJcrypto11](https://github.com/SIRAJcrypto11)

---

## 📜 Legal & Licensing

ConvertHub is distributed under the permissive **[MIT License](LICENSE)**. 
You are fundamentally free to modify, distribute, copy, and commercially extract value from this software stack, provided you include the original copyright notice in all copies or substantial uses.

<p align="center">
  <br />
  &copy; 2026 ConvertHub. Delivering Transformation at Scale.
</p>
