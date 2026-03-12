from fastapi import FastAPI
from .routes.auth_route import router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
 
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)