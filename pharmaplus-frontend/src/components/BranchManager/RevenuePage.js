import React, { useState } from 'react';
import { FiTrendingUp, FiDollarSign, FiCreditCard, FiCalendar, FiDownload, FiCheckCircle, FiClock } from 'react-icons/fi';

const RevenuePage = () => {
  const [timeRange, setTimeRange] = useState('This Week');

  const transactions = [
    { id: 'TXN-8841', type: 'Cash Sale', desc: 'Metformin 850mg × 5 packs', amount: 'PKR 2,100', method: 'Cash', time: '09:47', status: 'Settled' },
    { id: 'TXN-8842', type: 'Digital', desc: 'Online order ORD-2847', amount: 'PKR 1,340', method: 'JazzCash', time: '09:38', status: 'Settled' },
    { id: 'TXN-8843', type: 'Insurance', desc: 'Claim #INS-0091 — Khalid Mir', amount: 'PKR 4,200', method: 'EFU Life', time: '09:22', status: 'Pending' },
    { id: 'TXN-8844', type: 'Cash Sale', desc: 'Paracetamol + Ibuprofen combo', amount: 'PKR 520', method: 'Cash', time: '09:18', status: 'Settled' }
  ];

  return (
    <div style={styles.contentBody}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Financial & Revenue Reports</h1>
          <p style={styles.pageSub}>Daily cash flow, digital payments, and transaction ledger</p>
        </div>
        <div style={styles.timeToggleContainer}>
          {['This Week', 'This Month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                ...styles.timeToggleBtn,
                ...(timeRange === range ? styles.activeTimeBtn : {})
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>TODAY'S REVENUE</span>
          <span style={styles.kpiValue}>PKR 55,400</span>
          <span style={styles.kpiSub}>Sep 8, 2026</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>CASH COLLECTED</span>
          <span style={styles.kpiValue}>PKR 34,200</span>
          <span style={styles.kpiSub}>62% of today</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>DIGITAL PAYMENTS</span>
          <span style={styles.kpiValue}>PKR 18,900</span>
          <span style={styles.kpiSub}>34% of today</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>WEEKLY TOTAL</span>
          <span style={styles.kpiValue}>PKR 444,800</span>
          <span style={styles.kpiSub}>Sep 1 – Sep 8</span>
        </div>
      </div>

      <div style={styles.analyticsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Daily Revenue Breakdown</h3>
            <div style={styles.legend}>
              <span style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#10b981'}}></span>Cash</span>
              <span style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#3b82f6'}}></span>Digital</span>
              <span style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#8b5cf6'}}></span>Insurance</span>
            </div>
          </div>
          <div style={styles.chartVisual}>
            {/* Visual simulation of stacked bar chart columns */}
            {[
              { day: '1', cash: 60, digital: 25, ins: 5 },
              { day: '2', cash: 65, digital: 22, ins: 4 },
              { day: '3', cash: 55, digital: 20, ins: 6 },
              { day: '4', cash: 70, digital: 28, ins: 7 },
              { day: '5', cash: 58, digital: 25, ins: 8 },
              { day: '6', cash: 72, digital: 30, ins: 6 },
              { day: '7', cash: 75, digital: 32, ins: 5 },
              { day: '8', cash: 62, digital: 28, ins: 4 },
            ].map((col, idx) => (
              <div key={idx} style={styles.barColumn}>
                <div style={styles.stackedBar}>
                  <div style={{height: `${col.ins}%`, backgroundColor: '#8b5cf6', width: '100%'}}></div>
                  <div style={{height: `${col.digital}%`, backgroundColor: '#3b82f6', width: '100%'}}></div>
                  <div style={{height: `${col.cash}%`, backgroundColor: '#10b981', width: '100%'}}></div>
                </div>
                <span style={styles.barLabel}>{col.day}</span>
                <span style={styles.barSubLabel}>Sep {col.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.paymentMethodsCard}>
          <h3 style={styles.chartTitle}>Payment Methods</h3>
          <div style={styles.paymentList}>
            {[
              { name: 'Cash', amount: 'PKR 34,200', percent: '62%', width: '62%', color: '#10b981' },
              { name: 'JazzCash', amount: 'PKR 8,400', percent: '15%', width: '15%', color: '#f97316' },
              { name: 'Easypaisa', amount: 'PKR 5,200', percent: '9%', width: '9%', color: '#06b6d4' },
              { name: 'Credit/Debit Card', amount: 'PKR 5,300', percent: '10%', width: '10%', color: '#3b82f6' },
              { name: 'Insurance', amount: 'PKR 2,300', percent: '4%', width: '4%', color: '#8b5cf6' },
            ].map((method, idx) => (
              <div key={idx} style={styles.methodRow}>
                <div style={styles.methodInfo}>
                  <span style={styles.methodName}>{method.name}</span>
                  <span style={styles.methodAmount}>{method.amount}</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ width: method.width, backgroundColor: method.color, height: '6px', borderRadius: '3px' }}></div>
                </div>
                <span style={styles.methodPercent}>{method.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableCardHeader}>
          <h3 style={styles.chartTitle}>Transaction Ledger — Today</h3>
          <button style={styles.exportBtn}>Export</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>TXN ID</th>
              <th style={styles.th}>TYPE</th>
              <th style={styles.th}>DESCRIPTION</th>
              <th style={styles.th}>AMOUNT</th>
              <th style={styles.th}>METHOD</th>
              <th style={styles.th}>TIME</th>
              <th style={styles.th}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id} style={styles.tableRow}>
                <td style={styles.td}><span style={styles.txnId}>{txn.id}</span></td>
                <td style={styles.td}><span style={styles.txnType}>{txn.type}</span></td>
                <td style={styles.td}><span style={styles.txnDesc}>{txn.desc}</span></td>
                <td style={styles.td}><span style={styles.txnAmount}>{txn.amount}</span></td>
                <td style={styles.td}><span style={styles.txnMethod}>{txn.method}</span></td>
                <td style={styles.td}><span style={styles.txnTime}>{txn.time}</span></td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: txn.status === 'Settled' ? '#f0fdf4' : '#fffbeb',
                    color: txn.status === 'Settled' ? '#16a34a' : '#d97706'
                  }}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },
  timeToggleContainer: { display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px', gap: '4px' },
  timeToggleBtn: { border: 'none', background: 'transparent', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b', cursor: 'pointer' },
  activeTimeBtn: { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },

  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  kpiCard: { backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' },
  kpiLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  kpiValue: { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  kpiSub: { fontSize: '12px', color: '#64748b' },

  analyticsGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  chartCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 },
  legend: { display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b', alignItems: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  
  chartVisual: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' },
  barColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  stackedBar: { width: '28px', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '4px', overflow: 'hidden' },
  barLabel: { fontSize: '12px', fontWeight: '600', color: '#0f172a' },
  barSubLabel: { fontSize: '10px', color: '#94a3b8' },

  paymentMethodsCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' },
  paymentList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  methodRow: { display: 'flex', flexDirection: 'column', gap: '4px' },
  methodInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  methodName: { fontWeight: '600', color: '#0f172a' },
  methodAmount: { fontWeight: '700', color: '#0f172a' },
  progressBarBg: { backgroundColor: '#f1f5f9', borderRadius: '3px', width: '100%', height: '6px', overflow: 'hidden' },
  methodPercent: { fontSize: '11px', color: '#64748b', textAlign: 'right' },

  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tableCardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' },
  exportBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 20px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', verticalAlign: 'middle', fontSize: '13px' },
  txnId: { fontWeight: '700', color: '#2563eb' },
  txnType: { fontWeight: '600', color: '#0f172a' },
  txnDesc: { color: '#334155' },
  txnAmount: { fontWeight: '700', color: '#0f172a' },
  txnMethod: { color: '#64748b' },
  txnTime: { color: '#64748b', fontSize: '12px' },
  statusBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }
};

export default RevenuePage;