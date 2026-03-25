from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes.auth_route import router as auth_router
from .routes.task_route import router as task_router

app = FastAPI()

# CORS FIRST
origins = [
    "http://localhost:5173",
    "https://tasks-scheduler-cyan.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# THEN routers
app.include_router(auth_router)
app.include_router(task_router, prefix="/api")