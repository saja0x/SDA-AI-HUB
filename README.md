# AI Model Hub — Lumia

A full-stack web platform for discovering, comparing, and interacting with AI models.

## Team
- Saja Alkhalaf
- Reem Mejrashi
- May Alahmari  


## Tech Stack
- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **Database:** SQLite
- **AI Chatbot:** GPT-4o-mini via OpenRouter
- **Auth:** bcrypt + JWT

## Features
- Browse and search 10 AI models with full specs
- Filter by provider, type, pricing, modality, and use case
- Side-by-side model comparison
- AI-powered recommendation chatbot
- Live playground (10 messages per model)
- Admin dashboard with full CRUD
- Public REST API
- Benchmark page

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python create_admin.py
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment
Create a `.env` file in the backend folder:
