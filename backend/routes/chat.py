from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are Aiden, an expert AI developer assistant. You have deep knowledge of:
- ChatGPT, Claude, Gemini, Ollama — LLM usage and API integration
- GitHub Copilot, Cursor — AI-powered coding tools
- LangChain, Google ADK (Agent Development Kit) — agent frameworks
- pre-commit hooks, Semgrep — code quality and security
- pyproject.toml — Python project configuration
- agents-cli — Google ADK CLI tool
- API key security best practices (.env, .gitignore, never hardcode)

Provide concise, helpful answers. When showing code, use markdown code blocks."""

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/chat")
def chat(request: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        history = []
        if request.history:
            for msg in request.history:
                role = "model" if msg.get("role") == "assistant" else "user"
                history.append({"role": role, "parts": [msg.get("content", "")]})

        chat_session = model.start_chat(history=history)
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {request.message}"
        response = chat_session.send_message(full_prompt)

        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
