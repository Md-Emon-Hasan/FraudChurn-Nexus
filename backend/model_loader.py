"""
Model loader: loads and caches all ML models at startup.
"""
import pickle
from pathlib import Path
from backend.config import MODELS_DIR
from backend.logger import get_logger

logger = get_logger(__name__)


def _load_pkl(path: Path):
    """Loads a pickle file and returns the object, or None on failure."""
    try:
        with open(path, "rb") as f:
            obj = pickle.load(f)
        logger.info(f"Loaded model artifact: {path.name}")
        return obj
    except Exception as exc:
        logger.error(f"Failed to load {path}: {exc}")
        return None


# ── E-commerce Fraud ──────────────────────────────────────────────────────────
ecommerce_model = _load_pkl(MODELS_DIR / "ecommerce" / "model.pkl")
ecommerce_raw_data = _load_pkl(MODELS_DIR / "ecommerce" / "raw_data.pkl")

# ── Telecom Churn ─────────────────────────────────────────────────────────────
churn_classifier = _load_pkl(MODELS_DIR / "churn" / "classifier.pkl")
churn_df = _load_pkl(MODELS_DIR / "churn" / "df.pkl")
