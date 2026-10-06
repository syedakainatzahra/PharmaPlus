import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiDownload, 
  FiDollarSign, 
  FiHome, 
  FiUsers, 
  FiShield, 
  FiTrendingUp, 
  FiArrowRight 
} from 'react-icons/fi';
import UserManagement from './UserManagement';
import BillingSubscriptions from './BillingSubscriptions';
import SystemSettings from './SystemSettings';
import RolesPermissions from './RolesPermissions';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BranchManagement from './BranchManagement';
import AuditLogs from './AuditLogs';
import API from '../../services/api';
import { toast } from 'react-toastify';

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('/v1/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error(error.response?.data?.message || 'Failed to load system stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Header Actions */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Network Overview</h1>
          <p style={styles.pageSubtitle}>Monitor performance across your entire healthcare network.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={styles.datePickerBtn}>
            <FiCalendar size={13} color="#64748b" />
            <span>Aug 1 – Aug 19, 2026</span>
          </button>
          <button style={styles.exportBtn}>
            <FiDownload size={13} color="#64748b" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiTopRow}>
            <span style={styles.kpiLabel}>Total Network Revenue</span>
            <span style={styles.kpiIconBlue}>
              <FiDollarSign size={14} color="#1d4ed8" />
            </span>
          </div>
          <div style={styles.kpiValue}>
            {stats?.revenue?.total ? `PKR ${stats.revenue.total}` : 'PKR 48.6M'}
          </div>
          <div style={styles.kpiSubGreen}>
            <FiTrendingUp size={12} style={{ marginRight: '3px' }} />
            <span>12.8%</span> <span style={{ color: '#94a3b8', fontWeight: '400' }}>vs. previous month</span>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiTopRow}>
            <span style={styles.kpiLabel}>Active Branches</span>
            <span style={styles.kpiIconBlue}>
              <FiHome size={14} color="#1d4ed8" />
            </span>
          </div>
          <div style={styles.kpiValue}>
            {stats?.branches?.active ?? 24}
          </div>
          <div style={styles.kpiSubGreen}>+3 this month</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiTopRow}>
            <span style={styles.kpiLabel}>Total Staff</span>
            <span style={styles.kpiIconBlue}>
              <FiUsers size={14} color="#1d4ed8" />
            </span>
          </div>
          <div style={styles.kpiValue}>
            {stats?.users?.total ?? 486}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            {stats?.users?.doctors ?? 142} Doctors • {stats?.users?.pharmacists ?? 186} Pharmacists • {stats?.users?.other ?? 158} Other
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiTopRow}>
            <span style={styles.kpiLabel}>System Health</span>
            <span style={styles.kpiIconBlue}>
              <FiShield size={14} color="#1d4ed8" />
            </span>
          </div>
          <div style={styles.kpiValue}>99.98%</div>
          <div style={styles.kpiSubGreen}>● Operational</div>
        </div>
      </div>

      {/* Charts Section: Revenue vs Expense & Top Performing Branches */}
      <div style={styles.chartsGrid}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={styles.cardTitle}>Monthly Revenue vs Expense</h3>
              <span style={styles.cardSubtitle}>Network-wide financial performance</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['7D', '30D', '3M', '6M', '1Y'].map((time, idx) => (
                <button
                  key={time}
                  style={{
                    ...styles.timeBtn,
                    backgroundColor: idx === 3 ? '#1e3a8a' : 'transparent',
                    color: idx === 3 ? '#ffffff' : '#64748b'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', height: '180px', marginTop: '10px' }}>
            <svg viewBox="0 0 700 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M 0 50 Q 200 40, 350 35 T 700 15" fill="none" stroke="#1e3a8a" strokeWidth="2.5" />
              <path d="M 0 85 Q 200 80, 350 75 T 700 70" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '11px', color: '#475569' }}>
              <span><span style={{ color: '#94a3b8', fontWeight: 'bold' }}>--</span> Expenses</span>
              <span><span style={{ color: '#1e3a8a', fontWeight: 'bold' }}>—</span> Revenue</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Top Performing Branches</h3>
          <span style={styles.cardSubtitle}>Performance score & revenue</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {[
              { id: '01', name: 'Islamabad Main', val: '94%', grow: '+18%', rev: 'PKR 4.8M', bar: 94 },
              { id: '02', name: 'Lahore Central', val: '88%', grow: '+14%', rev: 'PKR 4.1M', bar: 88 },
              { id: '03', name: 'Rawalpindi', val: '81%', grow: '+11%', rev: 'PKR 3.9M', bar: 81 },
              { id: '04', name: 'Karachi DHA', val: '75%', grow: '+9%', rev: 'PKR 3.4M', bar: 75 },
              { id: '05', name: 'Faisalabad', val: '68%', grow: '+6%', rev: 'PKR 2.9M', bar: 68 }
            ].map(b => (
              <div key={b.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#334155' }}>
                    <span style={{ color: '#94a3b8', marginRight: '6px' }}>{b.id}</span>{b.name}
                  </span>
                  <div>
                    <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '11px' }}>{b.grow}</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{b.val}</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                  <div style={{ width: `${b.bar}%`, height: '100%', backgroundColor: '#1e3a8a', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{b.rev}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 3 Grid Cards (Restored) */}
      <div style={styles.bottomGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Branch Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'conic-gradient(#1e3a8a 0% 82%, #f59e0b 82% 92%, #ef4444 92% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                {stats?.branches?.total ?? 29}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#1e3a8a' }}>●</span> {stats?.branches?.active ?? 24} Active</div>
              <div><span style={{ color: '#f59e0b' }}>●</span> {stats?.branches?.maintenance ?? 3} Maintenance</div>
              <div><span style={{ color: '#ef4444' }}>●</span> {stats?.branches?.disabled ?? 2} Disabled</div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Staff Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {[
              { label: 'Doctors', count: stats?.users?.doctors ?? 142, bar: 70, color: '#1e3a8a' },
              { label: 'Pharmacists', count: stats?.users?.pharmacists ?? 186, bar: 90, color: '#10b981' },
              { label: 'Managers', count: stats?.users?.managers ?? 24, bar: 20, color: '#f59e0b' },
              { label: 'Other Staff', count: stats?.users?.other ?? 134, bar: 65, color: '#94a3b8' }
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>{s.label}</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{s.count}</span>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                  <div style={{ width: `${s.bar}%`, height: '100%', backgroundColor: s.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>System Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '500' }}>● Critical</span>
              <span style={{ fontSize: '14px', color: '#991b1b', fontWeight: '700' }}>3</span>
            </div>
            <div style={{ backgroundColor: '#fffbe5', border: '1px solid #fef08a', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#854d0e', fontWeight: '500' }}>● Warnings</span>
              <span style={{ fontSize: '14px', color: '#854d0e', fontWeight: '700' }}>8</span>
            </div>
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: '500' }}>● Informational</span>
              <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: '700' }}>24</span>
            </div>
          </div>
          <div style={{ marginTop: '14px', textAlign: 'left' }}>
            <a href="#security" style={{ fontSize: '12px', color: '#1e3a8a', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>View Security Center</span>
              <FiArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Embedded User Management Section */}
      <div style={{ marginTop: '24px' }}>
        <UserManagement />
      </div>
    </div>
  );
};

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      <div style={{ 
        ...styles.mainContent, 
        marginLeft: isCollapsed ? '80px' : '260px' 
      }}>
        <Navbar />

        <div style={styles.bodyWrapper}>
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'Branches' && <BranchManagement />}
          {activeTab === 'Users' && <UserManagement />}
          {activeTab === 'AuditLogs' && <AuditLogs />}
          {activeTab === 'Billing' && <BillingSubscriptions />}
          {activeTab === 'Roles' && <RolesPermissions />}
          {activeTab === 'Settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    transition: 'margin-left 0.2s ease-in-out'
  },
  bodyWrapper: {
    padding: '24px 32px',
    flex: 1
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  datePickerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#334155',
    cursor: 'pointer'
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#334155',
    cursor: 'pointer'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '20px'
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px 20px'
  },
  kpiTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  kpiLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  kpiIconBlue: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  kpiSubGreen: {
    fontSize: '12px',
    color: '#16a34a',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1.2fr',
    gap: '16px',
    marginBottom: '20px'
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0'
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#64748b'
  },
  timeBtn: {
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default SuperAdminDashboard;