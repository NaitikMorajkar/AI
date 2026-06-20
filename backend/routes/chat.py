from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

class Message(BaseModel):
    role: str
    content: str

@router.post("/chat")
def chat(request: ChatRequest):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in request.history:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        messages.append({"role": "user", "content": request.message})

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=2048,
        )

        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
