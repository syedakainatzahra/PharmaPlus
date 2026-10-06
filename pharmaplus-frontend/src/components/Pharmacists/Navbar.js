import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Navbar = ({ activeTab }) => {
  // Dynamic header titles based on active tab
  const getTitle = () => {
    switch (activeTab) {
      case 'prescriptions':
        return { title: 'Prescription Queue', subtitle: 'Review and approve patient prescriptions' };
      case 'dispensing':
        return { title: 'Order Dispensing & Fulfillment', subtitle: 'Manage and pack customer medication orders' };
      case 'inventory':
        return { title: 'Low Stock & Inventory Alerts', subtitle: 'Monitor medicine stock levels and expiry warnings' };
      case 'medicines':
        return { title: 'Medicine Management', subtitle: 'Add, update, or view available store medicines' };
      default:
        return { title: 'Pharmacist Portal', subtitle: 'Welcome back' };
    }
  };

  const pageHeader = getTitle();

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>{pageHeader.title}</h1>
        <p style={styles.pageSubtitle}>{pageHeader.subtitle}</p>
      </div>

      <div style={styles.headerRight}>
        {/* Search Bar */}
        <div style={styles.searchBox}>
          <FiSearch size={16} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search patient or order ID..." 
            style={styles.searchInput} 
          />
        </div>

        {/* Notifications Icon */}
        <button style={styles.iconBtn} title="Notifications">
          <FiBell size={18} color="#475569" />
          <span style={styles.badge}>3</span>
        </button>

        {/* User Mini Avatar */}
        <div style={styles.miniAvatar}>SJ</div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#ffffff',
    padding: '20px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  pageSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontWeight: '500',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f1f5f9',
    padding: '8px 14px',
    borderRadius: '20px',
    width: '260px',
    border: '1px solid #e2e8f0',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    width: '100%',
    color: '#0f172a',
  },
  iconBtn: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    position: 'relative',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '9px',
    fontWeight: '700',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatar: {
    width: '38px',
    height: '38px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    border: '1px solid #bfdbfe',
  },
};

export default Navbar;