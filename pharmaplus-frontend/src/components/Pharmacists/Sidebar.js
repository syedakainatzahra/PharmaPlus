import React from 'react';
import { FiFileText, FiPackage, FiAlertCircle, FiGrid, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside style={styles.sidebar}>
      <div>
        {/* Brand / Logo */}
        <div style={styles.brandBox}>
          <div style={styles.logoIcon}>➕</div>
          <div>
            <h2 style={styles.brandTitle}>PharmaPlus</h2>
            <span style={styles.brandSubtitle}>Pharmacist Portal</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={styles.navMenu}>
          <button 
            style={{ ...styles.navBtn, ...(activeTab === 'prescriptions' ? styles.activeBtn : {}) }}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FiFileText size={18} /> Prescription Queue
          </button>

          <button 
            style={{ ...styles.navBtn, ...(activeTab === 'dispensing' ? styles.activeBtn : {}) }}
            onClick={() => setActiveTab('dispensing')}
          >
            <FiPackage size={18} /> Order Dispensing & Fulfillment
          </button>

          <button 
            style={{ ...styles.navBtn, ...(activeTab === 'inventory' ? styles.activeBtn : {}) }}
            onClick={() => setActiveTab('inventory')}
          >
            <FiAlertCircle size={18} /> Low Stock & Inventory Alerts
          </button>

          <button 
            style={{ ...styles.navBtn, ...(activeTab === 'medicines' ? styles.activeBtn : {}) }}
            onClick={() => setActiveTab('medicines')}
          >
            <FiGrid size={18} /> Medicine Management
          </button>
        </nav>
      </div>

      {/* Sidebar Footer (Profile & Logout) */}
      <div style={styles.sidebarFooter}>
        <div style={styles.pharmacistInfo}>
          <div style={styles.avatar}>Dr</div>
          <div>
            <p style={styles.docName}>Dr. Sarah Johnson</p>
            <p style={styles.docRole}>Staff Pharmacist</p>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    boxSizing: 'border-box',
  },
  brandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#2563eb',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  brandSubtitle: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.2s',
  },
  activeBtn: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontWeight: '700',
  },
  sidebarFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  pharmacistInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  docName: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
  },
  docRole: {
    margin: 0,
    fontSize: '11px',
    color: '#64748b',
  },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default Sidebar;