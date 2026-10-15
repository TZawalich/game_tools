from fastapi import FastAPI, APIRouter

app = FastAPI()
api = APIRouter(prefix="/api")

@api.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api)
