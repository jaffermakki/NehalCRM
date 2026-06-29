from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import sync
from app.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TechPro Enterprise CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Configure in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sync.router, prefix="/api/v1/sync", tags=["Sync"])

@app.get("/")
def read_root():
    return {"status": "TechPro CRM Backend Active"}
