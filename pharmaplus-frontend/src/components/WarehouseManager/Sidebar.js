import React, { useState } from 'react';
import { 
  FiBox, 
  FiActivity, 
  FiAlertTriangle, 
  FiTruck, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiChevronLeft, 
  FiChevronRight, 
  FiAlertCircle 
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    // 1. LocalStorage se token, role aur user data remove karein
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // 2. Page reload karein taaki App.js wapas AuthForm (Login) dikha de
    window.location.reload();
  };

  return (
    <>
      <aside style={{ ...styles.sidebar, width: isCollapsed ? '80px' : '260px' }}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIcon}>
              <FiBox size={20} color="#fff" />
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <h1 style={styles.brandTitle}>PharmaPlus</h1>
                <p style={styles.brandSubtitle}>WMS · Hub</p>
              </div>
            )}
          </div>

          {!isCollapsed && <div style={styles.menuLabel}>MAIN MENU</div>}
          <nav style={styles.nav}>
            <button 
              onClick={() => setActiveTab('overview')} 
              style={activeTab === 'overview' ? styles.navItemActive : styles.navItem}
              title="Overview"
            >
              <FiActivity size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Overview</span>}
            </button>
            <button 
              onClick={() => setActiveTab('inventory')} 
              style={activeTab === 'inventory' ? styles.navItemActive : styles.navItem}
              title="Medicines & Inventory"
            >
              <FiBox size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Medicines & Inventory</span>}
            </button>
            <button 
              onClick={() => setActiveTab('alerts')} 
              style={activeTab === 'alerts' ? styles.navItemActive : styles.navItem}
              title="Stock Alerts"
            >
              <FiAlertTriangle size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Stock Alerts</span>}
            </button>
            <button 
              onClick={() => setActiveTab('shipments')} 
              style={activeTab === 'shipments' ? styles.navItemActive : styles.navItem}
              title="Shipments & Logistics"
            >
              <FiTruck size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Shipments & Logistics</span>}
            </button>
            <button 
              onClick={() => setActiveTab('workers')} 
              style={activeTab === 'workers' ? styles.navItemActive : styles.navItem}
              title="Warehouse Workers"
            >
              <FiUsers size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Warehouse Workers</span>}
            </button>
            <button 
              onClick={() => setActiveTab('suppliers')} 
              style={activeTab === 'suppliers' ? styles.navItemActive : styles.navItem}
              title="Suppliers & Settings"
            >
              <FiSettings size={18} style={styles.iconStyle} /> 
              {!isCollapsed && <span style={styles.navText}>Suppliers & Settings</span>}
            </button>
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <button 
            style={styles.collapseBtn} 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            {!isCollapsed && <span>Collapse</span>}
          </button>

          <button 
            style={styles.logoutBtn} 
            onClick={() => setShowLogoutModal(true)} 
            title="Logout"
          >
            <FiLogOut size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* CONFIRMATION MODAL POPUP */}
      {showLogoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalIconBox}>
              <FiAlertCircle size={28} color="#dc2626" />
            </div>
            <h3 style={styles.modalTitle}>Are you sure you want to logout?</h3>
            <p style={styles.modalDesc}>You will be safely signed out of the dashboard and redirected to the login form.</p>
            
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelBtn} 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmLogoutBtn} 
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  sidebar: { 
    height: '100vh', 
    backgroundColor: '#ffffff', 
    borderRight: '1px solid #e2e8f0', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    padding: '16px 10px', 
    boxSizing: 'border-box',
    position: 'sticky', 
    top: 0, 
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    overflowY: 'auto', 
    zIndex: 10
  },
  sidebarTop: { display: 'flex', flexDirection: 'column' },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' },
  logoIcon: { backgroundColor: '#2563eb', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0, whiteSpace: 'nowrap' },
  brandSubtitle: { fontSize: '11px', color: '#64748b', margin: 0, fontWeight: '500', whiteSpace: 'nowrap' },
  menuLabel: { fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', borderRadius: '8px', color: '#64748b', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '13px', fontWeight: '600', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' },
  iconStyle: { flexShrink: 0 },
  navText: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sidebarFooter: { paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto' },
  collapseBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' },
  logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '9px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    border: '1px solid #fee2e2'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  modalDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmLogoutBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Sidebar;