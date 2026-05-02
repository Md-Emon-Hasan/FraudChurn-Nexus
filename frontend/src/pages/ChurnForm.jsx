import { useState, useEffect } from 'react';
import { getChurnDropdowns, predictChurn } from '../services/api';

// Human-readable label mappings for binary (0/1) fields
const LABEL_MAP = {
    SeniorCitizen: { 0: 'No — Not a Senior Citizen', 1: 'Yes — Senior Citizen (65+)' },
    Dependents: { 0: 'No — No Dependents', 1: 'Yes — Has Dependents' },
    Contract_MonthToMonth: { 0: 'No — Other Contract', 1: 'Yes — Month-to-Month' },
    Contract_One_year: { 0: 'No — Other Contract', 1: 'Yes — One Year Contract' },
    Contract_Two_year: { 0: 'No — Other Contract', 1: 'Yes — Two Year Contract' },
    tenure_bin_New: { 0: 'No', 1: 'Yes — New Customer (0-12 months)' },
    tenure_bin_Mid: { 0: 'No', 1: 'Yes — Mid-term (13-48 months)' },
    tenure_bin_Long: { 0: 'No', 1: 'Yes — Long-term (49+ months)' },
    InternetService_Fiber_optic: { 0: 'No — DSL or No Internet', 1: 'Yes — Fiber Optic' },
    OnlineSecurity: { 0: 'No — Not Subscribed', 1: 'Yes — Has Online Security' },
    TechSupport: { 0: 'No — Not Subscribed', 1: 'Yes — Has Tech Support' },
    PaymentMethod_Electronic_check: { 0: 'No — Other Payment Method', 1: 'Yes — Electronic Check' },
    PaperlessBilling: { 0: 'No — Paper Billing', 1: 'Yes — Paperless Billing' },
};

