import logging
from backend.logger import get_logger

def test_logger_duplicate_handlers():
    logger1 = get_logger("test_duplicate")
    assert len(logger1.handlers) == 2
    logger2 = get_logger("test_duplicate")
    assert len(logger2.handlers) == 2
