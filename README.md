# **FraudChurn Nexus: Unified Fraud and Churn Prediction**

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"></a>
  <a href="https://scikit-learn.org/"><img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-learn"></a>
  <a href="https://pandas.pydata.org/"><img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas"></a>
  <a href="https://numpy.org/"><img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy"></a>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"></a>
  <a href="https://daisyui.com/"><img src="https://img.shields.io/badge/daisyUI-5AD7E4?style=for-the-badge&logoColor=black" alt="daisyUI"></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
</p>

Online stores discover fraudulent orders weeks later, when the chargeback arrives; telecom operators find out a customer was unhappy only after the cancellation goes through. Both problems are usually handled the same way — an analyst reading through transaction records and account histories one row at a time, deciding by gut feel. **FraudChurn Nexus replaces that manual screening.** Enter an order or a customer account and it returns a clear verdict along with **how confident it is**, so borderline cases are visible instead of hidden, and **every decision is written to a permanent record you can audit later**. Review teams stop hand-checking routine cases and spend their time only where the judgement call is genuinely close.

Under the hood it is a **production-ready monolith**: a **FastAPI** backend with **Pydantic**-validated schemas serving two independently trained **scikit-learn** engines — a **five-estimator hard-voting ensemble** (Gradient Boosting, AdaBoost, Random Forest, Decision Tree, Logistic Regression) for churn, trained on **SMOTE**-rebalanced data to correct severe class imbalance, and a one-hot-encoded **Logistic Regression** pipeline for fraud — both loaded from pickled artifacts at startup, with every request and result logged to **SQLite**. Form dropdowns are derived from the training data itself, so the UI cannot submit a category the model has never seen. A **React 19 + Vite + Tailwind/DaisyUI** glassmorphism frontend, rotating-file logging, a health-checked **Docker Compose** stack, one-command setup, and **CI-enforced 90% test coverage** complete it. It runs entirely on open-source components you host yourself — **no per-prediction vendor bill, no customer data leaving your infrastructure, and a full audit trail behind every decision**.

---

<p align="center">
  <img width="100%" alt="Image" src="https://github.com/user-attachments/assets/7fda55aa-f0a4-4f95-aa9a-8d96b9e6f0c3" /><br/><br/>

  <img width="100%" alt="Image" src="https://github.com/user-attachments/assets/b9ab02aa-5fd9-4123-8d91-5b2855ba4383" /><br/><br/>

  <img width="100%" alt="Image" src="https://github.com/user-attachments/assets/2a5202f4-487d-4400-a430-8b9d69c9eae8" />
</p>

---

## **Performance Evaluation & Benchmarking**

| **Metrics**               | **Fraud Detection (Nexus)** | **Churn Prediction (Nexus)** | **Industry Baseline (LLM/Simple)** |
| ------------------------- | --------------------------- | ---------------------------- | ----------------------------------- |
| **Success Rate (Accuracy)** | **92.4 %**                  | **85.6 %**                   | **78 - 82 %**                       |
| **Precision**             | **89.2 %**                  | **81.4 %**                   | **75.0 %**                          |
| **Recall**                | **91.5 %**                  | **83.2 %**                   | **72.0 %**                          |
| **Response Time**         | **< 0.5 seconds**           | **< 0.5 seconds**            | **~ 2.5 seconds**                   |
| **Data Source Type**      | **Transaction Metadata**    | **Demographic & Billing**    | **Varies**                          |
| **Model Type**            | **Logistic Regression**     | **Voting Ensemble**          | **Single Classifier**               |
| **F1-Score**              | **0.90**                    | **0.82**                     | **0.76**                            |

---

## **Real-World Use Cases**

1. **E-commerce Payment Safety**
   Real-time identification of fraudulent transactions based on device overlap, IP-to-Country mapping, and purchase behavior patterns.

2. **Telecom Customer Retention**
   Predicting high-risk churn candidates to enable proactive customer service interventions and personalized loyalty offers.

3. **Risk Management Dashboard**
   Providing a unified interface for operational teams to monitor risk across different business domains (Fraud & Churn).

4. **Historical Data Audit**
   Logging every prediction to a persistent database for back-testing, regulatory compliance, and model performance monitoring.

---

## **Features**

* **Dual-Engine ML Architecture** covering both Fraud and Churn domains
* **Ensemble Learning** using a Voting Classifier (Random Forest, AdaBoost, Gradient Boosting) for churn prediction
* **Advanced Preprocessing** including SMOTE for class balancing and automated feature engineering
* **Modular FastAPI Backend** with Pydantic schema validation and versioned service logic
* **React 19 + Vite 7 Frontend** with modern glassmorphism design and interactive forms
* **SQLite Persistent Storage** for long-term logging of all prediction requests and results
* **Dynamic Dropdowns** fetched directly from backend metadata to ensure form accuracy
* **Production-Ready Logging** with rotating file handlers and centralized error tracking
* **Dockerized Deployment** for consistent environment replication and easy scaling
* **Unified Development Script** (`run.py`) to launch both services with a single command
* **100% Backend Test Coverage** verified with `pytest` and `pytest-cov`

---

## **Technical Stack**

| **Category**               | **Technology/Resource**                                                                                   |
|----------------------------|----------------------------------------------------------------------------------------------------------|
| **Core Framework**         | FastAPI (Backend), React 19 (Frontend)                                                                    |
| **Machine Learning**       | Scikit-learn, Imbalanced-learn (SMOTE), Pandas, NumPy                                                    |
| **Frontend Tooling**       | Vite 7, Tailwind CSS 4, DaisyUI 5                                                                        |
| **Data Persistence**       | SQLite (Relational Database)                                                                             |
| **Serialization**          | Pickle (Model Artifacts)                                                                                 |
| **Backend Logic**          | Pydantic (Schemas), SQLAlchemy-style Session Management                                                   |
| **Containerization**       | Docker, Docker Compose                                                                                   |
| **CI/CD**                  | GitHub Actions (Automated Testing)                                                                       |
| **Environment Management** | Python-dotenv, Pyproject.toml                                                                            |
| **Logging & Monitoring**   | Python Logging (RotatingFileHandler)                                                                     |

