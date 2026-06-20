# AI Tools Hub

A web application showcasing AI development tools, LLM APIs, agent frameworks, and security best practices. Built with React + Vite + TailwindCSS (frontend) and Python FastAPI + OpenAI GPT-4o (backend).

## Project Structure

```
ai-tools-hub/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/  # Navbar, ChatBot, ToolCard, CodeBlock, StepGuide
│   │   ├── pages/       # Home, Tools, Setup, Agents, Security
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/           # Python FastAPI
│   ├── main.py
│   ├── routes/chat.py
│   ├── .env
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key

## Setup

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```
OPENAI_API_KEY=sk-proj-your-key-here
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at http://localhost:5173.

## Features

- **Home** — Hero section with tag pills, featured AI tools grid, dev workflow tools
- **Tools** — Filterable grid of 8 AI tools with detail views, install commands, and quick-start code
- **Setup** — Step-by-step guides for ChatGPT API, Ollama, and pyproject.toml
- **Agents** — Google ADK scaffold/lint commands and agent code examples
- **Security** — API key best practices, pre-commit hooks (Gitleaks + Ruff), Semgrep scan commands
- **ChatBot** — Floating AI assistant "Aiden" powered by GPT-4o, with chat history and quick replies
- **Dark Mode** — Toggle in navbar persists across navigation

## API Endpoints

| Method | Path         | Description       |
|--------|--------------|-------------------|
| GET    | `/`          | Health check      |
| POST   | `/api/chat`  | Chat with Aiden   |
