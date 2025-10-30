from fastapi import FastAPI
from app.routers import (
    trips_router,
    activities_router,
    trip_days_router,
    participants_router,
    invites_router,
    auth_router,
)

app = FastAPI(title="New Yalla API")

app.include_router(trips_router)
app.include_router(activities_router)
app.include_router(trip_days_router)
app.include_router(participants_router)
app.include_router(invites_router)
app.include_router(auth_router)
