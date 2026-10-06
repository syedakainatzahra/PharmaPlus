import React from 'react';
import { FiAlertTriangle, FiClock } from 'react-icons/fi';

const StockAlerts = () => {
  const alerts = [
    { name: 'Insulin Glargine 100U/mL', sku: 'INS-GLR-V', zone: 'Zone A', qty: '42 units remaining', min: 'Min threshold: 100', percentage: '42%', type: 'Critical' },
    { name: 'Adrenaline (Epinephrine) 1mg', sku: 'EPI-001-A', zone: 'Zone B', qty: '18 units remaining', min: 'Min threshold: 50', percentage: '36%', type: 'Critical' },
    { name: 'Amoxicillin-Clavulanate 625mg', sku: 'AMC-625-T', zone: 'Zone D', qty: '210 units remaining', min: 'Min threshold: 300', percentage: '70%', type: 'Warning' },
    { name: 'Paracetamol 500mg Tabs', sku: 'PCM-500-T', zone: 'Zone D', qty: '1800 units remaining', min: 'Min threshold: 2000', percentage: '90%', type: 'Warning' },
    { name: 'Morphine Sulfate 10mg/mL', sku: 'MRP-010-V', zone: 'Zone B', qty: '8 units remaining', min: 'Min threshold: 25', percentage: '32%', type: 'Critical' },
  ];

  return (
    <main style={styles.mainContent}>
      <div style={styles.contentBody}>
        
        {/* Top Metric Cards */}
        <div style={styles.metricsGrid}>
          <div style={{ ...styles.metricCard, borderLeft: '4px solid #dc2626' }}>
            <div style={styles.metricIconBoxRed}>
              <FiAlertTriangle size={20} color="#dc2626" />
            </div>
            <div>
              <h3 style={styles.metricValueRed}>3</h3>
              <p style={styles.metricLabel}>Critical Alerts</p>
            </div>
          </div>

          <div style={{ ...styles.metricCard, borderLeft: '4px solid #ca8a04' }}>
            <div style={styles.metricIconBoxYellow}>
              <FiAlertTriangle size={20} color="#ca8a04" />
            </div>
            <div>
              <h3 style={styles.metricValueYellow}>2</h3>
              <p style={styles.metricLabel}>Warning Alerts</p>
            </div>
          </div>

          <div style={{ ...styles.metricCard, borderLeft: '4px solid #2563eb' }}>
            <div style={styles.metricIconBoxBlue}>
              <FiClock size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={styles.metricValueBlue}>12</h3>
              <p style={styles.metricLabel}>Expiring within 90 days</p>
            </div>
          </div>
        </div>

        {/* Stock Alert Details Section */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Stock Alert Details</h3>
          </div>

          <div style={styles.alertList}>
            {alerts.map((item, index) => {
              const isCrit = item.type === 'Critical';
              return (
                <div key={index} style={styles.alertRow}>
                  <div style={styles.alertLeft}>
                    <span style={{ ...styles.redDot, backgroundColor: isCrit ? '#dc2626' : '#ca8a04' }}></span>
                    <div>
                      <p style={styles.medName}>{item.name}</p>
                      <p style={styles.medSub}>{item.sku} · {item.zone}</p>
                    </div>
                  </div>

                  <div style={styles.alertRight}>
                    <div style={styles.progressMeta}>
                      <span style={styles.stockLevelText}>Stock Level</span>
                      <span style={{ ...styles.percentageText, color: isCrit ? '#dc2626' : '#ca8a04' }}>{item.percentage}</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{ 
                        ...styles.progressBarFill, 
                        width: item.percentage, 
                        backgroundColor: isCrit ? '#dc2626' : '#ca8a04' 
                      }}></div>
                    </div>
                    <p style={styles.thresholdText}>{item.qty} · Min threshold: {item.min.replace('Min threshold: ', '')}</p>
                  </div>

                  <div style={styles.actionCol}>
                    <span style={{ ...styles.statusBadge, backgroundColor: isCrit ? '#fef2f2' : '#fefce8', color: isCrit ? '#dc2626' : '#ca8a04', border: `1px solid ${isCrit ? '#fca5a5' : '#fde047'}` }}>
                      {item.type}
                    </span>
                    <button style={styles.reorderBtn}>Reorder</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
};

const styles = {
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' },
  metricCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' },
  metricIconBoxRed: { padding: '12px', backgroundColor: '#fef2f2', borderRadius: '10px' },
  metricIconBoxYellow: { padding: '12px', backgroundColor: '#fefce8', borderRadius: '10px' },
  metricIconBoxBlue: { padding: '12px', backgroundColor: '#eff6ff', borderRadius: '10px' },
  metricValueRed: { fontSize: '24px', fontWeight: '800', color: '#dc2626', margin: 0 },
  metricValueYellow: { fontSize: '24px', fontWeight: '800', color: '#ca8a04', margin: 0 },
  metricValueBlue: { fontSize: '24px', fontWeight: '800', color: '#2563eb', margin: 0 },
  metricLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', margin: '2px 0 0 0' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tableHeader: { padding: '20px 24px', borderBottom: '1px solid #e2e8f0' },
  tableTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },
  alertList: { display: 'flex', flexDirection: 'column' },
  alertRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', gap: '20px' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '12px', width: '280px' },
  redDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  medName: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
  medSub: { fontSize: '11px', fontFamily: 'monospace', color: '#64748b', margin: 0 },
  alertRight: { flex: 1, maxWidth: '450px' },
  progressMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  stockLevelText: { fontSize: '11px', fontWeight: '600', color: '#64748b' },
  percentageText: { fontSize: '12px', fontWeight: '700' },
  progressBarBg: { width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' },
  progressBarFill: { height: '100%', borderRadius: '3px' },
  thresholdText: { fontSize: '11px', color: '#64748b', margin: 0 },
  actionCol: { display: 'flex', alignItems: 'center', gap: '16px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  reorderBtn: { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default StockAlerts;