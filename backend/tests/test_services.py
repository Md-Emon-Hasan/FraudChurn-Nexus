"""
Tests for the prediction service layer (services.py).
"""
import numpy as np
import pandas as pd
import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from backend.schemas import EcommerceFraudRequest, TelecomChurnRequest


def make_ecommerce_request():
    return EcommerceFraudRequest(
        source="SEO", browser="Chrome", sex="M", age=30,
        country_name="United States", n_device_occur=1,
        signup_month=1, signup_day=15, signup_day_name="Monday",
        purchase_month=2, purchase_day=10, purchase_day_name="Wednesday",
        purchase_over_time=120.5,
    )


def make_churn_request():
    return TelecomChurnRequest(
        SeniorCitizen=0, Dependents=0,
        Contract_MonthToMonth=1.0, Contract_One_year=0.0, Contract_Two_year=0.0,
        tenure_bin_New=1.0, tenure_bin_Mid=0.0, tenure_bin_Long=0.0,
        InternetService_Fiber_optic=0.0, OnlineSecurity=0, TechSupport=0,
        PaymentMethod_Electronic_check=1.0, PaperlessBilling=1,
        MonthlyCharges=55.0, TotalCharges=660.0,
    )


class TestEcommerceService:
    def test_returns_fraud_response(self):
        mock_model = MagicMock()
        mock_model.predict.return_value = np.array([1])
        mock_model.predict_proba.return_value = np.array([[0.2, 0.8]])

        with patch("backend.model_loader.ecommerce_model", mock_model), \
             patch("backend.database.log_ecommerce_prediction"):
            from backend.services import predict_ecommerce_fraud
            result = predict_ecommerce_fraud(make_ecommerce_request())

        assert result.prediction == 1
        assert result.fraud_prob == 80.0
        assert result.legit_prob == 20.0

    def test_raises_503_when_model_none(self):
        with patch("backend.model_loader.ecommerce_model", None):
            from backend.services import predict_ecommerce_fraud
            with pytest.raises(HTTPException) as exc_info:
                predict_ecommerce_fraud(make_ecommerce_request())
        assert exc_info.value.status_code == 503

    def test_probabilities_sum_to_100(self):
        mock_model = MagicMock()
        mock_model.predict.return_value = np.array([0])
        mock_model.predict_proba.return_value = np.array([[0.75, 0.25]])

        with patch("backend.model_loader.ecommerce_model", mock_model), \
             patch("backend.database.log_ecommerce_prediction"):
            from backend.services import predict_ecommerce_fraud
            result = predict_ecommerce_fraud(make_ecommerce_request())

        assert round(result.fraud_prob + result.legit_prob, 1) == 100.0

    def test_predict_ecommerce_fraud_exception(self):
        mock_model = MagicMock()
        mock_model.predict.side_effect = Exception("Model failed")
        with patch("backend.model_loader.ecommerce_model", mock_model):
            from backend.services import predict_ecommerce_fraud
            with pytest.raises(HTTPException) as exc_info:
                predict_ecommerce_fraud(make_ecommerce_request())
        assert exc_info.value.status_code == 422

    def test_predict_ecommerce_fraud_http_exception(self):
        mock_model = MagicMock()
        mock_model.predict.side_effect = HTTPException(status_code=400, detail="Test")
        with patch("backend.model_loader.ecommerce_model", mock_model):
            from backend.services import predict_ecommerce_fraud
            with pytest.raises(HTTPException) as exc_info:
                predict_ecommerce_fraud(make_ecommerce_request())
        assert exc_info.value.status_code == 400


class TestChurnService:
    def test_returns_churn_response(self):
        mock_classifier = MagicMock()
        mock_classifier.predict.return_value = np.array([1])

        with patch("backend.model_loader.churn_classifier", mock_classifier), \
             patch("backend.database.log_churn_prediction"):
            from backend.services import predict_telecom_churn
            result = predict_telecom_churn(make_churn_request())

        assert result.predict_churn == 1

    def test_raises_503_when_classifier_none(self):
        with patch("backend.model_loader.churn_classifier", None):
            from backend.services import predict_telecom_churn
            with pytest.raises(HTTPException) as exc_info:
                predict_telecom_churn(make_churn_request())
        assert exc_info.value.status_code == 503

    def test_predict_telecom_churn_exception(self):
        mock_classifier = MagicMock()
        mock_classifier.predict.side_effect = Exception("Model failed")
        with patch("backend.model_loader.churn_classifier", mock_classifier):
            from backend.services import predict_telecom_churn
            with pytest.raises(HTTPException) as exc_info:
                predict_telecom_churn(make_churn_request())
        assert exc_info.value.status_code == 422

    def test_predict_telecom_churn_http_exception(self):
        mock_classifier = MagicMock()
        mock_classifier.predict.side_effect = HTTPException(status_code=400, detail="Test")
        with patch("backend.model_loader.churn_classifier", mock_classifier):
            from backend.services import predict_telecom_churn
            with pytest.raises(HTTPException) as exc_info:
                predict_telecom_churn(make_churn_request())
        assert exc_info.value.status_code == 400


class TestDropdownServices:
    def test_ecommerce_dropdowns_raises_503_when_data_none(self):
        with patch("backend.model_loader.ecommerce_raw_data", None):
            from backend.services import get_ecommerce_dropdowns
            with pytest.raises(HTTPException) as exc_info:
                get_ecommerce_dropdowns()
        assert exc_info.value.status_code == 503

    def test_churn_dropdowns_raises_503_when_data_none(self):
        with patch("backend.model_loader.churn_df", None):
            from backend.services import get_churn_dropdowns
            with pytest.raises(HTTPException) as exc_info:
                get_churn_dropdowns()
        assert exc_info.value.status_code == 503
