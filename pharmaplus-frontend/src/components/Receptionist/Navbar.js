import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Navbar = ({ pageTitle, subtitle }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      setCurrentTime(formattedTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.navbar}>
      <div style={styles.titleContainer}>
        <h1 style={styles.pageTitle}>{pageTitle || 'Overview'}</h1>
        <p style={styles.pageSub}>{subtitle || 'Tue, 09 Sep 2026 · Morning Shift'}</p>
      </div>

      <div style={styles.headerRight}>
        <div style={styles.searchBox}>
          <FiSearch size={14} color="#64748b" />
          <input type="text" placeholder="Search patient, token..." style={styles.searchInput} />
        </div>
        <button style={styles.iconBtn} title="Notifications">
          <FiBell size={16} color="#64748b" />
        </button>
        <div style={styles.timeBadge}>{currentTime || '04:24:30 pm'}</div>
      </div>
    </header>
  );
};

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' },
  titleContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', gap: '8px', width: '240px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '12px', width: '100%', color: '#0f172a', backgroundColor: 'transparent' },
  iconBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  timeBadge: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', fontWeight: '600', color: '#0f172a' }
};

export default Navbar;