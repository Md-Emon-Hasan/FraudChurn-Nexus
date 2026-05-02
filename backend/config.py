"""
Backend configuration and settings.
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent  # project root
BACKEND_DIR = Path(__file__).resolve().parent
LOGS_DIR = BACKEND_DIR / "logs"
DATA_DIR = BACKEND_DIR / "data"
MODELS_DIR = BACKEND_DIR / "models"

# Ensure directories exist
LOGS_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

# Database
DB_PATH = str(DATA_DIR / "predictions.db")

# Logging
LOG_FILE = str(LOGS_DIR / "api.log")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# App metadata
APP_TITLE = "FraudChurn Nexus API"
APP_DESCRIPTION = "Production-grade ML Intelligence Platform API for E-commerce Fraud Detection and Telecom Customer Churn Prediction."
APP_VERSION = "1.0.0"
