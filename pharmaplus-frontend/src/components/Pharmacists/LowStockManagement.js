import React, { useState } from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const LowStockManagement = () => {
  // Mock low stock items
  const [inventory, setInventory] = useState([
    { id: 'MED-101', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 12, threshold: 50, status: 'Critical' },
    { id: 'MED-102', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 18, threshold: 40, status: 'Low' },
    { id: 'MED-103', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 8, threshold: 30, status: 'Critical' },
    { id: 'MED-104', name: 'Ibuprofen 400mg', category: 'Analgesic', stock: 25, threshold: 50, status: 'Low' },
    { id: 'MED-105', name: 'Omeprazole 20mg', category: 'Antacid', stock: 14, threshold: 35, status: 'Critical' },
  ]);

  const handleRestock = (id) => {
    setInventory(prev =>
      prev.map(item => item.id === id ? { ...item, stock: item.stock + 50, status: 'Normal' } : item)
    );
  };

  return (
    <div>
      {/* Banner */}
      <div style={styles.banner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.bannerIcon}>
            <FiAlertCircle size={18} color="#dc2626" />
          </div>
          <div>
            <h3 style={styles.bannerTitle}>Low Stock & Inventory Alerts</h3>
            <p style={styles.bannerSubtitle}>Monitor medicines falling below safe threshold limits</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Item ID</th>
              <th style={styles.th}>Medicine Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Current Stock</th>
              <th style={styles.th}>Safe Threshold</th>
              <th style={styles.th}>Alert Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const isCritical = item.stock < 20;

              return (
                <tr key={item.id} style={styles.tbodyRow}>
                  <td style={styles.td}><strong>{item.id}</strong></td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={{ ...styles.td, fontWeight: '700', color: isCritical ? '#dc2626' : '#0f172a' }}>
                    {item.stock} units
                  </td>
                  <td style={styles.td}>{item.threshold} units</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: isCritical ? '#fef2f2' : '#fef3c7',
                      color: isCritical ? '#dc2626' : '#b45309',
                    }}>
                      {isCritical ? 'Critical Low' : 'Low Stock'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.restockBtn} onClick={() => handleRestock(item.id)}>
                      <FiRefreshCw size={13} /> Restock (+50)
                    </button>
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
    backgroundColor: '#fef2f2',
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
  restockBtn: {
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
    gap: '6px',
  },
};

export default LowStockManagement;