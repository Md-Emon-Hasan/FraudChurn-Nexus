"""
Unified ML Platform — FastAPI Application Entry Point.
All business logic is delegated to backend.services.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import APP_TITLE, APP_DESCRIPTION, APP_VERSION, ALLOWED_ORIGINS
from backend.database import init_db
from backend.logger import get_logger
from backend.schemas import (
    EcommerceFraudRequest, EcommerceFraudResponse,
    TelecomChurnRequest, TelecomChurnResponse,
)
from backend import services

logger = get_logger(__name__)

# Initialize DB tables on startup
init_db()

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    """Returns API health status."""
    return {"status": "ok", "version": APP_VERSION}


# ── E-commerce Fraud ──────────────────────────────────────────────────────────
@app.get("/api/ecommerce/dropdowns", tags=["E-commerce Fraud"])
def ecommerce_dropdowns():
    """Returns all dropdown option values for the fraud detection form."""
    return services.get_ecommerce_dropdowns()


@app.post("/api/ecommerce/predict", response_model=EcommerceFraudResponse, tags=["E-commerce Fraud"])
def predict_ecommerce(request: EcommerceFraudRequest):
    """Predicts whether a transaction is fraudulent."""
    return services.predict_ecommerce_fraud(request)


# ── Telecom Churn ─────────────────────────────────────────────────────────────
@app.get("/api/churn/dropdowns", tags=["Telecom Churn"])
def churn_dropdowns():
    """Returns all dropdown option values for the churn prediction form."""
    return services.get_churn_dropdowns()


@app.post("/api/churn/predict", response_model=TelecomChurnResponse, tags=["Telecom Churn"])
def predict_churn(request: TelecomChurnRequest):
    """Predicts whether a telecom customer is likely to churn."""
    return services.predict_telecom_churn(request)
