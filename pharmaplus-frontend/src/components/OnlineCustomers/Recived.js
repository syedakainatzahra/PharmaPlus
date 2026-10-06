import React from 'react';

const Recived = () => {
  return (
    <div style={styles.tabContentCard}>
      <h2 style={styles.tabTitle}>Received Orders History</h2>
      <p style={styles.tabSubtitle}>View your past successfully delivered orders and receipts.</p>
      <div style={styles.orderListItem}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a' }}>Order #PP-98214</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Paracetamol, Multivitamins (Total: Rs. 470)</p>
        </div>
        <span style={styles.deliveredBadge}>Delivered</span>
      </div>
    </div>
  );
};

const styles = {
  tabContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    minHeight: '60vh',
  },
  tabTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  tabSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 24px 0',
  },
  orderListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  deliveredBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
};

export default Recived;