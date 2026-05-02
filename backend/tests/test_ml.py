import pytest
import pandas as pd
import numpy as np
import os
from unittest.mock import patch, MagicMock

from backend.ml.train_ecommerce import load_data as load_eco_data, transform_ip, preprocess_data as preprocess_eco, train_ecommerce_model
from backend.ml.train_churn import load_data as load_churn_data, preprocess_data as preprocess_churn, train_churn_model

@pytest.fixture
def mock_ecommerce_fraud_data():
    return pd.DataFrame({
        'user_id': [1, 2, 3],
        'signup_time': ['2023-01-01 10:00:00', '2023-01-02 11:00:00', 'invalid_date'],
        'purchase_time': ['2023-01-03 10:00:00', '2023-01-04 11:00:00', 'invalid_date'],
        'purchase_value': [100, 200, 300],
        'device_id': ['D1', 'D2', 'D1'],
        'source': ['SEO', 'Ads', 'SEO'],
        'browser': ['Chrome', 'Safari', 'Chrome'],
        'sex': ['M', 'F', 'M'],
        'age': [30, 40, 50],
        'ip_address': [1000, 2000, 3000],
        'class': [0, 1, 0]
    })

@pytest.fixture
def mock_ecommerce_ip_data():
    return pd.DataFrame({
        'lower_bound_ip_address': [500, 1500],
        'upper_bound_ip_address': [1500, 2500],
        'country': ['US', 'UK']
    })

@pytest.fixture
def mock_churn_data():
    return pd.DataFrame({
        'customerID': ['1', '2', '3', '4', '5'],
        'gender': ['Male', 'Female', 'Male', 'Female', 'Male'],
        'SeniorCitizen': [0, 1, 0, 0, 1],
        'Partner': ['Yes', 'No', 'No', 'Yes', 'No'],
        'Dependents': ['No', 'Yes', 'No', 'No', 'Yes'],
        'tenure': [10, 50, 2, 70, 5],
        'PhoneService': ['Yes', 'Yes', 'No', 'Yes', 'No'],
        'MultipleLines': ['No', 'Yes', 'No phone service', 'No', 'No'],
        'InternetService': ['DSL', 'Fiber optic', 'No', 'DSL', 'Fiber optic'],
        'OnlineSecurity': ['Yes', 'No', 'No internet service', 'Yes', 'No'],
        'OnlineBackup': ['No', 'Yes', 'No internet service', 'Yes', 'No'],
        'DeviceProtection': ['No', 'No', 'No internet service', 'Yes', 'No'],
        'TechSupport': ['Yes', 'No', 'No internet service', 'Yes', 'No'],
        'StreamingTV': ['No', 'Yes', 'No internet service', 'Yes', 'No'],
        'StreamingMovies': ['No', 'No', 'No internet service', 'Yes', 'No'],
        'Contract': ['Month-to-month', 'One year', 'Month-to-month', 'Two year', 'Month-to-month'],
        'PaperlessBilling': ['Yes', 'No', 'Yes', 'No', 'Yes'],
        'PaymentMethod': ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)', 'Electronic check'],
        'MonthlyCharges': [50.0, 100.0, 20.0, 60.0, 80.0],
        'TotalCharges': ['500.0', '5000.0', ' ', '4200.0', '400.0'],
        'Churn': ['No', 'Yes', 'No', 'No', 'Yes']
    })


def test_ecommerce_load_data(mock_ecommerce_fraud_data, mock_ecommerce_ip_data):
    with patch('pandas.read_csv') as mock_read:
        mock_read.side_effect = [mock_ecommerce_fraud_data, mock_ecommerce_ip_data]
        f, i = load_eco_data('path1', 'path2')
        assert len(f) == 3
        assert len(i) == 2

def test_ecommerce_transform_ip(mock_ecommerce_ip_data):
    assert transform_ip(1000, mock_ecommerce_ip_data) == 'US'
    assert transform_ip(2000, mock_ecommerce_ip_data) == 'UK'
    assert transform_ip(4000, mock_ecommerce_ip_data) == 'Unknown Country'
    
    # Test Exception
    with patch('pandas.DataFrame.__getitem__', side_effect=Exception("error")):
        assert transform_ip(1000, mock_ecommerce_ip_data) == 'Unknown Country'

def test_ecommerce_preprocess(mock_ecommerce_fraud_data, mock_ecommerce_ip_data):
    data = preprocess_eco(mock_ecommerce_fraud_data, mock_ecommerce_ip_data)
    assert 'class' in data.columns
    assert 'country_name' in data.columns
    assert 'ip_address' not in data.columns
    # 2 rows should remain because of valid dates causing no NaNs, the 3rd row with invalid date drops because of NaNs
    assert len(data) == 2

def test_ecommerce_train_model(mock_ecommerce_fraud_data, mock_ecommerce_ip_data, tmp_path):
    # Add enough rows to have both classes after dropna
    more_fraud = mock_ecommerce_fraud_data.copy()
    more_fraud['class'] = [0, 1, 1]
    more_fraud = pd.concat([more_fraud, more_fraud, more_fraud])
    
    with patch('backend.ml.train_ecommerce.load_data', return_value=(more_fraud, mock_ecommerce_ip_data)):
        model_path = tmp_path / "model.pkl"
        data_path = tmp_path / "data.pkl"
        pipe = train_ecommerce_model('p1', 'p2', str(model_path), str(data_path))
        assert pipe is not None
        assert model_path.exists()
        assert data_path.exists()

def test_churn_load_data(mock_churn_data):
    with patch('pandas.read_csv', return_value=mock_churn_data):
        d = load_churn_data('path1')
        assert len(d) == 5

def test_churn_preprocess(mock_churn_data):
    data = preprocess_churn(mock_churn_data)
    assert 'Churn' in data.columns
    assert 'customerID' not in data.columns

def test_churn_train_model_success(mock_churn_data, tmp_path):
    # We need enough data for SMOTE, k_neighbors is min(5, len(X_train)-1), 
    # so we'll just duplicate data to have enough rows.
    large_churn = pd.concat([mock_churn_data] * 5, ignore_index=True)
    with patch('backend.ml.train_churn.load_data', return_value=large_churn):
        model_path = tmp_path / "churn_model.pkl"
        data_path = tmp_path / "churn_data.pkl"
        model = train_churn_model('p1', str(model_path), str(data_path))
        assert model is not None
        assert model_path.exists()
        assert data_path.exists()

def test_churn_train_model_missing_churn(mock_churn_data):
    mock_churn_data = mock_churn_data.drop('Churn', axis=1)
    with patch('backend.ml.train_churn.load_data', return_value=mock_churn_data):
        with pytest.raises(ValueError, match="Churn column missing from data after preprocessing"):
            train_churn_model('p1', None, None)

def test_churn_train_model_single_class(mock_churn_data):
    mock_churn_data['Churn'] = 'No'
    with patch('backend.ml.train_churn.load_data', return_value=mock_churn_data):
        with pytest.raises(ValueError, match="Need both classes to train."):
            train_churn_model('p1', None, None)
