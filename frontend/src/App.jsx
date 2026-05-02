import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EcommerceForm from './pages/EcommerceForm';
import ChurnForm from './pages/ChurnForm';
import Dashboard from './pages/Dashboard';
import './index.css';

const NavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: isActive ? '#6366F1' : '#64748B',
        background: isActive ? '#EEF2FF' : 'transparent',
        transition: 'all 0.25s ease',
        textDecoration: 'none',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = '#F1F5F9';
          e.currentTarget.style.color = '#334155';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748B';
        }
      }}
    >
      {icon}
      {children}
    </Link>
  );
};

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const NexusLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="12" fill="url(#logo-grad)" />
    <path d="M12 28V12L20 24L28 12V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="20" cy="16" r="3" fill="white" fillOpacity="0.9" />
  </svg>
);

function AppContent() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease',
          }}>
            <NexusLogo />
            <div>
              <span style={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                FraudChurn Nexus
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.65rem',
                fontWeight: 500,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '-2px',
              }}>
                ML Intelligence Platform
              </span>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <NavLink to="/ecommerce" icon={<ShieldIcon />}>Fraud Detection</NavLink>
            <NavLink to="/churn" icon={<TrendingIcon />}>Churn Prediction</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '32px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ecommerce" element={<EcommerceForm />} />
          <Route path="/churn" element={<ChurnForm />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #E2E8F0',
        padding: '24px',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Developer Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.813rem', color: '#64748B', fontWeight: 500 }}>
              Developed by
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
              Md. Emon Hasan
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Email */}
              <a href="mailto:emon.mlengineer@gmail.com" title="Email" style={{
                color: '#64748B', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com/Md-Emon-Hasan" target="_blank" rel="noopener noreferrer" title="GitHub" style={{
                color: '#64748B', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#333'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/md-emon-hasan" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{
                color: '#64748B', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#0077B5'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/mdemon.hasan2001/" target="_blank" rel="noopener noreferrer" title="Facebook" style={{
                color: '#64748B', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#1877F2'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/8801834363533" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{
                color: '#64748B', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#25D366'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            © {new Date().getFullYear()} FraudChurn Nexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
