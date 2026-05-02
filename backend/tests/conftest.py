"""
Shared pytest fixtures and mocks for all test modules.
"""
import pytest
import numpy as np
import pandas as pd
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient


# ─── Minimal mock dataframe matching churn model expectations ────────────────
def _make_churn_df():
    return pd.DataFrame({
        "SeniorCitizen": [0, 1],
        "Dependents": [0, 1],
        "Contract_MonthToMonth": [0.0, 1.0],
        "Contract_One_year": [0.0, 1.0],
        "Contract_Two_year": [0.0, 1.0],
        "tenure_bin_New": [0.0, 1.0],
        "tenure_bin_Mid": [0.0, 1.0],
        "tenure_bin_Long": [0.0, 1.0],
        "InternetService_Fiber_optic": [0.0, 1.0],
        "OnlineSecurity": [0, 1],
        "TechSupport": [0, 1],
        "PaymentMethod_Electronic_check": [0.0, 1.0],
        "PaperlessBilling": [0, 1],
    })


def _make_ecommerce_data():
    return pd.DataFrame({
        "source": ["SEO", "Ads"],
        "browser": ["Chrome", "Firefox"],
        "sex": ["M", "F"],
        "country_name": ["United States", "United Kingdom"],
        "signup_day_name": ["Monday", "Friday"],
        "purchase_day_name": ["Wednesday", "Saturday"],
    })


@pytest.fixture
def mock_ecommerce_model():
    model = MagicMock()
    model.predict.return_value = np.array([0])
    model.predict_proba.return_value = np.array([[0.85, 0.15]])
    return model


@pytest.fixture
def mock_churn_classifier():
    classifier = MagicMock()
    classifier.predict.return_value = np.array([0])
    return classifier


@pytest.fixture
def app_client(mock_ecommerce_model, mock_churn_classifier):
    """TestClient with all model artifacts mocked."""
    with patch("backend.model_loader.ecommerce_model", mock_ecommerce_model), \
         patch("backend.model_loader.ecommerce_raw_data", _make_ecommerce_data()), \
         patch("backend.model_loader.churn_classifier", mock_churn_classifier), \
         patch("backend.model_loader.churn_df", _make_churn_df()), \
         patch("backend.database.log_ecommerce_prediction"), \
         patch("backend.database.log_churn_prediction"):
        from backend.main import app
        with TestClient(app) as client:
            yield client


@pytest.fixture
def valid_ecommerce_payload():
    return {
        "source": "SEO",
        "browser": "Chrome",
        "sex": "M",
        "age": 30,
        "country_name": "United States",
        "n_device_occur": 1,
        "signup_month": 1,
        "signup_day": 15,
        "signup_day_name": "Monday",
        "purchase_month": 2,
        "purchase_day": 10,
        "purchase_day_name": "Wednesday",
        "purchase_over_time": 120.5,
    }


@pytest.fixture
def valid_churn_payload():
    return {
        "SeniorCitizen": 0,
        "Dependents": 0,
        "Contract_MonthToMonth": 1.0,
        "Contract_One_year": 0.0,
        "Contract_Two_year": 0.0,
        "tenure_bin_New": 1.0,
        "tenure_bin_Mid": 0.0,
        "tenure_bin_Long": 0.0,
        "InternetService_Fiber_optic": 0.0,
        "OnlineSecurity": 0,
        "TechSupport": 0,
        "PaymentMethod_Electronic_check": 1.0,
        "PaperlessBilling": 1,
        "MonthlyCharges": 55.0,
        "TotalCharges": 660.0,
    }
