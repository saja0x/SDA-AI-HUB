# 🤖 AI Hub

A platform to discover, compare, and chat with different AI models (GPT, Claude, Gemini, DeepSeek, and more) in one place.

## ✨ Features

- Browse and search AI models with filters
- Compare models side by side
- Chat directly with models in the Playground
- Chatbot that recommends the best model for your use case
- User login/register with admin dashboard

## 🧰 Tech Stack

- Frontend: React + Vite
- Backend: FastAPI + SQLite
- AI: OpenRouter API

## 🚀 How to Run

Backend:

    cd ai-hup/backend
    python -m venv venv
    venv\Scripts\activate
    pip install fastapi uvicorn sqlalchemy python-dotenv requests
    uvicorn main:app --reload --port 8000

Frontend:

    cd ai-hup/frontend
    npm install
    npm run dev
