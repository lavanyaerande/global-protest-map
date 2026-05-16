from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from routes.protests import router
import requests  # ✅ CORRECT

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← change this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/search-location")
def search_location(q: str = Query(...)):
    url = "https://nominatim.openstreetmap.org/search"
    response = requests.get(
        url,
        params={
            "format": "json",
            "q": q
        },
        headers={
            "User-Agent": "protest-map-app"
        }
    )
    return response.json()