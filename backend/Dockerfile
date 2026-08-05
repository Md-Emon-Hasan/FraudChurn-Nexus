FROM python:3.10-slim

WORKDIR /app

# Copy config
COPY pyproject.toml .
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -e .

# Copy backend source
COPY backend/ backend/

# Create runtime directories
RUN mkdir -p logs data

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
