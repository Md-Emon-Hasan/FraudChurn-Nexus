"""
Tests for database module (init and logging functions).
"""
import sqlite3
import json
import pytest
from unittest.mock import patch
from datetime import datetime


@pytest.fixture
def tmp_db(tmp_path):
    """Create an isolated temporary database for each test."""
    db_path = str(tmp_path / "test_predictions.db")
    with patch("backend.database.DB_PATH", db_path):
        from backend.database import init_db, log_ecommerce_prediction, log_churn_prediction
        init_db()
        yield db_path, log_ecommerce_prediction, log_churn_prediction


class TestDatabaseInit:
    def test_init_creates_ecommerce_table(self, tmp_db):
        db_path, _, _ = tmp_db
        conn = sqlite3.connect(db_path)
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()
        assert "ecommerce_predictions" in tables

    def test_init_creates_churn_table(self, tmp_db):
        db_path, _, _ = tmp_db
        conn = sqlite3.connect(db_path)
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()
        assert "churn_predictions" in tables

    def test_init_is_idempotent(self, tmp_db):
        """init_db can be called multiple times without error."""
        db_path, _, _ = tmp_db
        with patch("backend.database.DB_PATH", db_path):
            from backend.database import init_db
            init_db()
            init_db()


class TestEcommercePredictionLogging:
    def test_log_inserts_row(self, tmp_db):
        db_path, log_ecommerce, _ = tmp_db
        payload = {"source": "SEO", "age": 30}
        log_ecommerce(payload, prediction=1, fraud_prob=85.0, legit_prob=15.0)

        conn = sqlite3.connect(db_path)
        rows = conn.execute("SELECT * FROM ecommerce_predictions").fetchall()
        conn.close()
        assert len(rows) == 1

    def test_log_stores_correct_values(self, tmp_db):
        db_path, log_ecommerce, _ = tmp_db
        payload = {"source": "Ads"}
        log_ecommerce(payload, prediction=0, fraud_prob=10.0, legit_prob=90.0)

        conn = sqlite3.connect(db_path)
        row = conn.execute("SELECT request_data, prediction, fraud_prob, legit_prob FROM ecommerce_predictions").fetchone()
        conn.close()
        assert json.loads(row[0]) == payload
        assert row[1] == 0
        assert row[2] == 10.0


class TestChurnPredictionLogging:
    def test_log_inserts_row(self, tmp_db):
        db_path, _, log_churn = tmp_db
        payload = {"MonthlyCharges": 55.0}
        log_churn(payload, predict_churn=1)

        conn = sqlite3.connect(db_path)
        rows = conn.execute("SELECT * FROM churn_predictions").fetchall()
        conn.close()
        assert len(rows) == 1

    def test_log_stores_correct_churn_value(self, tmp_db):
        db_path, _, log_churn = tmp_db
        payload = {"TotalCharges": 200.0}
        log_churn(payload, predict_churn=0)

        conn = sqlite3.connect(db_path)
        row = conn.execute("SELECT predict_churn FROM churn_predictions").fetchone()
        conn.close()
        assert row[0] == 0
