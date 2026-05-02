// Vite dev proxy forwards /api -> http://localhost:8000/api
// In production, set VITE_API_BASE or configure a reverse proxy
const API_BASE = '/api';

async function handleResponse(response) {
    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail || `HTTP error ${response.status}`);
    }
    return response.json();
}

export const getEcommerceDropdowns = () =>
    fetch(`${API_BASE}/ecommerce/dropdowns`).then(handleResponse);

export const predictEcommerce = (data) =>
    fetch(`${API_BASE}/ecommerce/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getChurnDropdowns = () =>
    fetch(`${API_BASE}/churn/dropdowns`).then(handleResponse);

export const predictChurn = (data) =>
    fetch(`${API_BASE}/churn/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleResponse);
