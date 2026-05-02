"""
Logging configuration for the Unified ML Platform backend.
"""
import logging
import logging.handlers
from backend.config import LOG_FILE, LOG_LEVEL


def get_logger(name: str) -> logging.Logger:
    """
    Returns a logger instance configured with a rotating file handler
    and a console handler.
    """
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger  # Avoid adding duplicate handlers

    logger.setLevel(getattr(logging, LOG_LEVEL.upper(), logging.INFO))

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Rotating file handler (max 5MB, 5 backups)
    file_handler = logging.handlers.RotatingFileHandler(
        LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8"
    )
    file_handler.setFormatter(formatter)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger
