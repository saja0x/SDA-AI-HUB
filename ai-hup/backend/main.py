from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from seed_db import seed_database
 

from routers import auth
from routers import users
from routers import models
from routers import admin
 

from routers import model_detail
from routers import comparison
 

from routers import playground
from routers import chatbot
 
app = FastAPI(title="Lumia — AI Model Hub")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://localhost:5174",
        "http://127.0.0.1:5173", "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
 
@app.on_event("startup")
def on_startup():
    seed_database()
 
 
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(models.router)
app.include_router(comparison.router)
app.include_router(admin.router)
app.include_router(model_detail.router)
 
app.include_router(playground.router)
app.include_router(chatbot.router)
 
 
@app.get("/")
def root():
    return {"message": "AI Model Hub API is running"}