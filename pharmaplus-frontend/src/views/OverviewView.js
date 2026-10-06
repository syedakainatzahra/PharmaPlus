import React from 'react';

const OverviewView = () => {
  // Mock Data matching the UI design
  const topMedicines = [
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: '4,820', status: 'Adequate', statusColor: '#E6FFFA', textColor: '#234E52' },
    { name: 'Paracetamol 500mg', category: 'Analgesic', stock: '9,100', status: 'Adequate', statusColor: '#E6FFFA', textColor: '#234E52' },
    { name: 'Cetirizine 10mg', category: 'Antihistamine', stock: '312', status: 'Low', statusColor: '#FEFCBF', textColor: '#744210' },
    { name: 'Metformin 850mg', category: 'Antidiabetic', stock: '1,740', status: 'Adequate', statusColor: '#E6FFFA', textColor: '#234E52' },
    { name: 'Omeprazole 20mg', category: 'Antacid', stock: '88', status: 'Critical', statusColor: '#FED7D7', textColor: '#9B2C2C' },
  ];

  const recentActivity = [
    { user: 'Aiden Clarke', action: 'Added batch Amoxicillin 500mg - Batch #PH-2024-0892', time: '2 min ago' },
    { user: 'Priya Nair', action: 'Dispatched stock 200 units → Branch 3', time: '14 min ago' },
    { user: 'Marcus Lee', action: 'Role updated CUSTOMER → PHARMACIST', time: '1 hr ago' },
    { user: 'System', action: 'Expiry alert: Cetirizine 10mg expires in 8 days', time: '2 hr ago' },
  ];

  return (
    <div style={styles.container}>
      {/* 📊 Top Metric Cards */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.cardHeader}>
            <span style={styles.iconBox}>📦</span>
            <span style={styles.trendUp}>+12.4%</span>
          </div>
          <h2 style={styles.metricVal}>48,291</h2>
          <p style={styles.metricLabel}>Total Stock Units across all branches</p>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.iconBox, backgroundColor: '#FEFCBF' }}>⚠️</span>
            <span style={{ ...styles.trendUp, color: '#D69E2E' }}>+5 this week</span>
          </div>
          <h2 style={styles.metricVal}>23</h2>
          <p style={styles.metricLabel}>Near Expiry Items within 30 days</p>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.iconBox, backgroundColor: '#EBF8FF' }}>🚚</span>
            <span style={{ ...styles.trendUp, color: '#3182CE' }}>-3 from yesterday</span>
          </div>
          <h2 style={styles.metricVal}>9</h2>
          <p style={styles.metricLabel}>Pending Deliveries in transit</p>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.iconBox, backgroundColor: '#E9D8FD' }}>👥</span>
            <span style={{ ...styles.trendUp, color: '#805AD5' }}>+2 online</span>
          </div>
          <h2 style={styles.metricVal}>34</h2>
          <p style={styles.metricLabel}>Active Users system-wide</p>
        </div>
      </div>

      {/* 📈 Middle Section: Stock Trend & Activity Feed */}
      <div style={styles.middleGrid}>
        {/* Left: Bar Chart Visual */}
        <div style={styles.chartCard}>
          <h3 style={styles.cardTitle}>Stock Units — 6 Month Trend</h3>
          <div style={styles.barChartContainer}>
            {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, idx) => (
              <div key={month} style={styles.barCol}>
                <div style={{ 
                  ...styles.bar, 
                  height: `${(idx + 3) * 15}%`,
                  backgroundColor: idx === 5 ? '#0F4C81' : '#BEE3F8'
                }}></div>
                <span style={styles.monthLabel}>{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Activity Log */}
        <div style={styles.activityCard}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          <div style={styles.activityList}>
            {recentActivity.map((act, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.dot}></div>
                <div>
                  <strong>{act.user}</strong> <span style={{ color: '#4A5568' }}>· {act.action}</span>
                  <div style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '2px' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 Bottom Section: Top Stock Table */}
      <div style={{ ...styles.chartCard, marginTop: '20px' }}>
        <h3 style={styles.cardTitle}>Top Medicines by Stock</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>MEDICINE</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>STOCK QTY</th>
              <th style={styles.th}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {topMedicines.map((item, idx) => (
              <tr key={idx} style={styles.tdRow}>
                <td style={styles.td}><strong>{item.name}</strong></td>
                <td style={styles.td}>{item.category}</td>
                <td style={styles.td}><strong>{item.stock}</strong></td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: item.statusColor,
                    color: item.textColor,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ● {item.status}
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

// 🎨 Styles matching UI
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
  metricCard: { backgroundColor: '#FFF', padding: '18px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  iconBox: { backgroundColor: '#E6FFFA', padding: '8px', borderRadius: '8px', fontSize: '1.2rem' },
  trendUp: { fontSize: '0.75rem', color: '#38A169', fontWeight: 'bold' },
  metricVal: { margin: '0 0 5px 0', fontSize: '1.8rem', color: '#2D3748' },
  metricLabel: { margin: 0, fontSize: '0.8rem', color: '#718096' },
  middleGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  chartCard: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  activityCard: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: '0 0 15px 0', fontSize: '1rem', color: '#2D3748' },
  barChartContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '20px' },
  barCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  bar: { width: '40px', borderRadius: '6px 6px 0 0', transition: 'height 0.3s ease' },
  monthLabel: { marginTop: '8px', fontSize: '0.8rem', color: '#718096' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  activityItem: { display: 'flex', gap: '10px', fontSize: '0.85rem' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#319795', marginTop: '5px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { borderBottom: '1px solid #E2E8F0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '0.75rem', color: '#A0AEC0' },
  tdRow: { borderBottom: '1px solid #EDF2F7' },
  td: { padding: '12px 10px', fontSize: '0.85rem' }
};

export default OverviewView;