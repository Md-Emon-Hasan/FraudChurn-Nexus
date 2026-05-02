import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle
import os

def load_data(fraud_path, ip_path):
    fraud_data = pd.read_csv(fraud_path)
    ip_data = pd.read_csv(ip_path)
    return fraud_data, ip_data

def transform_ip(arg, ip_data):
    try:
        match = ip_data[(ip_data.lower_bound_ip_address < arg) & (ip_data.upper_bound_ip_address > arg)]
        if not match.empty:
            return match.iloc[0].country
        return "Unknown Country"
    except Exception:
        return "Unknown Country"

def preprocess_data(fraud_data, ip_data):
    # This might be very slow to run in reality if it's applying transform_ip to a huge df.
    # In tests we just mock.
    fraud_data['country_name'] = fraud_data['ip_address'].apply(lambda x: transform_ip(x, ip_data))
    
    fraud_data['signup_time'] = pd.to_datetime(fraud_data['signup_time'], errors='coerce')
    fraud_data['purchase_time'] = pd.to_datetime(fraud_data['purchase_time'], errors='coerce')
    
    fraud_data['signup_month'] = fraud_data['signup_time'].dt.month
    fraud_data['signup_day'] = fraud_data['signup_time'].dt.day
    fraud_data['signup_day_name'] = fraud_data['signup_time'].dt.day_name()
    
    fraud_data['purchase_month'] = fraud_data['purchase_time'].dt.month
    fraud_data['purchase_day'] = fraud_data['purchase_time'].dt.day
    fraud_data['purchase_day_name'] = fraud_data['purchase_time'].dt.day_name()
    
    device_count = fraud_data['device_id'].value_counts()
    fraud_data['n_device_occur'] = fraud_data['device_id'].map(device_count)
    
    to_remove = ['ip_address', 'device_id', 'user_id', 'purchase_value', 'signup_time', 'purchase_time']
    data = fraud_data.drop(columns=[c for c in to_remove if c in fraud_data.columns])
    
    if 'sex' in data.columns:
        data['sex'] = data['sex'].astype(object)
    
    data = data.replace([np.inf, -np.inf], np.nan)
    data = data.dropna()
    
    # reorder columns to have 'class' at the end
    if 'class' in data.columns:
        new_column_order = [col for col in data.columns if col != 'class'] + ['class']
        data = data[new_column_order]
    
    return data

def train_ecommerce_model(fraud_data_path, ip_data_path, model_save_path, data_save_path):
    fraud_data, ip_data = load_data(fraud_data_path, ip_data_path)
    data = preprocess_data(fraud_data, ip_data)
    
    x = data.drop(columns=['class'])
    y = data['class']
    
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.20, random_state=59, stratify=y)
    
    cat_cols = x.select_dtypes(include=['object', 'category']).columns.tolist()
    
    step1 = ColumnTransformer(
        transformers=[
            ('col_tnf', OneHotEncoder(sparse_output=False, drop='first', handle_unknown='ignore'), cat_cols)
        ],
        remainder='passthrough'
    )
    
    pipe = Pipeline([
        ('step1', step1),
        ('step2', LogisticRegression(max_iter=1000))
    ])
    
    pipe.fit(x_train, y_train)
    
    if model_save_path and data_save_path:
        os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
        os.makedirs(os.path.dirname(data_save_path), exist_ok=True)
        
        with open(data_save_path, 'wb') as f:
            pickle.dump(data, f)
        with open(model_save_path, 'wb') as f:
            pickle.dump(pipe, f)
    
    return pipe

if __name__ == "__main__":  # pragma: no cover
    train_ecommerce_model(
        fraud_data_path="../../data/Fraud_Data.csv",
        ip_data_path="../../data/IpAddress_to_Country.csv",
        model_save_path="../models/ecommerce/model.pkl",
        data_save_path="../models/ecommerce/raw_data.pkl"
    )
