import React, { useState, useEffect } from 'react';
import { FiBox, FiTruck, FiAlertTriangle, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Inventory from './Inventory';
import StockAlerts from './StockAlerts';
import ShipmentsLogistics from './ShipmentsLogistics';
import WarehouseWorkers from './WarehouseWorkers';
import SuppliersSettings from './SuppliersSettings';

const WarehouseManager = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get('http://localhost:5000/api/v1/warehouse/inventory', { headers });
        
        const combinedItems = [
          ...(res.data.medicines || []),
          ...(res.data.products || [])
        ];
        
        setInventory(combinedItems);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const totalSkus = inventory.length;
  const lowStockCount = inventory.filter(item => (item.stock ?? item.quantity ?? 0) < 10).length;

  const recentLogs = [
    { id: 'LOG-4821', medicine: 'Amoxicillin 500mg Caps', sku: 'AMX-500-C', action: 'Received', qty: '+2400', worker: 'Marcus Holloway', time: '09:14 AM' },
    { id: 'LOG-4820', medicine: 'Metformin 850mg Tabs', sku: 'MET-850-T', action: 'Dispatched', qty: '+600', worker: 'Priya Nair', time: '09:02 AM' },
    { id: 'LOG-4819', medicine: 'Atorvastatin 20mg Tabs', sku: 'ATV-020-T', action: 'Adjusted', qty: '-50', worker: 'Aisha Okonkwo', time: '08:47 AM' },
    { id: 'LOG-4818', medicine: 'Insulin Glargine 100U/mL', sku: 'INS-GLR-V', action: 'Received', qty: '+300', worker: 'James Obi', time: '08:30 AM' },
    { id: 'LOG-4817', medicine: 'Lisinopril 10mg Tabs', sku: 'LSN-010-T', action: 'Returned', qty: '+120', worker: 'Daniel Ferreira', time: '08:11 AM' },
  ];

  const workersOnDuty = [
    { initials: 'MH', name: 'Marcus Holloway', role: 'Supervisor · Zone A' },
    { initials: 'PN', name: 'Priya Nair', role: 'Picker · Zone B' },
    { initials: 'DF', name: 'Daniel Ferreira', role: 'Forklift Driver · Zone C' },
    { initials: 'AO', name: 'Aisha Okonkwo', role: 'Packer · Zone A' },
    { initials: 'JO', name: 'James Obi', role: 'Picker · Zone A' },
  ];

  const stockAlerts = [
    { name: 'Insulin Glargine 100U/mL', sku: 'INS-GLR-V', qty: '42', limit: '/ 100 min', type: 'critical' },
    { name: 'Adrenaline (Epinephrine) 1mg', sku: 'EPI-001-A', qty: '18', limit: '/ 50 min', type: 'critical' },
    { name: 'Amoxicillin-Clavulanate 625mg', sku: 'AMC-625-T', qty: '210', limit: '/ 300 min', type: 'warning' },
    { name: 'Paracetamol 500mg Tabs', sku: 'PCM-500-T', qty: '1800', limit: '/ 2000 min', type: 'warning' },
    { name: 'Morphine Sulfate 10mg/mL', sku: 'MRP-010-V', qty: '8', limit: '/ 25 min', type: 'critical' },
  ];

  return (
    <div style={styles.layoutContainer}>
      
      {/* SIDEBAR COMPONENT */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* CONDITIONAL RENDERING BASED ON ACTIVE TAB */}
      {activeTab === 'inventory' ? (
        <Inventory />
      ) : activeTab === 'alerts' ? (
        <StockAlerts />
      ) : activeTab === 'shipments' ? (
        <ShipmentsLogistics />
      ) : activeTab === 'workers' ? (
        <WarehouseWorkers />
      ) : activeTab === 'suppliers' ? (
        <SuppliersSettings />
      ) : (
        <main style={styles.mainContent}>
          <Navbar 
            title="Dashboard Overview" 
            subtitle="PharmaPlus Warehouse Management System · WH-01 Mumbai" 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />

          <div style={styles.contentBody}>
            {/* Metric Cards Grid */}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricIconBoxBlue}>
                  <FiBox size={20} color="#2563eb" />
                </div>
                <div>
                  <p style={styles.metricLabel}>TOTAL SKUS</p>
                  <h3 style={styles.metricValue}>{totalSkus > 0 ? totalSkus : '4,218'}</h3>
                  <p style={styles.metricSubText}>↗ Across 4 warehouse zones</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIconBoxRed}>
                  <FiAlertTriangle size={20} color="#dc2626" />
                </div>
                <div>
                  <p style={styles.metricLabel}>LOW STOCK MEDICINES</p>
                  <h3 style={styles.metricValueRed}>{lowStockCount > 0 ? lowStockCount : '5'}</h3>
                  <p style={styles.metricSubTextRed}>↘ 3 critical alerts</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIconBoxPurple}>
                  <FiTruck size={20} color="#7c3aed" />
                </div>
                <div>
                  <p style={styles.metricLabel}>ACTIVE SHIPMENTS</p>
                  <h3 style={styles.metricValue}>4</h3>
                  <p style={styles.metricSubText}>1 on customs hold</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIconBoxGreen}>
                  <FiUsers size={20} color="#16a34a" />
                </div>
                <div>
                  <p style={styles.metricLabel}>WORKERS ON DUTY</p>
                  <h3 style={styles.metricValue}>5</h3>
                  <p style={styles.metricSubText}>↗ Morning shift checked in</p>
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div style={styles.middleGrid}>
              <div style={styles.tableCard}>
                <div style={styles.tableHeaderRow}>
                  <div>
                    <h3 style={styles.tableTitle}>Recent Inventory Activity</h3>
                    <p style={styles.tableSub}>Live log — last 6 transactions</p>
                  </div>
                  <span style={styles.viewAllText}>View all</span>
                </div>

                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Log ID</th>
                      <th style={styles.th}>Medicine</th>
                      <th style={styles.th}>Action</th>
                      <th style={styles.th}>Qty</th>
                      <th style={styles.th}>Worker</th>
                      <th style={styles.th}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, index) => {
                      let badgeBg = '#f0fdf4', badgeColor = '#16a34a';
                      if (log.action === 'Dispatched') { badgeBg = '#eff6ff'; badgeColor = '#2563eb'; }
                      if (log.action === 'Adjusted') { badgeBg = '#fefce8'; badgeColor = '#ca8a04'; }
                      if (log.action === 'Returned') { badgeBg = '#f5f3ff'; badgeColor = '#7c3aed'; }

                      return (
                        <tr key={index} style={styles.tdRow}>
                          <td style={styles.tdSku}>{log.id}</td>
                          <td>
                            <div style={styles.tdNameText}>{log.medicine}</div>
                            <div style={styles.tdSkuSub}>{log.sku}</div>
                          </td>
                          <td>
                            <span style={{ ...styles.actionBadge, backgroundColor: badgeBg, color: badgeColor }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ ...styles.td, fontWeight: '700', color: log.qty.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                            {log.qty}
                          </td>
                          <td style={styles.td}>{log.worker}</td>
                          <td style={{ ...styles.td, color: '#64748b', fontSize: '12px' }}>{log.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={styles.workersCard}>
                <div style={styles.tableHeaderRow}>
                  <div>
                    <h3 style={styles.tableTitle}>Checked-In Workers</h3>
                    <p style={styles.tableSub}>Morning shift · 5 active</p>
                  </div>
                  <span style={styles.viewAllText}>Manage</span>
                </div>

                <div style={styles.workersList}>
                  {workersOnDuty.map((worker, index) => (
                    <div key={index} style={styles.workerRow}>
                      <div style={styles.workerAvatar}>{worker.initials}</div>
                      <div style={{ flex: 1 }}>
                        <p style={styles.workerName}>{worker.name}</p>
                        <p style={styles.workerSub}>{worker.role}</p>
                      </div>
                      <div style={styles.workerStatusBox}>
                        <span style={styles.workerTime}>06:00</span>
                        <div style={styles.liveIndicator}>
                          <span style={styles.greenDot}></span>
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Live</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={styles.alertsContainer}>
              <div style={styles.alertsHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiAlertTriangle size={16} color="#dc2626" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Active Stock Alerts</span>
                  <span style={styles.alertCountBadge}>5</span>
                </div>
                <span style={styles.viewAllText}>View all alerts</span>
              </div>

              <div style={styles.alertsGrid}>
                {stockAlerts.map((alert, index) => (
                  <div key={index} style={styles.alertMiniCard}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ ...styles.dotIndicator, backgroundColor: alert.type === 'critical' ? '#dc2626' : '#eab308' }}></span>
                          <p style={styles.alertMedName}>{alert.name}</p>
                        </div>
                        <p style={styles.alertSkuText}>{alert.sku}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: alert.type === 'critical' ? '#dc2626' : '#ca8a04' }}>
                          {alert.qty}
                        </span>
                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{alert.limit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

const styles = {
  layoutContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' },
  metricCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' },
  metricIconBoxBlue: { padding: '10px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex' },
  metricIconBoxRed: { padding: '10px', backgroundColor: '#fef2f2', borderRadius: '10px', display: 'flex' },
  metricIconBoxPurple: { padding: '10px', backgroundColor: '#f5f3ff', borderRadius: '10px', display: 'flex' },
  metricIconBoxGreen: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '10px', display: 'flex' },
  metricLabel: { fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0', letterSpacing: '0.05em' },
  metricValue: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' },
  metricValueRed: { fontSize: '22px', fontWeight: '800', color: '#dc2626', margin: '0 0 2px 0' },
  metricSubText: { fontSize: '11px', color: '#16a34a', margin: 0, fontWeight: '500' },
  metricSubTextRed: { fontSize: '11px', color: '#dc2626', margin: 0, fontWeight: '500' },
  middleGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  workersCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  tableHeaderRow: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' },
  tableTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
  tableSub: { fontSize: '11px', color: '#64748b', margin: 0 },
  viewAllText: { fontSize: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '10px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tdRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#334155' },
  tdSku: { padding: '12px 16px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', fontWeight: '600' },
  tdSkuSub: { fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' },
  tdNameText: { fontSize: '13px', fontWeight: '600', color: '#0f172a' },
  actionBadge: { padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', display: 'inline-block' },
  workersList: { padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  workerRow: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f8fafc' },
  workerAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
  workerName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  workerSub: { fontSize: '11px', color: '#64748b', margin: 0 },
  workerStatusBox: { textAlign: 'right' },
  workerTime: { fontSize: '11px', color: '#64748b', display: 'block' },
  liveIndicator: { display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' },
  greenDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' },
  alertsContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px' },
  alertsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  alertCountBadge: { backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', border: '1px solid #fca5a5' },
  alertsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' },
  alertMiniCard: { backgroundColor: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' },
  dotIndicator: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  alertMedName: { fontSize: '12px', fontWeight: '700', color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' },
  alertSkuText: { fontSize: '10px', fontFamily: 'monospace', color: '#64748b', margin: '2px 0 0 14px' }
};

export default WarehouseManager;