from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes.auth_route import router as auth_router
from .routes.task_route import router as task_router

app = FastAPI()

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

print("CORS origins:", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(task_router, prefix="/api")