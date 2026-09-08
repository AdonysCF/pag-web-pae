from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.database import Base, engine
from backend import models

from backend.api.pacientes import router as pacientes_router
from backend.api.auth import router as auth_router
from backend.api.valoraciones import router as valoraciones_router
from backend.api.diagnosticos import router as diagnosticos_router
from backend.api.pae import router as pae_router

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title="Nursify API",
    description="API del sistema de apoyo al Proceso de Atención de Enfermería",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(auth_router)
app.include_router(pacientes_router)
app.include_router(valoraciones_router)
app.include_router(diagnosticos_router)
app.include_router(pae_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Nursify API funcionando",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "nursify-api",
    }