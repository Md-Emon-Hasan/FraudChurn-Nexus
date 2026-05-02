"""
SQLite database initialization and query helpers for prediction persistence.
"""
import sqlite3
import json
from datetime import datetime
from backend.config import DB_PATH
from backend.logger import get_logger

logger = get_logger(__name__)


def get_connection() -> sqlite3.Connection:
    """Returns a new SQLite connection."""
    return sqlite3.connect(DB_PATH)


def init_db() -> None:
    """Creates prediction log tables if they do not already exist."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ecommerce_predictions (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp     TEXT    NOT NULL,
                request_data  TEXT    NOT NULL,
                prediction    INTEGER NOT NULL,
                fraud_prob    REAL    NOT NULL,
                legit_prob    REAL    NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS churn_predictions (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp     TEXT    NOT NULL,
                request_data  TEXT    NOT NULL,
                predict_churn INTEGER NOT NULL
            )
        """)
        conn.commit()
        logger.info("Database initialized successfully.")
    finally:
        conn.close()


def log_ecommerce_prediction(request_data: dict, prediction: int, fraud_prob: float, legit_prob: float) -> None:
    """Persists an e-commerce fraud prediction to the database."""
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO ecommerce_predictions (timestamp, request_data, prediction, fraud_prob, legit_prob)
            VALUES (?, ?, ?, ?, ?)
            """,
            (datetime.utcnow().isoformat(), json.dumps(request_data), prediction, fraud_prob, legit_prob),
        )
        conn.commit()
    finally:
        conn.close()


def log_churn_prediction(request_data: dict, predict_churn: int) -> None:
    """Persists a telecom churn prediction to the database."""
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO churn_predictions (timestamp, request_data, predict_churn)
            VALUES (?, ?, ?)
            """,
            (datetime.utcnow().isoformat(), json.dumps(request_data), predict_churn),
        )
        conn.commit()
    finally:
        conn.close()
