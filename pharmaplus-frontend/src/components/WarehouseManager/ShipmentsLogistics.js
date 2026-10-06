import React from 'react';
import { FiPlus } from 'react-icons/fi';

const ShipmentsLogistics = () => {
  const shipments = [
    { id: 'SHP-2841', supplier: 'MedSource Pharma Ltd.', origin: 'Mumbai, IN', destination: 'WH-01 Zone C', items: 14, progress: '68%', progressColor: '#2563eb', eta: 'Sep 09', status: 'In Transit' },
    { id: 'SHP-2840', supplier: 'BioChem Distributors', origin: 'Frankfurt, DE', destination: 'WH-01 Zone A', items: 6, progress: '40%', progressColor: '#f97316', eta: 'Sep 12', status: 'Customs Hold' },
    { id: 'SHP-2839', supplier: 'PharmaCore Inc.', origin: 'Chicago, US', destination: 'WH-01 Zone B', items: 22, progress: '100%', progressColor: '#16a34a', eta: 'Sep 07', status: 'Delivered' },
    { id: 'SHP-2838', supplier: 'EuroDrug Supply', origin: 'Amsterdam, NL', destination: 'WH-01 Zone D', items: 9, progress: '52%', progressColor: '#2563eb', eta: 'Sep 11', status: 'In Transit' },
    { id: 'SHP-2837', supplier: 'AsiaPharm Export', origin: 'Shanghai, CN', destination: 'WH-01 Zone C', items: 31, progress: '15%', progressColor: '#2563eb', eta: 'Sep 14', status: 'Processing' },
  ];

  return (
    <main style={styles.mainContent}>
      <div style={styles.contentBody}>
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.tableTitle}>Active & Recent Shipments</h3>
            </div>
            <button style={styles.addBtn}>
              <FiPlus size={16} /> New Shipment
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Shipment ID</th>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Origin</th>
                <th style={styles.th}>Destination</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>ETA</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((item, index) => {
                let badgeBg = '#eff6ff', badgeColor = '#2563eb', border = '#bfdbfe';
                if (item.status === 'Customs Hold') { badgeBg = '#fffbeb'; badgeColor = '#d97706'; border = '#fde68a'; }
                if (item.status === 'Delivered') { badgeBg = '#f0fdf4'; badgeColor = '#16a34a'; border = '#bbf7d0'; }
                if (item.status === 'Processing') { badgeBg = '#f5f3ff'; badgeColor = '#7c3aed'; border = '#ddd6fe'; }

                return (
                  <tr key={index} style={styles.tdRow}>
                    <td style={styles.tdSku}>{item.id}</td>
                    <td style={styles.tdName}>{item.supplier}</td>
                    <td style={styles.td}>{item.origin}</td>
                    <td style={styles.td}>{item.destination}</td>
                    <td style={{ ...styles.td, fontWeight: '700' }}>{item.items}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={styles.progressBarBg}>
                          <div style={{ width: item.progress, height: '100%', backgroundColor: item.progressColor, borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b', minWidth: '32px' }}>{item.progress}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{item.eta}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${border}` }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

const styles = {
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  contentBody: { padding: '24px 32px' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tableHeader: { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' },
  tableTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 20px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tdRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', fontSize: '13px', color: '#334155' },
  tdSku: { padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b', fontWeight: '600' },
  tdName: { padding: '14px 20px', fontSize: '13px', fontWeight: '700', color: '#0f172a' },
  progressBarBg: { width: '100px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block' }
};

export default ShipmentsLogistics;