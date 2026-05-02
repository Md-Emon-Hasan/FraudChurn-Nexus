import pandas as pd
import numpy as np
import pickle
import os
import warnings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, MinMaxScaler
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import (
    AdaBoostClassifier, 
    GradientBoostingClassifier, 
    RandomForestClassifier, 
    VotingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings('ignore')

def load_data(filepath):
    return pd.read_csv(filepath)

def preprocess_data(df):
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors='coerce')
    df['TotalCharges'] = df['TotalCharges'].fillna(0)
    if 'customerID' in df.columns:
        df = df.drop('customerID', axis=1)

    columns_to_update = ['OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies']
    df[columns_to_update] = df[columns_to_update].replace('No internet service', 'No')
    df['MultipleLines'] = df['MultipleLines'].replace('No phone service', 'No')
    
    bins = [-1, 24, 48, 72]
    labels = ['New', 'Mid', 'Long']
    df['tenure_bin'] = pd.cut(df['tenure'], bins=bins, labels=labels, right=True)
    
    label_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 
                  'Churn', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport',
                  'StreamingTV', 'StreamingMovies', 'MultipleLines', 'SeniorCitizen']
    
    le = LabelEncoder()
    for col in label_cols:
        if col in df.columns:
            df[col] = le.fit_transform(df[col])

    one_hot_cols = ['Contract', 'PaymentMethod', 'InternetService', 'tenure_bin']
    ohe = OneHotEncoder()
    # Filter to only the one_hot_cols that are in df
    one_hot_cols_present = [col for col in one_hot_cols if col in df.columns]
    
    if one_hot_cols_present:
        ohe_result = ohe.fit_transform(df[one_hot_cols_present])
        ohe_columns = ohe.get_feature_names_out(one_hot_cols_present)
        df = pd.concat([df.drop(columns=one_hot_cols_present), pd.DataFrame(ohe_result.toarray(), columns=ohe_columns)], axis=1)
    
    mms = MinMaxScaler()
    df['tenure'] = mms.fit_transform(df[['tenure']])
    
    # We only care about specific features
    final_features_expected = [
        'SeniorCitizen', 'Dependents', 'Contract_Month-to-month', 'Contract_One year', 
        'Contract_Two year', 'tenure_bin_New', 'tenure_bin_Mid', 'tenure_bin_Long', 
        'InternetService_Fiber optic', 'OnlineSecurity', 'TechSupport', 
        'PaymentMethod_Electronic check', 'PaperlessBilling', 'MonthlyCharges', 
        'TotalCharges', 'Churn'
    ]
    
    final_features = [f for f in final_features_expected if f in df.columns]
    df_final = df[final_features]
    
    df_final = df_final.rename(columns={
        'Contract_Month-to-month': 'Contract_MonthToMonth',
        'Contract_One year': 'Contract_One_year',
        'Contract_Two year': 'Contract_Two_year',
        'InternetService_Fiber optic': 'InternetService_Fiber_optic',
        'PaymentMethod_Electronic check': 'PaymentMethod_Electronic_check'
    })
    
    return df_final

def train_churn_model(data_path, model_save_path, data_save_path):
    df = load_data(data_path)
    df_final = preprocess_data(df)
    
    if 'Churn' not in df_final.columns:
        raise ValueError("Churn column missing from data after preprocessing")
        
    X = df_final.drop('Churn', axis=1)
    y = df_final['Churn']
    
    # We need to make sure we have at least some samples of each class for SMOTE
    # So if there's less than 2 classes, just return
    if len(y.unique()) < 2:
        raise ValueError("Need both classes to train.")
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    smote = SMOTE(random_state=42, k_neighbors=min(5, len(X_train)-1))
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
    
    model_ada = AdaBoostClassifier(n_estimators=50, random_state=42)
    model_gb = GradientBoostingClassifier(n_estimators=50, random_state=42)
    model_lr = LogisticRegression(max_iter=1000, random_state=42)
    model_dt = DecisionTreeClassifier(max_depth=3, random_state=2)
    model_rfc = RandomForestClassifier(n_estimators=50, max_depth=3, random_state=2)
    
    voting_classifier = VotingClassifier(estimators=[
        ('gb', model_gb),
        ('ada', model_ada),
        ('lr', model_lr),
        ('dt', model_dt),
        ('rfc', model_rfc)
    ], voting='hard')
    
    voting_classifier.fit(X_train_smote, y_train_smote)
    
    if model_save_path and data_save_path:
        os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
        os.makedirs(os.path.dirname(data_save_path), exist_ok=True)
        with open(data_save_path, 'wb') as f:
            pickle.dump(df_final, f)
        with open(model_save_path, 'wb') as f:
            pickle.dump(voting_classifier, f)
            
    return voting_classifier

if __name__ == "__main__":  # pragma: no cover
    train_churn_model(
        data_path="../../data/WA_Fn-UseC_-Telco-Customer-Churn.xls",
        model_save_path="../models/churn/classifier.pkl",
        data_save_path="../models/churn/df.pkl"
    )
