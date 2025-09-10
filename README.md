# 🏥 MediHelp+ — Site Reliability Engineering & API Overview

## 🔍 Introduction

MediHelp+ is a full-stack healthcare assistant platform that leverages AI to assist users with health-related concerns. This document outlines the Site Reliability Engineering (SRE) strategies, API specifications, frontend responsibilities, and monitoring plans to ensure a **reliable, scalable, and secure** experience.

---

## 📘 Purpose

- Provide SRE guidelines for backend and frontend teams.
- Define API endpoints and integrations.
- Ensure high availability, reliability, and recoverability.

---

## 👥 Intended Audience

- 👨‍💻 Backend & Frontend Developers  
- 🏁 Hackathon Judges & Evaluators

---

## 📦 Scope

Includes:

- Full API & database design
- Frontend UI components & monitoring
- SRE strategy (Uptime, Alerts, Recovery)
- Third-party integration: Google Gemini API

---

## 🏗 System Overview

### 🔧 Tech Stack

| Layer      | Technology                            |
|------------|----------------------------------------|
| Backend    | Django 5.2, DRF 3.16, PostgreSQL, JWT  |
| Frontend   | ReactJS, TailwindCSS, Sentry, Web Vitals |
| AI         | Google Gemini API                     |
| Docs       | OpenAPI 3 via `drf-spectacular`        |

---

## ✨ Core Features

- 🔐 User Authentication (JWT)
- 🤖 AI Symptom Checker (via Gemini API)
- 📜 Symptom History Logs
- 🆘 First Aid & Home Remedies
- 📚 Health Education Articles & Videos
- 🚨 Monitoring, Logging & Recovery (Uptime Kuma, PM2, Sentry)

---

## 🛠 Backend API Endpoints

### 🔐 Auth APIs

| Endpoint                     | Method | Purpose                  |
|-----------------------------|--------|--------------------------|
| `/api/auth/register/`       | POST   | Register user            |
| `/api/auth/login/`          | POST   | Login + token            |
| `/api/auth/logout/`         | POST   | Logout                   |
| `/api/auth/token/refresh/`  | POST   | Refresh JWT              |

### 🧠 Symptom Checker

| Endpoint                             | Method | Purpose                         |
|-------------------------------------|--------|----------------------------------|
| `/api/symptoms/check/`              | POST   | Submit symptoms for AI check     |
| `/api/symptoms/history/`            | GET    | View symptom check history       |
| `/api/symptoms/history/{id}/`       | GET    | View specific record             |

### 🆘 First Aid / Remedies

| Endpoint                        | Method | Purpose                        |
|--------------------------------|--------|--------------------------------|
| `/api/firstaid/`              | GET    | List all remedies              |
| `/api/firstaid/{id}/`         | GET    | Get remedy detail              |
| `/api/firstaid/?q=keyword`    | GET    | Search by keyword              |

### 📚 Educational Content

| Endpoint                               | Method           | Purpose                         |
|----------------------------------------|------------------|---------------------------------|
| `/api/content/articles/`              | GET              | List health articles            |
| `/api/content/videos/`                | GET              | List educational videos         |
| `/api/content/articles/{id}/`         | GET              | View article                    |
| `/api/content/videos/{id}/`           | GET              | View video                      |
| `/api/content/articles/` (admin)      | POST/PUT/DELETE  | Manage articles                 |

### 📄 API Documentation

| Endpoint         | Method | Purpose                     |
|------------------|--------|-----------------------------|
| `/api/schema/`   | GET    | OpenAPI schema              |
| `/api/docs/`     | GET    | API Explorer (Swagger/Redoc)|

### ❤️ Monitoring

| Endpoint         | Method | Purpose                    |
|------------------|--------|----------------------------|
| `/api/healthz/`  | GET    | Used for uptime checks     |

---


| Component                  | Purpose                                | Dependency Ready |
|---------------------------|----------------------------------------|------------------|
| Login / Register          | User authentication                    | ✅               |
| Symptom Checker           | Submit symptoms to AI                  | 🔜               |
| Symptom History Viewer    | Review previous checks                 | 🔜               |
| First Aid & Remedy Search | Access help content                    | 🔜               |
| Article / Video Viewer    | Educational content                    | 🔜               |
| Sentry + Web Vitals       | Monitor performance & errors           | ✅               |
| Error/Recovery Modals     | UX fallback for failures               | ✅               |

> ⚠️ Note: Map & emergency features are temporarily delayed.

---

## 🛡 SRE Strategy

### 📉 Backend Monitoring

| Metric                  | Tool           | Threshold          | Action           |
|-------------------------|----------------|---------------------|------------------|
| API Health              | Uptime Kuma    | 2 fails             | Alert (Discord)  |
| PostgreSQL Status       | Cron + pg_isready | No response (2m) | Alert (Discord)  |
| API Error Rate          | Django Logs    | > 5% 500s           | Alert (Discord)  |
| Gemini Latency          | Middleware     | > 2s                | Log Warning      |
| Gemini Failures         | Middleware     | > 1/min             | Alert (Discord)  |

### 🎯 Frontend Monitoring

| Metric   | Tool         | Threshold    | Action        |
|----------|--------------|--------------|---------------|
| JS Errors| Sentry       | Any Critical | Alert         |
| LCP      | Web Vitals   | > 2.5s       | Log Warning   |
| CLS      | Web Vitals   | > 0.1        | Log Warning   |
| FID      | Web Vitals   | > 100ms      | Log Warning   |

### 🔁 Auto Recovery

- `PM2` or `systemd` auto-restarts backend
- Healthchecks.io pings monitor uptime
- UI fallback modals prompt user refresh

---

## 🧠 AI Handling

- RAG used for medical reasoning
- Fallback messages for API unavailability
- Logs track all AI interaction issues

---

## 🗃 Data Models Overview

- `CustomUser` – Roles and Auth
- `Symptom` – Symptom inputs
- `Condition` – Related diagnoses
- `SymptomCheck` – Records of submissions
- `FirstAidInstruction`, `HomeRemedy` – Health help
- `Article` – Medical education content

---

## 🧾 License

MIT License

---

## ✉️ Contact

For issues, please reach out via the [mesudmelaku25@gmail.com] .

---


## 🎨 Frontend Responsibilities
