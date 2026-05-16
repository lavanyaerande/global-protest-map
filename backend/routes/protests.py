from fastapi import APIRouter
from models import ProtestCreate
from database import protest_collection
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime

router = APIRouter()

@router.post("/protests")
def create_protest(protest: ProtestCreate):
    result = protest_collection.insert_one(protest.dict())
    return {"id": str(result.inserted_id)}

@router.get("/protests")
def get_all_protests():
    protests = []

    for p in protest_collection.find():

        p["id"] = str(p["_id"])
        del p["_id"]

        protest_date = datetime.fromisoformat(p["date"].replace("Z", "")).date()
        today = datetime.today().date()

        if protest_date > today:
             p["status"] = "planned"
        elif protest_date == today:
             p["status"] = "active"
        else:
             p["status"] = "past"

        protests.append(p)

    return protests

from bson import ObjectId
from fastapi import HTTPException

@router.get("/protests/{protest_id}")
def get_protest_by_id(protest_id: str):
    protest = protest_collection.find_one({"_id": ObjectId(protest_id)})
    if not protest:
        raise HTTPException(status_code=404, detail="Protest not found")

    protest["id"] = str(protest["_id"])
    del protest["_id"]
    return protest

@router.post("/test")
def test_insert():
    data = {"name": "test protest", "city": "Pune"}
    result = protest_collection.insert_one(data)
    return {"id": str(result.inserted_id)}