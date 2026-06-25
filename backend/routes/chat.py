from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

print("=== CHAT.PY LOADED: GROQ MODE ===")
key = os.getenv("GROQ_API_KEY", "NOT FOUND")
print(f"=== GROQ KEY: {key[:15]}... ===")
client = Groq(api_key=key)

SYSTEM_PROMPT = """You are Aiden, an expert AI developer assistant inside AI Tools Hub. You also power Cheese, a friendly voice assistant. You have deep knowledge of ChatGPT, Claude, Gemini, Ollama, Copilot, Cursor, LangChain, Google ADK, pre-commit, Semgrep, pyproject.toml, agents-cli, and API key security. Be friendly, concise and helpful. For voice responses keep answers under 3 sentences."""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in request.history[-10:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        messages.append({
            "role": "user",
            "content": request.message
        })

        print(f"Sending to Groq: {request.message}")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=messages
        )
        reply = response.choices[0].message.content
        print(f"Groq replied: {reply[:50]}...")
        return {"reply": reply}
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"reply": f"Error: {str(e)}"}
