import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';

const SystemSettings = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('General');

  // Custom Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLogoutAction, setIsLogoutAction] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    organizationName: 'PharmaPlus Healthcare Network',
    adminEmail: 'admin@pharmaplus.com',
    supportContact: '+92 51 1234567',
    defaultTimezone: 'Asia/Karachi (PKT UTC+5)',
    language: 'English (Pakistan)'
  });

  const navItems = [
    'General',
    'Network',
    'Security',
    'API Configuration',
    'Notifications',
    'Database Backup',
    'Email',
    'Integrations',
    'System Preferences'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setModalMessage('Settings saved successfully!');
    setIsLogoutAction(false);
    setIsModalOpen(true);
  };

  const handleDiscard = () => {
    setFormData({
      organizationName: 'PharmaPlus Healthcare Network',
      adminEmail: 'admin@pharmaplus.com',
      supportContact: '+92 51 1234567',
      defaultTimezone: 'Asia/Karachi (PKT UTC+5)',
      language: 'English (Pakistan)'
    });
  };

  const triggerLogoutConfirm = () => {
    setModalMessage('Kya aap waqai logout karna chahte hain?');
    setIsLogoutAction(true);
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (isLogoutAction) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>System Settings</h1>
        <p style={styles.pageSubtitle}>
          Configure global system parameters, integrations, and preferences.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div style={styles.layoutGrid}>
        {/* Left Side Navigation Card */}
        <div style={styles.sidebarCard}>
          <div style={styles.navLinksWrapper}>
            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  style={{
                    ...styles.navButton,
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#475569',
                    fontWeight: isActive ? '600' : '400'
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Logout Button inside Sidebar */}
          <div style={styles.logoutWrapper}>
            <button onClick={triggerLogoutConfirm} style={styles.logoutBtn}>
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Right Side Content Card */}
        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>{activeTab} Settings</h2>

          {activeTab === 'General' ? (
            <form onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Admin Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Support Contact</label>
                <input
                  type="text"
                  name="supportContact"
                  value={formData.supportContact}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Default Timezone</label>
                <input
                  type="text"
                  name="defaultTimezone"
                  value={formData.defaultTimezone}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              {/* Action Buttons */}
              <div style={styles.buttonRow}>
                <button type="submit" style={styles.saveBtn}>
                  Save Changes
                </button>
                <button type="button" onClick={handleDiscard} style={styles.discardBtn}>
                  Discard
                </button>
              </div>
            </form>
          ) : (
            <div style={{ color: '#64748b', fontSize: '14px', paddingTop: '10px' }}>
              Configure {activeTab} settings here.
            </div>
          )}
        </div>
      </div>

      {/* Custom Popup Modal Box */}
      {isModalOpen && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupCard}>
            <p style={styles.popupText}>{modalMessage}</p>
            <div style={styles.popupBtnRow}>
              {isLogoutAction && (
                <button 
                  style={styles.popupCancelBtn} 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              )}
              <button 
                style={styles.popupConfirmBtn} 
                onClick={handleModalConfirm}
              >
                {isLogoutAction ? 'Logout' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  sidebarCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '480px'
  },
  navLinksWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  navButton: {
    border: 'none',
    textAlign: 'left',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.15s ease'
  },
  logoutWrapper: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '8px',
    marginTop: '12px'
  },
  logoutBtn: {
    border: 'none',
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    textAlign: 'left',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '28px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 24px 0'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '28px'
  },
  saveBtn: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    padding: '9px 20px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  discardBtn: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    padding: '9px 20px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  popupCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    width: '320px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  popupText: {
    fontSize: '14px',
    color: '#1e293b',
    marginBottom: '20px',
    fontWeight: '500'
  },
  popupBtnRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  popupConfirmBtn: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  popupCancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default SystemSettings;