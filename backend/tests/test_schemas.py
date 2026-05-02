"""
Tests for backend schemas (Pydantic validation).
"""
import pytest
from pydantic import ValidationError
from backend.schemas import (
    EcommerceFraudRequest, EcommerceFraudResponse,
    TelecomChurnRequest, TelecomChurnResponse,
)


VALID_ECOMMERCE = {
    "source": "SEO", "browser": "Chrome", "sex": "M", "age": 30,
    "country_name": "United States", "n_device_occur": 1,
    "signup_month": 1, "signup_day": 15, "signup_day_name": "Monday",
    "purchase_month": 2, "purchase_day": 10, "purchase_day_name": "Wednesday",
    "purchase_over_time": 120.5,
}

VALID_CHURN = {
    "SeniorCitizen": 0, "Dependents": 0,
    "Contract_MonthToMonth": 1.0, "Contract_One_year": 0.0, "Contract_Two_year": 0.0,
    "tenure_bin_New": 1.0, "tenure_bin_Mid": 0.0, "tenure_bin_Long": 0.0,
    "InternetService_Fiber_optic": 0.0, "OnlineSecurity": 0, "TechSupport": 0,
    "PaymentMethod_Electronic_check": 1.0, "PaperlessBilling": 1,
    "MonthlyCharges": 55.0, "TotalCharges": 660.0,
}


class TestEcommerceSchemas:
    def test_valid_request_parses(self):
        req = EcommerceFraudRequest(**VALID_ECOMMERCE)
        assert req.age == 30

    def test_age_below_minimum_raises(self):
        with pytest.raises(ValidationError):
            EcommerceFraudRequest(**{**VALID_ECOMMERCE, "age": 0})

    def test_age_above_maximum_raises(self):
        with pytest.raises(ValidationError):
            EcommerceFraudRequest(**{**VALID_ECOMMERCE, "age": 150})

    def test_negative_purchase_time_raises(self):
        with pytest.raises(ValidationError):
            EcommerceFraudRequest(**{**VALID_ECOMMERCE, "purchase_over_time": -1.0})

    def test_invalid_month_raises(self):
        with pytest.raises(ValidationError):
            EcommerceFraudRequest(**{**VALID_ECOMMERCE, "signup_month": 13})

    def test_response_model_valid(self):
        resp = EcommerceFraudResponse(prediction=1, fraud_prob=85.0, legit_prob=15.0)
        assert resp.prediction == 1


class TestChurnSchemas:
    def test_valid_request_parses(self):
        req = TelecomChurnRequest(**VALID_CHURN)
        assert req.MonthlyCharges == 55.0

    def test_negative_monthly_charges_raises(self):
        with pytest.raises(ValidationError):
            TelecomChurnRequest(**{**VALID_CHURN, "MonthlyCharges": -10.0})

    def test_negative_total_charges_raises(self):
        with pytest.raises(ValidationError):
            TelecomChurnRequest(**{**VALID_CHURN, "TotalCharges": -5.0})

    def test_response_model_valid(self):
        resp = TelecomChurnResponse(predict_churn=0)
        assert resp.predict_churn == 0
