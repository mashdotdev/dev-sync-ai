import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import db
from routers import reports, sync, webhooks

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.create_pool()
    yield
    await db.close_pool()


app = FastAPI(title="DevSync AI Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sync.router, prefix="/sync", tags=["sync"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])


@app.get("/health")
async def health():
    return {"status": "ok"}
