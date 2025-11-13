from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    trips,
    activities,
    trip_days,
    participants,
    invites,
    auth,
)

app = FastAPI(title="New Yalla API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # on limite à ton front
    allow_credentials=True,         # car dans ton front tu as credentials: "include"
    allow_methods=["*"],            # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],            # tous les headers
)

app.include_router(trips.router)
app.include_router(activities.router)
app.include_router(trip_days.router)
app.include_router(participants.router)
app.include_router(invites.router)
app.include_router(auth.router)