const ChurnForm = () => {
    const [dropdowns, setDropdowns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        SeniorCitizen: 0, Dependents: 0, Contract_MonthToMonth: 0.0,
        Contract_One_year: 0.0, Contract_Two_year: 0.0, tenure_bin_New: 0.0,
        tenure_bin_Mid: 0.0, tenure_bin_Long: 0.0, InternetService_Fiber_optic: 0.0,
        OnlineSecurity: 0, TechSupport: 0, PaymentMethod_Electronic_check: 0.0,
        PaperlessBilling: 0, MonthlyCharges: 0.0, TotalCharges: 0.0
    });

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const data = await getChurnDropdowns();
                setDropdowns(data);
                setFormData(prev => ({
                    ...prev,
                    SeniorCitizen: data.SeniorCitizen[0] ?? 0,
                    Dependents: data.Dependents[0] ?? 0,
                    Contract_MonthToMonth: data.Contract_MonthToMonth[0] ?? 0,
                    Contract_One_year: data.Contract_One_year[0] ?? 0,
                    Contract_Two_year: data.Contract_Two_year[0] ?? 0,
                    tenure_bin_New: data.tenure_bin_New[0] ?? 0,
                    tenure_bin_Mid: data.tenure_bin_Mid[0] ?? 0,
                    tenure_bin_Long: data.tenure_bin_Long[0] ?? 0,
                    InternetService_Fiber_optic: data.InternetService_Fiber_optic[0] ?? 0,
                    OnlineSecurity: data.OnlineSecurity[0] ?? 0,
                    TechSupport: data.TechSupport[0] ?? 0,
                    PaymentMethod_Electronic_check: data.PaymentMethod_Electronic_check[0] ?? 0,
                    PaperlessBilling: data.PaperlessBilling[0] ?? 0,
                }));
                setLoading(false);
            } catch (_err) {
                setError('Failed to load form data. Please ensure the backend server is running.');
                setLoading(false);
            }
        };
        fetchDropdowns();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0.0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPredicting(true);
        setError(null);
        setResult(null);
        try {
            const data = await predictChurn(formData);
            setResult(data);
        } catch (_err) {
            setError('Prediction failed. Please check your inputs and try again.');
        } finally {
            setPredicting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '300px', gap: '16px',
            }}>
                <div style={{
                    width: '40px', height: '40px', border: '3px solid #CCFBF1',
                    borderTopColor: 'var(--churn-accent)', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>Loading form data...</p>
            </div>
        );
    }

    if (error && !dropdowns) {
        return (
            <div style={{
                padding: '20px', borderRadius: '14px', background: '#FEF2F2',
                border: '1px solid #FECACA', color: '#DC2626', fontWeight: 500, fontSize: '0.938rem',
            }}>
                ⚠️ {error}
            </div>
        );
    }

    const renderSelect = (label, name, options, helperText) => (
        <div style={{ marginBottom: '4px' }}>
            <label className="premium-label">{label}</label>
            <select name={name} value={formData[name]} onChange={handleChange} className="premium-select churn-select">
                {options.map(opt => {
                    const labelMap = LABEL_MAP[name];
                    const displayLabel = labelMap ? (labelMap[opt] || opt) : opt;
                    return <option key={opt} value={opt}>{displayLabel}</option>;
                })}
            </select>
            {helperText && <span className="premium-helper">{helperText}</span>}
        </div>
    );

    const renderInput = (label, name, helperText, options = {}) => (
        <div style={{ marginBottom: '4px' }}>
            <label className="premium-label">{label}</label>
            <input
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="premium-input churn-input"
                required
                {...options}
            />
            {helperText && <span className="premium-helper">{helperText}</span>}
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ minHeight: '100%' }}>
            {/* Page background */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--churn-bg)', zIndex: -1, pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '5px 14px', borderRadius: '100px',
                    background: 'rgba(8, 145, 178, 0.06)', border: '1px solid rgba(8, 145, 178, 0.12)',
                    marginBottom: '16px',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--churn-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--churn-accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Telecom Analytics
                    </span>
                </div>

                <h1 style={{
                    fontFamily: "'Poppins', 'Inter', sans-serif", fontSize: '2rem',
                    fontWeight: 800, color: '#1E293B', letterSpacing: '-0.03em', marginBottom: '8px',
                }}>
                    Churn Prediction
                </h1>
                <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6, maxWidth: '600px' }}>
                    Analyze customer profiles to identify their likelihood of discontinuing telecom services.
                </p>
            </div>

            {/* Form Card */}
            <div style={{
                background: 'white', borderRadius: '20px', border: '1px solid rgba(8, 145, 178, 0.08)',
                padding: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)',
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {/* Demographics */}
                        <div>
                            <h3 className="section-header churn-section-header">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                    Demographics
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {renderSelect('Senior Citizen', 'SeniorCitizen', dropdowns.SeniorCitizen, 'Is the customer 65 years or older?')}
                                {renderSelect('Dependents', 'Dependents', dropdowns.Dependents, 'Does the customer have dependents?')}
                            </div>
                        </div>

                        {/* Service Details */}
                        <div>
                            <h3 className="section-header churn-section-header">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                                    </svg>
                                    Service Subscriptions
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {renderSelect('Fiber Optic Internet', 'InternetService_Fiber_optic', dropdowns.InternetService_Fiber_optic, 'Type of internet connection')}
                                {renderSelect('Online Security', 'OnlineSecurity', dropdowns.OnlineSecurity, 'Online security add-on service')}
                                {renderSelect('Tech Support', 'TechSupport', dropdowns.TechSupport, 'Technical support add-on service')}
                            </div>
                        </div>

                        {/* Account & Billing */}
                        <div>
                            <h3 className="section-header churn-section-header">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                    Account & Billing
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {renderInput('Monthly Charges ($)', 'MonthlyCharges', 'Current monthly bill amount', { step: '0.01', min: 0 })}
                                {renderInput('Total Charges ($)', 'TotalCharges', 'Cumulative total charges to date', { step: '0.01', min: 0 })}
                                {renderSelect('Paperless Billing', 'PaperlessBilling', dropdowns.PaperlessBilling, 'How billing statements are delivered')}
                                {renderSelect('Payment Method', 'PaymentMethod_Electronic_check', dropdowns.PaymentMethod_Electronic_check, 'Primary payment method used')}
                            </div>
                        </div>
                    </div>

                    {/* Contract & Tenure Section */}
                    <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {/* Contract Type */}
                        <div style={{
                            padding: '20px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, #F0FFFE, #E6FFFE)',
                            border: '1px solid rgba(8, 145, 178, 0.08)',
                        }}>
                            <h4 style={{
                                fontSize: '0.875rem', fontWeight: 700, color: 'var(--churn-accent)',
                                marginBottom: '14px', letterSpacing: '0.02em',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                </svg>
                                Contract Type
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {renderSelect('Month-to-Month', 'Contract_MonthToMonth', dropdowns.Contract_MonthToMonth)}
                                {renderSelect('One Year', 'Contract_One_year', dropdowns.Contract_One_year)}
                                {renderSelect('Two Year', 'Contract_Two_year', dropdowns.Contract_Two_year)}
                            </div>
                        </div>

                        {/* Tenure */}
                        <div style={{
                            padding: '20px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, #F0FFFE, #E6FFFE)',
                            border: '1px solid rgba(8, 145, 178, 0.08)',
                        }}>
                            <h4 style={{
                                fontSize: '0.875rem', fontWeight: 700, color: 'var(--churn-accent)',
                                marginBottom: '14px', letterSpacing: '0.02em',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                                Customer Tenure
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {renderSelect('New Customer', 'tenure_bin_New', dropdowns.tenure_bin_New, 'Short tenure (0-12 months)')}
                                {renderSelect('Mid-term Customer', 'tenure_bin_Mid', dropdowns.tenure_bin_Mid, 'Medium tenure (13-48 months)')}
                                {renderSelect('Long-term Customer', 'tenure_bin_Long', dropdowns.tenure_bin_Long, 'Loyal customer (49+ months)')}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '32px' }}>
                        <button
                            type="submit"
                            disabled={predicting}
                            className="premium-btn churn-btn"
                            style={{ width: '100%' }}
                        >
                            {predicting ? (
                                <>
                                    <div style={{
                                        width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }} />
                                    Calculating Risk...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    Predict Churn Likelihood
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error */}
                {error && (
                    <div className="animate-scale-in" style={{
                        marginTop: '24px', padding: '16px 20px', borderRadius: '14px',
                        background: '#FEF2F2', border: '1px solid #FECACA',
                        color: '#DC2626', fontWeight: 500, fontSize: '0.938rem',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="animate-scale-in" style={{
                        marginTop: '28px', borderRadius: '18px', overflow: 'hidden',
                        border: result.predict_churn === 1 ? '2px solid #FDE68A' : '2px solid #86EFAC',
                        background: result.predict_churn === 1
                            ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
                            : 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
                    }}>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <h3 style={{
                                fontFamily: "'Poppins', 'Inter', sans-serif",
                                fontSize: '1.25rem', fontWeight: 700,
                                color: '#1E293B', marginBottom: '20px',
                            }}>
                                Prediction Result
                            </h3>

                            {/* Status Icon & Badge */}
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                            }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: result.predict_churn === 1
                                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                        : 'linear-gradient(135deg, #10B981, #059669)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: result.predict_churn === 1
                                        ? '0 6px 20px rgba(245, 158, 11, 0.3)'
                                        : '0 6px 20px rgba(16, 185, 129, 0.3)',
                                }}>
                                    {result.predict_churn === 1 ? (
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                        </svg>
                                    ) : (
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                        </svg>
                                    )}
                                </div>

                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 28px', borderRadius: '100px',
                                    background: result.predict_churn === 1 ? '#D97706' : '#059669',
                                    color: 'white', fontWeight: 700, fontSize: '1.125rem',
                                    boxShadow: result.predict_churn === 1
                                        ? '0 4px 14px rgba(217, 119, 6, 0.3)'
                                        : '0 4px 14px rgba(5, 150, 105, 0.3)',
                                }}>
                                    {result.predict_churn === 1 ? '⚠️ High Risk of Churn' : '✅ Likely to Retain'}
                                </div>

                                <p style={{
                                    fontSize: '0.938rem', color: '#64748B', maxWidth: '400px', lineHeight: 1.6,
                                }}>
                                    {result.predict_churn === 1
                                        ? 'This customer shows a high probability of discontinuing services. Consider proactive retention strategies.'
                                        : 'This customer appears satisfied and is likely to continue using the services.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChurnForm;
