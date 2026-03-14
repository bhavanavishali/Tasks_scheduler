from fastapi import FastAPI
from .routes.auth_route import router as auth_router

from .routes.task_route import router as task_router
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
 
app.include_router(auth_router)
app.include_router(task_router, prefix="/api") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE", "OPTIONS","PATCH"],
    allow_headers=["*"],
)