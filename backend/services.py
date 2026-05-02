"""
Business logic / prediction services for all ML models.
"""
import numpy as np
import pandas as pd
from fastapi import HTTPException

from backend import model_loader
from backend.database import log_ecommerce_prediction, log_churn_prediction
from backend.logger import get_logger
from backend.schemas import (
    EcommerceFraudRequest,
    EcommerceFraudResponse,
    TelecomChurnRequest,
    TelecomChurnResponse,
)

logger = get_logger(__name__)

ECOMMERCE_COLUMNS = [
    "source", "browser", "sex", "age", "country_name",
    "n_device_occur", "signup_month", "signup_day", "signup_day_name",
    "purchase_month", "purchase_day", "purchase_day_name", "purchase_over_time",
]

CHURN_FEATURE_ORDER = [
    "SeniorCitizen", "Dependents", "Contract_One_year", "Contract_MonthToMonth",
    "Contract_Two_year", "tenure_bin_New", "tenure_bin_Mid", "tenure_bin_Long",
    "InternetService_Fiber_optic", "OnlineSecurity", "TechSupport",
    "PaymentMethod_Electronic_check", "PaperlessBilling", "MonthlyCharges", "TotalCharges",
]


def predict_ecommerce_fraud(request: EcommerceFraudRequest) -> EcommerceFraudResponse:
    """Run the e-commerce fraud prediction pipeline."""
    if model_loader.ecommerce_model is None:
        raise HTTPException(status_code=503, detail="E-commerce model is not available. Check server logs.")

    try:
        query = pd.DataFrame([[
            request.source, request.browser, request.sex, request.age, request.country_name,
            request.n_device_occur, request.signup_month, request.signup_day, request.signup_day_name,
            request.purchase_month, request.purchase_day, request.purchase_day_name, request.purchase_over_time,
        ]], columns=ECOMMERCE_COLUMNS)

        prediction = int(model_loader.ecommerce_model.predict(query)[0])
        proba = model_loader.ecommerce_model.predict_proba(query)[0]
        fraud_prob = round(float(proba[1]) * 100, 1)
        legit_prob = round(float(proba[0]) * 100, 1)

        log_ecommerce_prediction(request.model_dump(), prediction, fraud_prob, legit_prob)
        logger.info(f"E-commerce prediction: {prediction} | fraud_prob={fraud_prob}%")

        return EcommerceFraudResponse(prediction=prediction, fraud_prob=fraud_prob, legit_prob=legit_prob)

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"E-commerce prediction error: {exc}", exc_info=True)
        raise HTTPException(status_code=422, detail=f"Prediction failed: {exc}")


def predict_telecom_churn(request: TelecomChurnRequest) -> TelecomChurnResponse:
    """Run the telecom churn prediction pipeline."""
    if model_loader.churn_classifier is None:
        raise HTTPException(status_code=503, detail="Churn model is not available. Check server logs.")

    try:
        features = np.array([getattr(request, col) for col in CHURN_FEATURE_ORDER], dtype=float).reshape(1, -1)

        prediction = int(model_loader.churn_classifier.predict(features)[0])

        log_churn_prediction(request.model_dump(), prediction)
        logger.info(f"Churn prediction: {prediction}")

        return TelecomChurnResponse(predict_churn=prediction)

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Churn prediction error: {exc}", exc_info=True)
        raise HTTPException(status_code=422, detail=f"Prediction failed: {exc}")


def get_ecommerce_dropdowns() -> dict:
    """Return dropdown options for the e-commerce fraud form."""
    if model_loader.ecommerce_raw_data is None:
        raise HTTPException(status_code=503, detail="E-commerce data not available.")

    data = model_loader.ecommerce_raw_data
    return {
        "sources": sorted(data["source"].unique().tolist()),
        "browsers": sorted(data["browser"].unique().tolist()),
        "sexs": sorted(data["sex"].unique().tolist()),
        "country_names": sorted(data["country_name"].unique().tolist()),
        "signup_day_names": sorted(data["signup_day_name"].unique().tolist()),
        "purchase_day_names": sorted(data["purchase_day_name"].unique().tolist()),
        "months": [
            {"value": 1, "label": "January"}, {"value": 2, "label": "February"},
            {"value": 3, "label": "March"}, {"value": 4, "label": "April"},
            {"value": 5, "label": "May"}, {"value": 6, "label": "June"},
            {"value": 7, "label": "July"}, {"value": 8, "label": "August"},
            {"value": 9, "label": "September"}, {"value": 10, "label": "October"},
            {"value": 11, "label": "November"}, {"value": 12, "label": "December"},
        ],
        "days": list(range(1, 32)),
    }


def get_churn_dropdowns() -> dict:
    """Return dropdown options for the telecom churn form."""
    if model_loader.churn_df is None:
        raise HTTPException(status_code=503, detail="Churn data not available.")

    df = model_loader.churn_df
    categorical_cols = [
        "SeniorCitizen", "Dependents", "Contract_MonthToMonth", "Contract_One_year",
        "Contract_Two_year", "tenure_bin_New", "tenure_bin_Mid", "tenure_bin_Long",
        "InternetService_Fiber_optic", "OnlineSecurity", "TechSupport",
        "PaymentMethod_Electronic_check", "PaperlessBilling",
    ]
    return {col: sorted(df[col].unique().tolist()) for col in categorical_cols}
