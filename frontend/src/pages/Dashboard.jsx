import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '20px' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto 56px',
      }}>
        {/* Decorative badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: 'linear-gradient(135deg, #EEF2FF, #F0F9FF)',
          border: '1px solid #E0E7FF',
          marginBottom: '24px',
          animation: 'fadeIn 0.5s ease-out forwards',
        }}>
          <span style={{ fontSize: '0.75rem' }}>✨</span>
          <span style={{
            fontSize: '0.813rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Powered by Machine Learning
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontSize: '3.25rem',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #0F172A 0%, #334155 50%, #6366F1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          FraudChurn Nexus
        </h1>

        <p style={{
          fontSize: '1.125rem',
          lineHeight: 1.7,
          color: '#64748B',
          fontWeight: 400,
          maxWidth: '560px',
          margin: '0 auto',
        }}>
          A production-grade intelligent platform that unifies <strong style={{ color: '#334155', fontWeight: 600 }}>fraud detection</strong> and <strong style={{ color: '#334155', fontWeight: 600 }}>churn prediction</strong> models into one seamless experience.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '28px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Fraud Detection Card */}
        <div style={{
          background: 'var(--fraud-card-bg)',
          borderRadius: '24px',
          border: '1px solid rgba(232, 89, 12, 0.1)',
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default',
          animation: 'slideUp 0.6s ease-out forwards',
          animationDelay: '0.1s',
          opacity: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(232, 89, 12, 0.12), 0 8px 24px rgba(0,0,0,0.04)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--fraud-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(232, 89, 12, 0.2)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" /><path d="M12 16h.01" />
            </svg>
          </div>

          {/* Label */}
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '8px',
            background: 'rgba(232, 89, 12, 0.06)',
            marginBottom: '14px',
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--fraud-accent)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              E-commerce Security
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1E293B',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}>
            E-commerce Fraud Detection
          </h2>

          <p style={{
            fontSize: '0.938rem',
            lineHeight: 1.6,
            color: '#64748B',
            marginBottom: '28px',
          }}>
            Analyze transaction details and user behavior patterns to accurately identify and prevent fraudulent e-commerce activities in real-time.
          </p>

          <Link to="/ecommerce" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'var(--fraud-gradient)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.938rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(232, 89, 12, 0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(232, 89, 12, 0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(232, 89, 12, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Try Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Churn Prediction Card */}
        <div style={{
          background: 'var(--churn-card-bg)',
          borderRadius: '24px',
          border: '1px solid rgba(8, 145, 178, 0.1)',
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default',
          animation: 'slideUp 0.6s ease-out forwards',
          animationDelay: '0.25s',
          opacity: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(8, 145, 178, 0.12), 0 8px 24px rgba(0,0,0,0.04)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--churn-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(8, 145, 178, 0.2)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>

          {/* Label */}
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '8px',
            background: 'rgba(8, 145, 178, 0.06)',
            marginBottom: '14px',
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--churn-accent)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Telecom Analytics
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1E293B',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}>
            Telecom Customer Churn Prediction
          </h2>

          <p style={{
            fontSize: '0.938rem',
            lineHeight: 1.6,
            color: '#64748B',
            marginBottom: '28px',
          }}>
            Predict customer retention risks by analyzing demographic, usage, billing patterns, and service subscriptions to proactively reduce churn.
          </p>

          <Link to="/churn" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'var(--churn-gradient)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.938rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(8, 145, 178, 0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(8, 145, 178, 0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(8, 145, 178, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Try Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats/Features Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        maxWidth: '900px',
        margin: '48px auto 0',
        animation: 'fadeIn 0.7s ease-out forwards',
        animationDelay: '0.4s',
        opacity: 0,
      }}>
        {[
          { icon: '⚡', label: 'Real-time', desc: 'Instant Predictions' },
          { icon: '🔒', label: 'Secure', desc: 'Enterprise-grade API' },
          { icon: '📊', label: 'Logged', desc: 'Full Audit Trail' },
        ].map((item, i) => (
          <div key={i} style={{
            textAlign: 'center',
            padding: '24px 16px',
            borderRadius: '16px',
            background: 'white',
            border: '1px solid #F1F5F9',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#F1F5F9';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontSize: '0.938rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '0.813rem', color: '#94A3B8' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
