import os
from dotenv import load_dotenv
load_dotenv()

print("STARTUP KEY CHECK:", os.environ.get("GROQ_API_KEY", "NOT FOUND")[:15])

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def health():
    return {"status": "ok", "message": "AI Tools Hub API is running"}
