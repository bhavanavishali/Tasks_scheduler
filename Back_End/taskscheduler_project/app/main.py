from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.auth_route import router as auth_router
import os
from .routes.task_route import router as task_router


app=FastAPI()
 


origins = [
    "http://localhost:5173",
    "https://tasks-scheduler-cyan.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE", "OPTIONS","PATCH"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(task_router, prefix="/api") 