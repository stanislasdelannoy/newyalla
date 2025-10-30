from .trips import router as trips_router
from .activities import router as activities_router
from .trip_days import router as trip_days_router
from .participants import router as participants_router
from .invites import router as invites_router
from .auth import router as auth_router

__all__ = [
    "trips_router",
    "activities_router",
    "trip_days_router",
    "participants_router",
    "invites_router",
    "auth_router",
]
