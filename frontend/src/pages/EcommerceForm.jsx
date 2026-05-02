import { useState, useEffect } from 'react';
import { getEcommerceDropdowns, predictEcommerce } from '../services/api';

const EcommerceForm = () => {
    const [dropdowns, setDropdowns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        source: '', browser: '', sex: '', age: 30, country_name: '',
        n_device_occur: 1, signup_month: 1, signup_day: 1, signup_day_name: '',
        purchase_month: 1, purchase_day: 1, purchase_day_name: '', purchase_over_time: 0.0
    });

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const data = await getEcommerceDropdowns();
                setDropdowns(data);
                setFormData(prev => ({
                    ...prev,
                    source: data.sources[0],
                    browser: data.browsers[0],
                    sex: data.sexs[0],
                    country_name: data.country_names[0],
                    signup_day_name: data.signup_day_names[0],
                    purchase_day_name: data.purchase_day_names[0]
                }));
                setLoading(false);
            } catch (err) {
                console.error('Fetch dropdowns error:', err);
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
            [name]: ['age', 'n_device_occur', 'signup_month', 'signup_day', 'purchase_month', 'purchase_day'].includes(name)
                ? parseInt(value) || 0
                : name === 'purchase_over_time'
                    ? parseFloat(value) || 0.0
                    : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPredicting(true);
        setError(null);
        setResult(null);
        try {
            const data = await predictEcommerce(formData);
            setResult(data);
        } catch (err) {
            console.error('Prediction error:', err);
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
                    width: '40px', height: '40px', border: '3px solid #FFE4CC',
                    borderTopColor: 'var(--fraud-accent)', borderRadius: '50%',
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

    const renderField = (label, name, type, helperText, options = {}) => (
        <div style={{ marginBottom: '4px' }}>
            <label className="premium-label">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="premium-input fraud-input"
                required
                {...options}
            />
            {helperText && <span className="premium-helper">{helperText}</span>}
        </div>
    );

    const renderSelect = (label, name, optionsList, helperText) => (
        <div style={{ marginBottom: '4px' }}>
            <label className="premium-label">{label}</label>
            <select name={name} value={formData[name]} onChange={handleChange} className="premium-select fraud-select">
                {optionsList.map(opt => {
                    const val = typeof opt === 'object' ? opt.value : opt;
                    const lab = typeof opt === 'object' ? opt.label : opt;
                    return <option key={val} value={val}>{lab}</option>;
                })}
            </select>
            {helperText && <span className="premium-helper">{helperText}</span>}
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ minHeight: '100%' }}>
            {/* Page background */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--fraud-bg)', zIndex: -1, pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '5px 14px', borderRadius: '100px',
                    background: 'rgba(232, 89, 12, 0.06)', border: '1px solid rgba(232, 89, 12, 0.12)',
                    marginBottom: '16px',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fraud-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fraud-accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        E-commerce Security
                    </span>
                </div>

                <h1 style={{
                    fontFamily: "'Poppins', 'Inter', sans-serif", fontSize: '2rem',
                    fontWeight: 800, color: '#1E293B', letterSpacing: '-0.03em', marginBottom: '8px',
                }}>
                    Fraud Detection
                </h1>
                <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6, maxWidth: '600px' }}>
                    Provide the transaction and user details below to evaluate the probability of fraudulent activity.
                </p>
            </div>

            {/* Form Card */}
            <div style={{
                background: 'white', borderRadius: '20px', border: '1px solid rgba(232, 89, 12, 0.08)',
                padding: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)',
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        {/* User Details */}
                        <div>
                            <h3 className="section-header fraud-section-header">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    User Details
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {renderField('User Age', 'age', 'number', 'Age of the user making the transaction', { min: 18, max: 100 })}
                                {renderSelect('Gender', 'sex', dropdowns.sexs)}
                                {renderSelect('Country', 'country_name', dropdowns.country_names, 'Country where the transaction originates')}
                                {renderSelect('Browser Used', 'browser', dropdowns.browsers, 'Browser used during the transaction')}
                            </div>
                        </div>

                        {/* Transaction Metrics */}
                        <div>
                            <h3 className="section-header fraud-section-header">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                                    </svg>
                                    Transaction Metrics
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {renderSelect('Traffic Source', 'source', dropdowns.sources, 'How the user arrived at the site')}
                                {renderField('Device Occurrences', 'n_device_occur', 'number', 'Number of times this device was used', { min: 1 })}
                                {renderField('Purchase Time Delay (Seconds)', 'purchase_over_time', 'number', 'Time elapsed between signup and purchase', { step: '0.01' })}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div style={{ marginTop: '32px' }}>
                        <h3 className="section-header fraud-section-header">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                Timeline
                            </span>
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {/* Signup Date */}
                            <div style={{
                                padding: '20px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #FFFBF5, #FFF8F0)',
                                border: '1px solid rgba(232, 89, 12, 0.08)',
                            }}>
                                <h4 style={{
                                    fontSize: '0.875rem', fontWeight: 700, color: 'var(--fraud-accent)',
                                    marginBottom: '14px', letterSpacing: '0.02em',
                                }}>
                                    📅 Signup Date
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {renderSelect('Month', 'signup_month', dropdowns.months)}
                                    {renderSelect('Day', 'signup_day', dropdowns.days.map(d => ({ value: d, label: `Day ${d}` })))}
                                    {renderSelect('Day of Week', 'signup_day_name', dropdowns.signup_day_names)}
                                </div>
                            </div>
                            {/* Purchase Date */}
                            <div style={{
                                padding: '20px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #FFFBF5, #FFF8F0)',
                                border: '1px solid rgba(232, 89, 12, 0.08)',
                            }}>
                                <h4 style={{
                                    fontSize: '0.875rem', fontWeight: 700, color: 'var(--fraud-accent)',
                                    marginBottom: '14px', letterSpacing: '0.02em',
                                }}>
                                    🛒 Purchase Date
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {renderSelect('Month', 'purchase_month', dropdowns.months)}
                                    {renderSelect('Day', 'purchase_day', dropdowns.days.map(d => ({ value: d, label: `Day ${d}` })))}
                                    {renderSelect('Day of Week', 'purchase_day_name', dropdowns.purchase_day_names)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '32px' }}>
                        <button
                            type="submit"
                            disabled={predicting}
                            className="premium-btn fraud-btn"
                            style={{ width: '100%' }}
                        >
                            {predicting ? (
                                <>
                                    <div style={{
                                        width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }} />
                                    Analyzing Risk...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Predict Fraud Risk
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
                        border: result.prediction === 1 ? '2px solid #FCA5A5' : '2px solid #86EFAC',
                        background: result.prediction === 1
                            ? 'linear-gradient(135deg, #FEF2F2, #FFF1F2)'
                            : 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
                    }}>
                        <div style={{ padding: '28px' }}>
                            <h3 style={{
                                fontFamily: "'Poppins', 'Inter', sans-serif",
                                fontSize: '1.25rem', fontWeight: 700,
                                color: '#1E293B', marginBottom: '20px', textAlign: 'center',
                            }}>
                                Prediction Result
                            </h3>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
                            }}>
                                {/* Status Badge */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 24px', borderRadius: '100px',
                                    background: result.prediction === 1 ? '#DC2626' : '#16A34A',
                                    color: 'white', fontWeight: 700, fontSize: '1.125rem',
                                    boxShadow: result.prediction === 1
                                        ? '0 4px 14px rgba(220, 38, 38, 0.3)'
                                        : '0 4px 14px rgba(22, 163, 74, 0.3)',
                                }}>
                                    {result.prediction === 1 ? '🚨 Fraudulent' : '✅ Legitimate'}
                                </div>

                                {/* Probabilities */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '400px',
                                }}>
                                    <div style={{
                                        textAlign: 'center', padding: '16px', borderRadius: '14px',
                                        background: 'rgba(220, 38, 38, 0.06)', border: '1px solid rgba(220, 38, 38, 0.1)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fraud Prob.</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>{result.fraud_prob}%</div>
                                    </div>
                                    <div style={{
                                        textAlign: 'center', padding: '16px', borderRadius: '14px',
                                        background: 'rgba(22, 163, 74, 0.06)', border: '1px solid rgba(22, 163, 74, 0.1)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legit Prob.</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>{result.legit_prob}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EcommerceForm;
