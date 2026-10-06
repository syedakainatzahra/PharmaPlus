import React, { useState } from 'react';
import { 
  FiHome, 
  FiBarChart2, 
  FiShoppingBag, 
  FiUsers, 
  FiCheckSquare, 
  FiDollarSign, 
  FiSettings, 
  FiShield, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronDown 
} from 'react-icons/fi';
import logoImage from "../../assets/pharma-plus-logo.png"; // Pharma Plus Logo

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const [isHovered, setIsHovered] = useState(false);

  const menuSections = [
    {
      category: 'OVERVIEW',
      items: [
        { id: 'Overview', label: 'Dashboard', icon: <FiHome size={18} />, hasSub: false }
      ]
    },
    {
      category: 'ANALYTICS & OVERVIEW',
      items: [
        { id: 'Analytics', label: 'Analytics', icon: <FiBarChart2 size={18} />, hasSub: true }
      ]
    },
    {
      category: 'BRANCH MANAGEMENT',
      items: [
        { id: 'Branches', label: 'Branches', icon: <FiShoppingBag size={18} />, hasSub: true }
      ]
    },
    {
      category: 'USER & STAFF MANAGEMENT',
      items: [
        { id: 'Users', label: 'Users & Staff', icon: <FiUsers size={18} />, hasSub: true }
      ]
    },
    {
      category: 'AUDIT & SECURITY',
      items: [
        { id: 'AuditLogs', label: 'Audit Logs', icon: <FiCheckSquare size={18} />, hasSub: true }
      ]
    },
    {
      category: 'BILLING & SUBSCRIPTIONS',
      items: [
        { id: 'Billing', label: 'Billing', icon: <FiDollarSign size={18} />, hasSub: true }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { id: 'Settings', label: 'Settings', icon: <FiSettings size={18} />, hasSub: true },
        { id: 'Roles', label: 'Roles & Permissions', icon: <FiShield size={18} />, hasSub: false }
      ]
    }
  ];

  return (
    <aside 
      style={{ ...styles.sidebarContainer, width: isCollapsed ? '80px' : '260px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header with Logo & ChatGPT-style Hover Toggle Button */}
      <div style={styles.topHeader}>
        {!isCollapsed ? (
          <div style={styles.logoContainer}>
            <img src={logoImage} alt="Pharma Plus Logo" style={styles.logoImg} />
            <div style={styles.logoTextWrapper}>
              <span style={styles.logoTitle}>Pharma Plus</span>
              <span style={styles.logoSubtitle}>Healthcare & Pharmacy</span>
            </div>
          </div>
        ) : (
          <div style={styles.collapsedLogoWrapper}>
            <img src={logoImage} alt="Pharma Plus" style={styles.collapsedLogoImg} />
          </div>
        )}

        {/* Toggle Button: Appears on hover when collapsed, or normal when expanded */}
        {(!isCollapsed || isHovered) && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              ...styles.collapseBtn,
              position: isCollapsed ? 'absolute' : 'relative',
              right: isCollapsed ? '8px' : 'auto'
            }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Menu Categories List */}
      <div style={styles.menuWrapper}>
        {menuSections.map((sec, idx) => (
          <div key={idx} style={styles.sectionContainer}>
            {!isCollapsed && <div style={styles.categoryTitle}>{sec.category}</div>}
            
            {sec.items.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    ...styles.navBtn,
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#1e3a8a' : '#475569',
                    borderLeft: isSelected ? '4px solid #1e3a8a' : '4px solid transparent',
                    justifyContent: isCollapsed ? 'center' : 'space-between'
                  }}
                  title={isCollapsed ? item.label : ''}
                >
                  <div style={styles.btnLeft}>
                    <span style={{ display: 'flex', alignItems: 'center', color: isSelected ? '#1e3a8a' : '#64748b' }}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span style={{ fontWeight: isSelected ? '600' : '500', fontSize: '14px' }}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && item.hasSub && (
                    <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                      <FiChevronDown size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom System Status Widget */}
      {!isCollapsed && (
        <div style={styles.statusBox}>
          <div style={styles.statusTitle}>
            <span style={styles.greenDot}>●</span> System Status
          </div>
          <div style={styles.statusSubtitle}>All systems operational</div>
          <div style={styles.uptimeText}>Uptime 99.98%</div>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebarContainer: {
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,          // Updated: Extended to the very top
    height: '100vh', // Updated: Full screen height
    left: 0,
    zIndex: 90,
    transition: 'width 0.2s ease-in-out',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  topHeader: {
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid #f1f5f9',
    position: 'relative'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden'
  },
  logoImg: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  collapsedLogoWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  collapsedLogoImg: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  logoTextWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  logoSubtitle: {
    fontSize: '10px',
    color: '#64748b'
  },
  collapseBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  menuWrapper: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 0'
  },
  sectionContainer: {
    marginBottom: '16px'
  },
  categoryTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.06em',
    padding: '4px 20px',
    marginBottom: '4px'
  },
  navBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '9px 16px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusBox: {
    margin: '16px',
    padding: '12px 14px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px'
  },
  statusTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#166534',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  greenDot: {
    color: '#22c55e',
    fontSize: '10px'
  },
  statusSubtitle: {
    fontSize: '12px',
    color: '#15803d',
    marginTop: '2px',
    fontWeight: '500'
  },
  uptimeText: {
    fontSize: '11px',
    color: '#16a34a',
    marginTop: '2px',
    fontWeight: '600'
  }
};

export default Sidebar;