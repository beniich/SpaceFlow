<div align="center">
  <img src="public/favicon.ico" alt="AgroMaître Logo" width="80" height="80">
  <h1 align="center">AgroMaître — Precision Agriculture Command Center</h1>
  <p align="center">
    <strong>A next-generation SaaS ERP for intelligent, data-driven agricultural management.</strong>
  </p>
  
  <p align="center">
    <a href="https://github.com/beniich/consolherb2/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite" alt="Vite"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS"></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma"></a>
    <a href="#"><img src="https://img.shields.io/badge/SOC_2-Compliant-success?style=flat-square" alt="SOC 2 Compliant"></a>
  </p>
</div>

<br/>

## 📖 Overview

**AgroMaître** (Consolherb Command Center) is an elite-grade, full-stack ERP tailored for precision agriculture. Moving away from standard dashboards, the interface has been completely engineered as a **high-density operational tool**. It brings industrial monitoring, real-time IoT synchronization, and artificial intelligence into a single, cohesive, minimalist application.

Built with performance, security, and scalability in mind, it provides seamless multi-tenant isolation, real-time telemetry via Server-Sent Events (SSE), and a robust backend designed for enterprise deployment.

---

## ✨ Core Capabilities

### 🧠 Intelligence & Analytics (AgroBrain & Vision AI)
* **Computer Vision Diagnostics**: Automated disease detection and botanical anomaly tracking.
* **Retrieval-Augmented Generation (RAG) AI**: Built-in autonomous assistant for agronomic decision support systems (DSS).
* **Agro-Finance ROI Engine**: Real-time financial projections, cash flow monitoring, and predictive harvest yields.

### 📡 Real-Time IoT & Infrastructure
* **MQTT Telemetry Ingestion**: Seamless integration with remote soil, humidity, and temperature sensors.
* **Server-Sent Events (SSE)**: Ultra-low latency data synchronization from the backend to the Zustand global state.
* **Blockchain Traceability Ledger**: Cryptographically verifiable ledger ensuring supply chain integrity from harvest to delivery.

### 🛡️ Enterprise Security & Compliance
* **Physical Multi-Tenancy**: Isolated database schemas and data-at-rest encryption.
* **SOC 2 & ISO 27001 Preparedness**: Comprehensive audit logs, RBAC (Role-Based Access Control), and zero-trust IAM architecture.
* **Firebase Auth Integration**: Secure JWT-based session management.

### 🎨 Minimalist "Command Center" UX
* **Operation-First Layout**: Ultra-compact status header (live weather, IP, satellite tracking metrics) and a slim right-side navigation bar utilizing `react-router-dom` active state routing.
* **Fluid PWA Architecture**: Offline-ready Progressive Web App with optimized service workers and Framer Motion micro-interactions.
* **Tailwind v4 Theme Engine**: Extensively customized design system featuring dark mode, glassmorphism, and minimal cognitive load.

---

## 🏗️ Technical Architecture

The platform follows a decoupled, service-oriented architecture:

### Frontend (Client-Side)
* **Framework**: React 19 + TypeScript + Vite
* **Routing**: React Router v6 (`NavLink`, `Outlet` layout strategy)
* **State Management**: Zustand (for reactive, boilerplate-free global stores)
* **Styling**: Tailwind CSS v4 + Framer Motion
* **API Communication**: Custom Axios/Fetch wrapper with interceptors for Firebase JWT injection.

### Backend (Server-Side)
* **Core**: Node.js + Express + TypeScript
* **Database & ORM**: PostgreSQL paired with Prisma ORM for type-safe schema definitions and migrations.
* **Real-time Engine**: Custom SSE (Server-Sent Events) controller for pushing live IoT updates.
* **Authentication**: Firebase Admin SDK for robust token validation.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+)
* PostgreSQL (v15+)
* Docker & Docker Compose (Optional for containerized deployment)
* A Firebase Project (for Authentication)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/beniich/consolherb2.git
   cd consolherb2/remix_-consolherb
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   * Copy the `.env.example` files in both the root and `server/` directories.
   * Add your PostgreSQL connection string and Firebase credentials.

4. **Initialize Database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the Application**
   ```bash
   # Starts the Vite frontend server on http://localhost:3000
   npm run dev 
   ```

---

## 📦 Deployment (CI/CD)

The project includes a comprehensive CI/CD setup for automated deployments.

* **Frontend (Vercel)**: Configured with `vercel.json` for proper SPA routing, immutable asset caching, and Vite build detection.
* **Backend (Docker / VPS)**: Included `Dockerfile` and `docker-compose.prod.yml` for isolated production environments (e.g., Railway, Render, or dedicated Linux VPS). 

To deploy the production environment via Docker:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

<div align="center">
  <sub>Built for scale. Engineered for precision.</sub>
</div>
