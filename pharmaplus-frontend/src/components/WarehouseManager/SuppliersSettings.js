import React from 'react';
import { FiEdit3, FiFileText } from 'react-icons/fi';

const SuppliersSettings = () => {
  const suppliers = [
    { id: 'SUP-001', name: 'MedSource Pharma Ltd.', country: 'India', status: 'Active', leadTime: '14 days', categories: 'Antibiotics, Analgesics' },
    { id: 'SUP-002', name: 'BioChem Distributors', country: 'Germany', status: 'Active', leadTime: '21 days', categories: 'Biologics, Vaccines' },
    { id: 'SUP-003', name: 'PharmaCore Inc.', country: 'United States', status: 'Active', leadTime: '7 days', categories: 'Controlled Substances' },
    { id: 'SUP-004', name: 'EuroDrug Supply', country: 'Netherlands', status: 'Processing', leadTime: '18 days', categories: 'Cardiovascular, Metabolic' },
  ];

  return (
    <main style={styles.mainContent}>
      <div style={styles.contentBody}>
        <div style={styles.grid}>
          {suppliers.map((sup, index) => {
            const isActive = sup.status === 'Active';
            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.supName}>{sup.name}</h3>
                    <p style={styles.supSub}>{sup.id} · {sup.country}</p>
                  </div>
                  <span style={{ 
                    ...styles.statusBadge, 
                    backgroundColor: isActive ? '#f0fdf4' : '#fffbeb', 
                    color: isActive ? '#16a34a' : '#d97706',
                    border: `1px solid ${isActive ? '#bbf7d0' : '#fde68a'}`
                  }}>
                    {sup.status}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div>
                    <p style={styles.label}>Lead Time</p>
                    <p style={styles.value}>{sup.leadTime}</p>
                  </div>
                  <div>
                    <p style={styles.label}>Categories</p>
                    <p style={styles.value}>{sup.categories}</p>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <button style={styles.actionBtn}>
                    <FiEdit3 size={14} /> Edit
                  </button>
                  <button style={styles.actionBtn}>
                    <FiFileText size={14} /> View Contracts
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

const styles = {
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  supName: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
  supSub: { fontSize: '11px', fontFamily: 'monospace', color: '#64748b', margin: 0 },
  statusBadge: { padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  cardBody: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', gap: '12px' },
  label: { fontSize: '11px', color: '#64748b', fontWeight: '500', margin: '0 0 2px 0' },
  value: { fontSize: '13px', color: '#0f172a', fontWeight: '600', margin: 0 },
  cardFooter: { display: 'flex', gap: '10px' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default SuppliersSettings;