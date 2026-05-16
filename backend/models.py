from pydantic import BaseModel
from typing import Optional, List


class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None


class ProtestCreate(BaseModel):
    title: str
    description: str
    date: str
    location: Location
    status: Optional[str] = None
    category: Optional[str] = None
    organizers: Optional[List[str]] = None
    participantCount: Optional[int] = None
    sources: Optional[List[dict]] = None


class Protest(ProtestCreate):
    id: str