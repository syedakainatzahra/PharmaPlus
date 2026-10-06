import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Navbar = ({ title, subtitle, searchQuery, setSearchQuery }) => {
  return (
    <header style={styles.header}>
      <div>
        <h2 style={styles.headerTitle}>{title}</h2>
        <p style={styles.headerSub}>{subtitle}</p>
      </div>

      <div style={styles.headerRight}>
        <div style={styles.searchWrapper}>
          <FiSearch size={14} color="#94a3b8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search medicines, workers, shipments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.topSearchInput}
          />
        </div>
        <div style={styles.bellIconBox}>
          <FiBell size={16} color="#475569" />
        </div>
        <div style={styles.userProfile}>
          <div style={styles.userAvatar}>RA</div>
          <div>
            <p style={styles.userName}>Ravi Anand</p>
            <p style={styles.userRole}>Warehouse Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  headerTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
  headerSub: { fontSize: '12px', color: '#64748b', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' },
  searchWrapper: { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', width: '280px' },
  topSearchInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', width: '100%', color: '#0f172a' },
  bellIconBox: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' },
  userAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  userName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  userRole: { fontSize: '11px', color: '#64748b', margin: 0 }
};

export default Navbar;