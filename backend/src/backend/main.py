from fastapi import FastAPI, APIRouter
from backend.routers import cards

app = FastAPI()
api = APIRouter(prefix="/api")

@api.get("/health")
def health():
    return {"status": "ok"}

api.include_router(cards.router)
app.include_router(api)
