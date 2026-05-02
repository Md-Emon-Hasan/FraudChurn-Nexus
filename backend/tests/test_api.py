"""
Tests for backend API endpoints (health, ecommerce, churn).
"""
import pytest


class TestHealthEndpoint:
    def test_health_returns_ok(self, app_client):
        response = app_client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert "version" in body


class TestEcommerceDropdowns:
    def test_dropdowns_returns_200(self, app_client):
        response = app_client.get("/api/ecommerce/dropdowns")
        assert response.status_code == 200

    def test_dropdowns_has_required_keys(self, app_client):
        data = app_client.get("/api/ecommerce/dropdowns").json()
        required_keys = {"sources", "browsers", "sexs", "country_names",
                         "signup_day_names", "purchase_day_names", "months", "days"}
        assert required_keys.issubset(data.keys())

    def test_months_has_12_entries(self, app_client):
        data = app_client.get("/api/ecommerce/dropdowns").json()
        assert len(data["months"]) == 12

    def test_days_has_31_entries(self, app_client):
        data = app_client.get("/api/ecommerce/dropdowns").json()
        assert len(data["days"]) == 31


class TestEcommercePrediction:
    def test_valid_prediction_returns_200(self, app_client, valid_ecommerce_payload):
        response = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload)
        assert response.status_code == 200

    def test_prediction_response_has_required_fields(self, app_client, valid_ecommerce_payload):
        data = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload).json()
        assert "prediction" in data
        assert "fraud_prob" in data
        assert "legit_prob" in data

    def test_prediction_result_is_binary(self, app_client, valid_ecommerce_payload):
        data = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload).json()
        assert data["prediction"] in (0, 1)

    def test_probabilities_sum_to_100(self, app_client, valid_ecommerce_payload):
        data = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload).json()
        total = round(data["fraud_prob"] + data["legit_prob"], 1)
        assert total == 100.0

    def test_missing_field_returns_422(self, app_client, valid_ecommerce_payload):
        del valid_ecommerce_payload["age"]
        response = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload)
        assert response.status_code == 422

    def test_invalid_age_type_returns_422(self, app_client, valid_ecommerce_payload):
        valid_ecommerce_payload["age"] = "not-a-number"
        response = app_client.post("/api/ecommerce/predict", json=valid_ecommerce_payload)
        assert response.status_code == 422


class TestChurnDropdowns:
    def test_dropdowns_returns_200(self, app_client):
        response = app_client.get("/api/churn/dropdowns")
        assert response.status_code == 200

    def test_dropdowns_has_required_keys(self, app_client):
        data = app_client.get("/api/churn/dropdowns").json()
        required_keys = {"SeniorCitizen", "Dependents", "Contract_MonthToMonth"}
        assert required_keys.issubset(data.keys())


class TestChurnPrediction:
    def test_valid_prediction_returns_200(self, app_client, valid_churn_payload):
        response = app_client.post("/api/churn/predict", json=valid_churn_payload)
        assert response.status_code == 200

    def test_prediction_response_has_required_field(self, app_client, valid_churn_payload):
        data = app_client.post("/api/churn/predict", json=valid_churn_payload).json()
        assert "predict_churn" in data

    def test_prediction_result_is_binary(self, app_client, valid_churn_payload):
        data = app_client.post("/api/churn/predict", json=valid_churn_payload).json()
        assert data["predict_churn"] in (0, 1)

    def test_missing_field_returns_422(self, app_client, valid_churn_payload):
        del valid_churn_payload["MonthlyCharges"]
        response = app_client.post("/api/churn/predict", json=valid_churn_payload)
        assert response.status_code == 422

    def test_negative_monthly_charges_returns_422(self, app_client, valid_churn_payload):
        valid_churn_payload["MonthlyCharges"] = -50.0
        response = app_client.post("/api/churn/predict", json=valid_churn_payload)
        assert response.status_code == 422
