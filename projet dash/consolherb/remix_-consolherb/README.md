# 🌿 AgroMaître Precision Agriculture 4.0
**The Intelligent Command Center for Modern Agricultural Excellence.**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Deployment](https://img.shields.io/badge/Deployment-Docker%20%2F%20Vercel-blue)]()
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Postgres-orange)]()
[![Standard](https://img.shields.io/badge/Standard-SOC2%20%2F%20ISO%2027001-blue)]()

AgroMaître is a high-end Enterprise Resource Planning (ERP) system designed for precision agriculture. It transforms raw IoT data into actionable agronomical intelligence using a state-of-the-art tech stack, real-time streaming, and Generative AI.

---

## 🚀 Key Capabilities

### 🧠 AI-Driven Intelligence (Agro-Brain)
- **RAG Implementation**: A Generative AI assistant integrated with a **Retrieval-Augmented Generation** system. It queries real-time sensor data and the **OpenFarm** knowledge base to provide expert agronomical advice.
- **Computer Vision**: An integrated FastAPI micro-service that analyzes plant leaf images to detect pathogens and suggest organic treatments.
- **DSS (Decision Support System)**: An automated rule engine that monitors soil pH, temperature, and humidity to trigger instant alerts and corrective actions.

### 📡 Real-Time IoT Ecosystem
- **MQTT Integration**: High-performance data ingestion from ESP32/Raspberry Pi sensors via the MQTT protocol.
- **SSE Streaming**: Server-Sent Events (SSE) ensure a "Live" experience, pushing sensor updates to the dashboard without page refreshes.
- **System Monitoring**: Real-time tracking of node health, CPU load, and connectivity status.

### 🚜 Operational Modules
- **Livestock & Botanical Hubs**: Specialized management for animal health and crop growth cycles.
- **Pest Control**: Early warning system with heat-mapping and AI-assisted diagnostics.
- **Agro-Finance ROI**: Real-time profitability tracking, expense management, and ROI calculation per crop.
- **Blockchain Traceability**: An immutable ledger for "Farm-to-Fork" transparency, certifying product origin and quality.

---

## 🛠 Technical Architecture

### Frontend (The Experience)
- **Framework**: React 18 + Vite + TypeScript.
- **State Management**: Zustand (Global store for nodes, logs, and session).
- **Styling**: Tailwind CSS + Framer Motion (Premium animations & Glassmorphism).
- **PWA**: Fully installable Progressive Web App with Offline-first capabilities.
- **Routing**: React Router 6 for a modular, page-based architecture.

### Backend (The Engine)
- **API**: Node.js + Express (REST & SSE).
- **Database**: PostgreSQL with Prisma ORM for type-safe queries.
- **AI Layer**: OpenAI API (GPT-4) + FastAPI (Python) for Computer Vision.
- **Messaging**: Eclipse Mosquitto (MQTT Broker) for IoT communication.

### Infrastructure (The Fortress)
- **Containerization**: Multi-stage Docker builds for Frontend and Backend.
- **Reverse Proxy**: Traefik with automatic Let's Encrypt SSL certification.
- **CI/CD**: GitHub Actions pipeline (Lint $\rightarrow$ Test $\rightarrow$ Build $\rightarrow$ Deploy).
- **Deployment**: Vercel (Frontend) + VPS/DigitalOcean (Backend & DB).

---

## 📦 Installation & Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/beniich/herboferme.git
cd remix_-consolherb
```

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/agromaitre"
OPENAI_API_KEY="your_key_here"
MQTT_BROKER_URL="mqtt://localhost:1883"
JWT_SECRET="your_super_secret_key"
```

### 3. Local Development (Docker)
The fastest way to launch the entire ecosystem:
```bash
docker-compose up --build
```
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000`
- **MQTT Broker**: `localhost:1883`

### 4. Database Initialization
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

---

## 🗺️ Project Structure
```text
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # AI & IoT Logic (DSS, RAG)
│   │   └── utils/          # MQTT Client & Helpers
│   └── prisma/             # Database Schema & Seeding
├── src/                    # React Frontend
│   ├── api/                # API wrappers
│   ├── components/         # UI Design System (Atomic)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Modular view components
│   └── store/              # Zustand global state
├── server_vision/          # Python FastAPI (Computer Vision)
└── docs/                   # Architecture & API specs
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

**Built with ❤️ for the future of sustainable agriculture.**
