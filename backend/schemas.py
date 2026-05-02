"""
Pydantic request/response schemas for all ML endpoints.
"""
from pydantic import BaseModel, Field


# ── E-commerce Fraud Detection ────────────────────────────────────────────────
class EcommerceFraudRequest(BaseModel):
    source: str = Field(..., description="Traffic source of the user session (e.g., SEO, Ads)")
    browser: str = Field(..., description="Browser used for the transaction")
    sex: str = Field(..., description="Gender of the user (M/F)")
    age: int = Field(..., ge=1, le=120, description="Age of the user")
    country_name: str = Field(..., description="Country of origin")
    n_device_occur: int = Field(..., ge=1, description="Number of transactions from this device")
    signup_month: int = Field(..., ge=1, le=12, description="Month of account signup (1-12)")
    signup_day: int = Field(..., ge=1, le=31, description="Day of account signup (1-31)")
    signup_day_name: str = Field(..., description="Day name of signup (e.g., Monday)")
    purchase_month: int = Field(..., ge=1, le=12, description="Month of purchase (1-12)")
    purchase_day: int = Field(..., ge=1, le=31, description="Day of purchase (1-31)")
    purchase_day_name: str = Field(..., description="Day name of purchase (e.g., Friday)")
    purchase_over_time: float = Field(..., ge=0, description="Seconds elapsed between signup and purchase")


class EcommerceFraudResponse(BaseModel):
    prediction: int = Field(..., description="0 = Legitimate, 1 = Fraudulent")
    fraud_prob: float = Field(..., description="Probability of fraud (%)")
    legit_prob: float = Field(..., description="Probability of legitimacy (%)")


# ── Telecom Customer Churn Prediction ────────────────────────────────────────
class TelecomChurnRequest(BaseModel):
    SeniorCitizen: int = Field(..., description="Senior citizen status (1 = Yes, 0 = No)")
    Dependents: int = Field(..., description="Has dependents (1 = Yes, 0 = No)")
    Contract_MonthToMonth: float = Field(..., description="On month-to-month contract (1.0 = Yes)")
    Contract_One_year: float = Field(..., description="On a one-year contract (1.0 = Yes)")
    Contract_Two_year: float = Field(..., description="On a two-year contract (1.0 = Yes)")
    tenure_bin_New: float = Field(..., description="Short-tenure customer segment")
    tenure_bin_Mid: float = Field(..., description="Mid-tenure customer segment")
    tenure_bin_Long: float = Field(..., description="Long-tenure customer segment")
    InternetService_Fiber_optic: float = Field(..., description="Fiber optic internet subscription")
    OnlineSecurity: int = Field(..., description="Online security subscription (1 = Yes)")
    TechSupport: int = Field(..., description="Tech support subscription (1 = Yes)")
    PaymentMethod_Electronic_check: float = Field(..., description="Pays via electronic check")
    PaperlessBilling: int = Field(..., description="Paperless billing enabled (1 = Yes)")
    MonthlyCharges: float = Field(..., ge=0, description="Current monthly bill amount in USD")
    TotalCharges: float = Field(..., ge=0, description="Cumulative total charges to date in USD")


class TelecomChurnResponse(BaseModel):
    predict_churn: int = Field(..., description="0 = Retained, 1 = Will Churn")
