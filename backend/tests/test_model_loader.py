from pathlib import Path
from unittest.mock import patch
from backend.model_loader import _load_pkl

def test_load_pkl_exception():
    with patch("builtins.open", side_effect=Exception("File read error")):
        result = _load_pkl(Path("dummy.pkl"))
    assert result is None
