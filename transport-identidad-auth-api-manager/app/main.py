import logging

from fastapi import FastAPI

from app.adapters.inbound.rest.router import router as auth_router

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(title="transport-identidad-auth-api-manager", version="0.1.0")

app.include_router(auth_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
