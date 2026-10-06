import React, { useState } from 'react';
import { FiPackage, FiCheck,  FiTruck } from 'react-icons/fi';

const OrderDispensing = () => {
  const [orders, setOrders] = useState([
    {
      id: 'PP-9021',
      patient: 'Ayesha Khan',
      items: 'Paracetamol 500mg, Amoxicillin 500mg',
      total: 'Rs. 740',
      status: 'Processing',
    },
    {
      id: 'PP-9022',
      patient: 'Bilal Ahmed',
      items: 'Vitamin C 1000mg, Omega 3',
      total: 'Rs. 1,450',
      status: 'Ready for Delivery',
    },
    {
      id: 'PP-9023',
      patient: 'Zainab Bibi',
      items: 'Metformin 500mg',
      total: 'Rs. 320',
      status: 'Processing',
    },
    {
      id: 'PP-9024',
      patient: 'Usman Ali',
      items: 'Ibuprofen 400mg, Panadol Extra',
      total: 'Rs. 450',
      status: 'Dispatched',
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
  };

  return (
    <div>
      <div style={styles.banner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.bannerIcon}>
            <FiPackage size={18} color="#2563eb" />
          </div>
          <div>
            <h3 style={styles.bannerTitle}>Order Dispensing & Fulfillment</h3>
            <p style={styles.bannerSubtitle}>Pack medicines and update order delivery statuses</p>
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Prescribed Medicines</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(ord => {
              const isProcessing = ord.status === 'Processing';
              const isReady = ord.status === 'Ready for Delivery';

              return (
                <tr key={ord.id} style={styles.tbodyRow}>
                  <td style={styles.td}>
                    <strong>{ord.id}</strong>
                  </td>
                  <td style={styles.td}>{ord.patient}</td>
                  <td style={styles.td}>{ord.items}</td>
                  <td style={styles.td}>{ord.total}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: isReady ? '#dcfce7' : ord.status === 'Dispatched' ? '#eff6ff' : '#fef3c7',
                      color: isReady ? '#16a34a' : ord.status === 'Dispatched' ? '#2563eb' : '#b45309',
                    }}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {isProcessing && (
                      <button 
                        style={styles.actionBtnBlue} 
                        onClick={() => handleUpdateStatus(ord.id, 'Ready for Delivery')}
                      >
                        <FiCheck size={14} /> Mark as Ready
                      </button>
                    )}
                    {isReady && (
                      <button 
                        style={styles.actionBtnGreen} 
                        onClick={() => handleUpdateStatus(ord.id, 'Dispatched')}
                      >
                        <FiTruck size={14} /> Dispatch Order
                      </button>
                    )}
                    {ord.status === 'Dispatched' && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Completed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  bannerIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  bannerSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
  },
  theadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  th: {
    padding: '14px 16px',
    fontWeight: '700',
    color: '#475569',
  },
  tbodyRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    color: '#0f172a',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
  },
  actionBtnBlue: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionBtnGreen: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

export default OrderDispensing;