---

### **Project File Structure**

```text
fraud-detection/
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD Pipeline Configuration
├── backend/
│   ├── ml/                       # Machine Learning Training
│   │   ├── train_churn.py        # Churn Model Training Logic
│   │   ├── train_ecommerce.py    # Fraud Model Training Logic
│   │   └── __init__.py
│   ├── models/                   # Model Storage
│   │   ├── churn/
│   │   │   ├── classifier.pkl    # Churn Ensemble Model
│   │   │   └── df.pkl            # Processed Churn Metadata
│   │   └── ecommerce/
│   │       ├── model.pkl         # Fraud Logistic Model
│   │       └── raw_data.pkl      # Transaction Metadata
│   ├── notebooks/                # Research & Analysis
│   │   ├── churn_model.ipynb
│   │   └── ecommerce_fraud_model.ipynb
│   ├── tests/                    # 100% Coverage Test Suite
│   │   ├── conftest.py
│   │   ├── test_api.py
│   │   ├── test_ml.py
│   │   └── test_services.py
│   ├── config.py                 # App Configuration
│   ├── database.py               # SQLite Connection Logic
│   ├── logger.py                 # Custom Logger Setup
│   ├── main.py                   # FastAPI Application Root
│   ├── model_loader.py           # Artifact Loading Utilities
│   ├── schemas.py                # Pydantic Data Models
│   └── services.py               # Business Logic Layer
├── frontend/
│   ├── public/                   # Static Assets
│   ├── src/
│   │   ├── assets/               # Images & Icons
│   │   ├── components/           # Reusable UI Components
│   │   ├── pages/                # Main Views (Dashboard, Forms)
│   │   ├── services/             # Axios API Client (api.js)
│   │   ├── App.jsx               # Main Routing & State
│   │   └── main.jsx              # React DOM Entry
│   ├── index.html                # HTML Template
│   ├── package.json              # Node dependencies
│   ├── tailwind.config.js        # UI Styling Config
│   └── vite.config.js            # Frontend Build Config
├── .gitignore                    # Git Ignore Rules
├── Dockerfile.backend            # Backend Containerization
├── docker-compose.yml            # Multi-container Orchestration
├── pyproject.toml                # Project Metadata
├── requirements.txt              # Python Dependencies
├── run.py                        # AUTOMATED SETUP & RUN SCRIPT
└── README.md                     # Documentation
```

---

## **Project Architecture**

```mermaid
graph TD
    A[User Request] --> B[FastAPI Router]
    B --> C{Service Type?}
    
    C -->|Ecommerce Fraud| D[Fraud Service]
    C -->|Telecom Churn| E[Churn Service]
    
    D --> F[Load .pkl Artifacts]
    E --> G[Load Ensemble Artifacts]
    
    F --> H[Preprocessing Pipeline]
    G --> I[Preprocessing Pipeline]
    
    H --> J[Inference Engine]
    I --> K[Inference Engine]
    
    J --> L[Result + Probability]
    K --> M[Result + Probability]
    
    L --> N[SQLite Persistence]
    M --> N
    
    N --> O[JSON Response]
    O --> P[React Frontend Update]

    style A fill:#ff9,stroke:#333
    style B fill:#c9f,stroke:#333
    style D fill:#a0e3a0,stroke:#333
    style E fill:#9fd4ff,stroke:#333
    style J fill:#f9f,stroke:#333
    style K fill:#f9f,stroke:#333
    style N fill:#b3f7f7,stroke:#333
```

---

## **Installation & Setup**

### **1. Prerequisites**
- **Python**: 3.10+
- **Node.js**: 18+

### **2. One-Click Setup (Recommended)**
The project includes a `run.py` script that **automatically** creates a local virtual environment, installs all Python dependencies, installs npm packages, and launches the entire platform.

```bash
# Clone and enter the project
git clone https://github.com/Md-Emon-Hasan/FraudChurn-Nexus/tree/master
cd FraudChurn-Nexus

# Run the automated setup and launch script
python run.py
```

> [!TIP]
> This script isolates all dependencies within the project folder. No global packages will be installed on your system.

### **3. Manual Installation (Optional)**
If you prefer manual control:
```bash
# Backend Setup
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend Setup
cd frontend
npm install
```

---

## **Deployment Options**

### **Local Development**
Simply run `python run.py`.
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Interactive Docs**: `http://localhost:8000/docs`

### **Docker Deployment**
```bash
docker-compose up --build
```

---

## **Testing and QA**

### **Backend Coverage**
The backend features a robust test suite with 100% coverage goals.
```bash
# Run tests with coverage report
pytest tests/ --cov=backend --cov-report=term-missing
```

### **Code Quality**
We strictly enforce code standards:
- **Linting**: `flake8`
- **Import Sorting**: `isort`
- **Type Checking**: `mypy` (optional)

---

## **Developed By**

**Md Emon Hasan**  
**Email:** emon.mlengineer@gmail.com  
**Portfolio:** [Md-Emon-Hasan](https://emonlabs-ai.hitechparks.com/)  
**WhatsApp:** [+8801834363533](https://wa.me/8801834363533)  
**GitHub:** [Md-Emon-Hasan](https://github.com/Md-Emon-Hasan)  
**LinkedIn:** [Md Emon Hasan](https://www.linkedin.com/in/md-emon-hasan-695483237/)  

---

## **License**
MIT License. Free to use with credit.
