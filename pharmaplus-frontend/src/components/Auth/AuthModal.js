import React, { useState } from 'react';

const AuthModal = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    setLoading(true);

    // Endpoint Fix: Removed /auth/ to align with the direct routes (/login and /signup)
  // Sahi Endpoint (Bina extra /auth/ ke)
   const endpoint = isLogin
     ? 'https://pharmaplus-production-7fa8.up.railway.app/api/v1/auth/login'
     : 'https://pharmaplus-production-7fa8.up.railway.app/api/v1/auth/signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        const token = data.token || data.data?.token;
        localStorage.setItem('token', token);
        if (data.user?.role) {
          localStorage.setItem('role', data.user.role);
        }
        setMessage({ text: '🎉 Login Successful!', isError: false });
        if (onLogin) {
          onLogin(token);
        }
      } else {
        // Handle success message returned by backend for staff vs customer registrations
        setMessage({ text: data.message || '✅ Account created successfully! Please Sign In.', isError: false });
        setIsLogin(true);
      }
    } catch (err) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.containerCard}>
        
        {/* Left Side: Feature Banner Panel */}
        <div style={styles.leftBanner}>
          <div style={styles.brandHeader}>
            <span style={styles.brandIcon}>✚</span>
            <div>
              <h2 style={styles.brandName}>PharmaPlus</h2>
              <span style={styles.brandTag}>Enterprise ERP System</span>
            </div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Complete Pharmacy Management Suite</h1>
            <p style={styles.heroDesc}>
              Streamline inventory, track batches by expiry, manage multi-branch operations — all in one platform.
            </p>

            <ul style={styles.featureList}>
              <li>✓ FEFO Inventory Management</li>
              <li>✓ Real-time Batch Tracking</li>
              <li>✓ Multi-role Access Control</li>
              <li>✓ Warehouse Stock Operations</li>
              <li>✓ System Audit Trail</li>
            </ul>
          </div>

          <div style={styles.footerNote}>
            ⚡ System online — All services operational
          </div>
        </div>

        {/* Right Side: Auth Form (Sign In / Sign Up) */}
        <div style={styles.rightFormArea}>
          
          <div style={styles.tabContainer}>
            <button
              type="button"
              style={isLogin ? styles.activeTab : styles.inactiveTab}
              onClick={() => { setIsLogin(true); setMessage({ text: '', isError: false }); }}
            >
              Sign In
            </button>
            <button
              type="button"
              style={!isLogin ? styles.activeTab : styles.inactiveTab}
              onClick={() => { setIsLogin(false); setMessage({ text: '', isError: false }); }}
            >
              Create Account
            </button>
          </div>

          <div style={styles.formHeader}>
            <h2 style={styles.welcomeTitle}>
              {isLogin ? 'Welcome back' : 'Get started with PharmaPlus'}
            </h2>
            <p style={styles.welcomeSubtitle}>
              {isLogin ? 'Sign in to your account to continue' : 'Enter your details to create an account'}
            </p>
          </div>

          {message.text && (
            <div style={{ ...styles.alert, ...(message.isError ? styles.alertError : styles.alertSuccess) }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={styles.formGroup}>
                <label style={styles.label}>FULL NAME</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Dr. Sarah Mitchell"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                placeholder="sarah@pharmaplus.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={styles.label}>PASSWORD</label>
                {isLogin && <a href="#forgot" style={styles.forgotLink}>Forgot password?</a>}
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {!isLogin && (
              <div style={styles.formGroup}>
                <label style={styles.label}>ROLE</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="CUSTOMER">Customer / Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            )}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In to PharmaPlus' : 'Create Account')}
            </button>
          </form>

          <div style={styles.demoBox}>
            <strong>Demo Credentials:</strong><br />
            Email: demo@pharmaplus.com · Password: demo1234
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF1F5',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  containerCard: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#FFF',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    minHeight: '560px',
  },
  leftBanner: {
    background: 'linear-gradient(135deg, #0F4C81 0%, #1E6091 100%)',
    color: '#FFF',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandIcon: {
    backgroundColor: '#319795',
    color: '#FFF',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  brandName: { margin: 0, fontSize: '1.4rem', color: '#FFF' },
  brandTag: { fontSize: '0.75rem', color: '#BEE3F8' },
  heroContent: { margin: '30px 0' },
  heroTitle: { fontSize: '1.8rem', lineHeight: '1.3', marginBottom: '15px' },
  heroDesc: { fontSize: '0.9rem', color: '#D0E1F9', lineHeight: '1.5', marginBottom: '20px' },
  featureList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' },
  footerNote: { fontSize: '0.75rem', color: '#BEE3F8', opacity: 0.8 },

  rightFormArea: { padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tabContainer: { display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '25px' },
  activeTab: { flex: 1, padding: '10px', border: 'none', borderBottom: '2px solid #0F4C81', background: 'none', fontWeight: 'bold', color: '#0F4C81', cursor: 'pointer' },
  inactiveTab: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#A0AEC0', cursor: 'pointer' },
  formHeader: { marginBottom: '20px' },
  welcomeTitle: { margin: '0 0 5px 0', fontSize: '1.3rem', color: '#2D3748' },
  welcomeSubtitle: { margin: 0, fontSize: '0.85rem', color: '#718096' },
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.7rem', fontWeight: 'bold', color: '#4A5568', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' },
  forgotLink: { fontSize: '0.75rem', color: '#3182CE', textDecoration: 'none' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#319795', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', marginTop: '10px' },
  demoBox: { marginTop: '20px', padding: '10px 12px', backgroundColor: '#EBF8FF', borderRadius: '6px', fontSize: '0.78rem', color: '#2B6CB0' },
  alert: { padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' },
  alertSuccess: { backgroundColor: '#C6F6D5', color: '#22543D' },
  alertError: { backgroundColor: '#FED7D7', color: '#9B2C2C' },
};

export default AuthModal;