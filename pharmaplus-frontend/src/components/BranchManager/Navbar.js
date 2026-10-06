import React, { useState } from 'react';
import { FiSearch, FiBell, FiCalendar, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header style={styles.header}>
      {/* Left: Branch Info */}
      <div style={styles.branchInfo}>
        <span style={styles.greenDot}></span>
        <span style={styles.branchTitle}>Branch #402</span>
        <span style={styles.dotSeparator}>·</span>
        <span style={styles.branchSub}>Regional Medical Hub</span>
      </div>

      {/* Center: Search Box */}
      <div style={styles.searchBox}>
        <FiSearch size={16} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search staff, medicines, orders..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Right: Date, Notification & Profile */}
      <div style={styles.headerRight}>
        <div style={styles.dateBox}>
          <FiCalendar size={14} color="#64748b" />
          <span style={styles.dateText}>Sep 8, 2026</span>
        </div>

        <div style={styles.iconButton}>
          <FiBell size={18} color="#475569" />
          <span style={styles.badge}>4</span>
        </div>

        <div style={styles.managerProfile}>
          <div style={styles.avatar}>RM</div>
          <div style={styles.profileMeta}>
            <p style={styles.managerName}>Rania Malik</p>
            <p style={styles.managerRole}>Branch Manager</p>
          </div>
          <FiChevronDown size={14} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: { 
    padding: '12px 24px', 
    backgroundColor: '#ffffff', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    fontFamily: 'sans-serif'
  },
  branchInfo: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px' 
  },
  greenDot: { 
    width: '8px', 
    height: '8px', 
    backgroundColor: '#10b981', 
    borderRadius: '50%' 
  },
  branchTitle: { 
    fontSize: '14px', 
    fontWeight: '800', 
    color: '#0f172a' 
  },
  dotSeparator: { 
    color: '#cbd5e1', 
    fontWeight: '700' 
  },
  branchSub: { 
    fontSize: '13px', 
    color: '#64748b', 
    fontWeight: '500' 
  },
  searchBox: { 
    display: 'flex', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    border: '1px solid #e2e8f0',
    padding: '8px 14px', 
    borderRadius: '10px', 
    gap: '10px', 
    width: '320px' 
  },
  searchInput: { 
    border: 'none', 
    backgroundColor: 'transparent', 
    outline: 'none', 
    fontSize: '13px', 
    width: '100%', 
    color: '#0f172a' 
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px' 
  },
  dateBox: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    padding: '8px 12px', 
    backgroundColor: '#f8fafc', 
    border: '1px solid #e2e8f0',
    borderRadius: '10px', 
    fontSize: '12px', 
    color: '#475569',
    fontWeight: '600'
  },
  iconButton: { 
    position: 'relative',
    padding: '10px', 
    backgroundColor: '#f8fafc', 
    border: '1px solid #e2e8f0',
    borderRadius: '10px', 
    cursor: 'pointer', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '1px 5px',
    borderRadius: '10px'
  },
  managerProfile: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '6px 12px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  avatar: { 
    width: '32px', 
    height: '32px', 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
    color: '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '11px', 
    fontWeight: '700' 
  },
  profileMeta: {
    display: 'flex',
    flexDirection: 'column'
  },
  managerName: { 
    fontSize: '13px', 
    fontWeight: '700', 
    color: '#0f172a', 
    margin: 0,
    lineHeight: '1.2'
  },
  managerRole: { 
    fontSize: '11px', 
    color: '#94a3b8', 
    margin: 0,
    fontWeight: '500'
  }
};

export default Navbar;