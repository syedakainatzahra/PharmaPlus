import React, { useState } from 'react';
import { 
  FiGrid, FiUsers, FiUserCheck, FiShoppingBag, 
  FiBox, FiSettings, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside style={{ ...styles.sidebar, width: isCollapsed ? '80px' : '260px' }}>
      {/* Brand Header */}
      <div style={{ ...styles.brandContainer, justifyContent: isCollapsed ? 'center' : 'space-between' }}>
        {!isCollapsed && (
          <div style={styles.brandLeft}>
            <div style={styles.logoBox}>
              <FiGrid size={18} color="#fff" />
            </div>
            <div>
              <h2 style={styles.brandTitle}>PharmaPlus</h2>
              <span style={styles.brandSub}>MEDICAL SYSTEM</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div style={styles.logoBox}>
            <FiGrid size={18} color="#fff" />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          style={styles.collapseBtn}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={16} color="#94a3b8" /> : <FiChevronLeft size={16} color="#94a3b8" />}
        </button>
      </div>

      {/* Navigation Section */}
      <div style={styles.navSection}>
        {!isCollapsed && <span style={styles.navLabel}>NAVIGATION</span>}
        <nav style={styles.navMenu}>
          <button 
            style={{ ...styles.navItem, ...(activeTab === 'overview' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('overview')}
            title="Overview"
          >
            <FiGrid size={18} />
            {!isCollapsed && <span>Overview</span>}
          </button>

          <button 
            style={{ ...styles.navItem, ...(activeTab === 'patientQueue' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('patientQueue')}
            title="Patient Queue"
          >
            <FiUsers size={18} />
            {!isCollapsed && <span>Patient Queue</span>}
          </button>

          <button 
            style={{ ...styles.navItem, ...(activeTab === 'appointments' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('appointments')}
            title="Appointments"
          >
            <FiUserCheck size={18} />
            {!isCollapsed && <span>Appointments</span>}
          </button>

          <button 
            style={{ ...styles.navItem, ...(activeTab === 'customers' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('customers')}
            title="Patient Directory"
          >
            <FiShoppingBag size={18} />
            {!isCollapsed && <span>Patient Directory</span>}
          </button>

          <button 
            style={{ ...styles.navItem, ...(activeTab === 'inventory' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('inventory')}
            title="Billing & Counter"
          >
            <FiBox size={18} />
            {!isCollapsed && <span>Billing &amp; Counter</span>}
          </button>

          <button 
            style={{ ...styles.navItem, ...(activeTab === 'settings' ? styles.navItemActive : {}), justifyContent: isCollapsed ? 'center' : 'flex-start' }} 
            onClick={() => setActiveTab('settings')}
            title="Settings"
          >
            <FiSettings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div style={styles.bottomSection}>
        {!isCollapsed ? (
          <div style={styles.profileCard}>
            <div style={styles.avatar}>SR</div>
            <div style={styles.profileMeta}>
              <p style={styles.profileName}>Sara Raza</p>
              <p style={styles.profileRole}>Morning Shift</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }} title="Sara Raza (Morning Shift)">
            <div style={styles.avatar}>SR</div>
          </div>
        )}
      </div>
    </aside>
  );
};

const styles = {
  sidebar: { backgroundColor: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', height: '100vh', justifyContent: 'space-between', fontFamily: 'sans-serif', flexShrink: 0, transition: 'width 0.3s ease' },
  brandContainer: { padding: '20px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' },
  brandLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoBox: { width: '36px', height: '36px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandTitle: { fontSize: '15px', fontWeight: '800', margin: 0, color: '#0f172a', lineHeight: '1.2' },
  brandSub: { fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' },
  collapseBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navSection: { padding: '16px 12px', flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  navLabel: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', paddingLeft: '8px', letterSpacing: '0.05em' },
  navMenu: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', transition: '0.2s' },
  navItemActive: { backgroundColor: '#eff6ff', color: '#2563eb' },
  bottomSection: { padding: '16px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#ffffff' },
  profileCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  profileMeta: { display: 'flex', flexDirection: 'column' },
  profileName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: '1.2' },
  profileRole: { fontSize: '11px', color: '#94a3b8', margin: 0, fontWeight: '500' }
};

export default Sidebar;