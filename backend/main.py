from fastapi import FastAPI
from app.routers import (
    trips,
    activities,
    trip_days,
    participants,
    invites,
    auth,
)

app = FastAPI(title="New Yalla API")

app.include_router(trips.router)
app.include_router(activities.router)
app.include_router(trip_days.router)
app.include_router(participants.router)
app.include_router(invites.router)
app.include_router(auth.router)
