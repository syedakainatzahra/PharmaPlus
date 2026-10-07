import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // State for logs, branches, users, and filters data
  const [auditLogs, setAuditLogs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Audit Logs, Branches, and Users from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        const headers = { Authorization: `Bearer ${token}` };

        // Parallel API calls for logs, branches, and users
        const [logsRes, branchesRes, usersRes] = await Promise.all([
          axios.get('https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin/audit-logs', { headers }),
          axios.get('https://pharmaplus-production-7fa8.up.railway.app/api/v1/branches/all', { headers }),
          axios.get('https://pharmaplus-production-7fa8.up.railway.app/api/v1/users', { headers }) // Adjust endpoint if route is /all or /
        ]);
        
        // Format Audit Logs
        const formattedLogs = logsRes.data.logs.map(log => ({
          id: log.id,
          timestamp: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: log.user ? log.user.fullName : 'System',
          action: log.action,
          module: log.module || 'General',
          branch: log.branch ? log.branch.name : 'Network',
          severity: log.severity || 'INFO',
          ip: log.ip || '127.0.0.1'
        }));

        setAuditLogs(formattedLogs);

        // Extract unique modules dynamically from logs
        const uniqueModules = Array.from(new Set(formattedLogs.map(l => l.module)));
        setModules(uniqueModules);

        // Set branches and users from database
        setBranches(branchesRes.data.branches || branchesRes.data || []);
        setUsers(usersRes.data.users || usersRes.data || []);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch audit data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.ip.includes(searchQuery);
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesBranch = branchFilter === 'All' || log.branch === branchFilter;
    const matchesUser = userFilter === 'All' || log.user === userFilter;

    return matchesSearch && matchesSeverity && matchesModule && matchesBranch && matchesUser;
  });

  const getSeverityBadgeStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' };
      case 'WARNING':
        return { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fcd34d' };
      case 'SUCCESS':
        return { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac' };
      default: 
        return { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #93c5fd' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Area */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>System Audit Logs</h1>
          <p style={styles.pageSubtitle}>
            Complete audit trail of user actions, system events, and security incidents.
          </p>
        </div>
        <button style={styles.exportBtn}>
          <FiDownload size={14} color="#475569" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Search & Filter Bar with Dynamic Data */}
      <div style={styles.filterCard}>
        <div style={styles.searchInputWrapper}>
          <FiSearch size={14} color="#94a3b8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search user, action, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* User Filter Dropdown (Real Backend Users) */}
        <div style={styles.selectWrapper}>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} style={styles.filterSelect}>
            <option value="All">All Users</option>
            {users.map((u) => (
              <option key={u.id || u._id} value={u.fullName || u.name}>
                {u.fullName || u.name}
              </option>
            ))}
          </select>
          <FiChevronDown size={14} color="#64748b" style={styles.selectArrow} />
        </div>

        {/* Module Filter Dropdown (Dynamic) */}
        <div style={styles.selectWrapper}>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} style={styles.filterSelect}>
            <option value="All">All Modules</option>
            {modules.map((mod, idx) => (
              <option key={idx} value={mod}>{mod}</option>
            ))}
          </select>
          <FiChevronDown size={14} color="#64748b" style={styles.selectArrow} />
        </div>

        {/* Branch Filter Dropdown (Real Backend Branches) */}
        <div style={styles.selectWrapper}>
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={styles.filterSelect}>
            <option value="All">All Branches</option>
            <option value="Network">Network (Global)</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>{branch.name}</option>
            ))}
          </select>
          <FiChevronDown size={14} color="#64748b" style={styles.selectArrow} />
        </div>

        {/* Severity Filter Dropdown */}
        <div style={styles.selectWrapper}>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={styles.filterSelect}>
            <option value="All">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
          </select>
          <FiChevronDown size={14} color="#64748b" style={styles.selectArrow} />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCritical}>
          <span style={styles.kpiLabelRed}>Critical Events</span>
          <span style={styles.kpiNumberRed}>{auditLogs.filter(l => l.severity === 'CRITICAL').length}</span>
        </div>
        <div style={styles.kpiWarning}>
          <span style={styles.kpiLabelYellow}>Warnings</span>
          <span style={styles.kpiNumberYellow}>{auditLogs.filter(l => l.severity === 'WARNING').length}</span>
        </div>
        <div style={styles.kpiInfo}>
          <span style={styles.kpiLabelBlue}>Info Events</span>
          <span style={styles.kpiNumberBlue}>{auditLogs.filter(l => l.severity === 'INFO').length}</span>
        </div>
        <div style={styles.kpiSuccess}>
          <span style={styles.kpiLabelGreen}>Success</span>
          <span style={styles.kpiNumberGreen}>{auditLogs.filter(l => l.severity === 'SUCCESS').length}</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading audit logs...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No audit logs found.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>TIMESTAMP</th>
                <th style={styles.th}>USER</th>
                <th style={styles.th}>ACTION</th>
                <th style={styles.th}>MODULE</th>
                <th style={styles.th}>BRANCH</th>
                <th style={styles.th}>SEVERITY</th>
                <th style={styles.th}>IP ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  style={{
                    ...styles.tdRow,
                    backgroundColor: log.severity === 'CRITICAL' ? '#fff5f5' : 'transparent'
                  }}
                >
                  <td style={styles.tdTime}>{log.timestamp}</td>
                  <td style={styles.tdUser}>{log.user}</td>
                  <td style={styles.tdAction}>{log.action}</td>
                  <td style={styles.td}>
                    <span style={styles.moduleBadge}>{log.module}</span>
                  </td>
                  <td style={styles.tdBranch}>{log.branch}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.severityBadge, ...getSeverityBadgeStyle(log.severity) }}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={styles.tdIp}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={styles.paginationRow}>
          <span style={styles.paginationText}>Showing {filteredLogs.length} events</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#0f172a'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    color: '#0f172a',
    letterSpacing: '-0.01em'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  searchInputWrapper: {
    flex: '1.8',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '6px 12px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    width: '100%',
    color: '#1e293b'
  },
  selectWrapper: {
    flex: '1',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  filterSelect: {
    width: '100%',
    padding: '7px 28px 7px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  },
  selectArrow: {
    position: 'absolute',
    right: '10px',
    pointerEvents: 'none'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  kpiCritical: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiLabelRed: { fontSize: '13px', fontWeight: '500', color: '#5f1e1e' },
  kpiNumberRed: { fontSize: '28px', fontWeight: '600', color: '#ef4444' },
  kpiWarning: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiLabelYellow: { fontSize: '13px', fontWeight: '500', color: '#78350f' },
  kpiNumberYellow: { fontSize: '28px', fontWeight: '600', color: '#f59e0b' },
  kpiInfo: {
    backgroundColor: '#eff6ff',
    border: '1px solid #dbeafe',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiLabelBlue: { fontSize: '13px', fontWeight: '500', color: '#1e3a8a' },
  kpiNumberBlue: { fontSize: '28px', fontWeight: '600', color: '#3b82f6' },
  kpiSuccess: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiLabelGreen: { fontSize: '13px', fontWeight: '500', color: '#14532d' },
  kpiNumberGreen: { fontSize: '28px', fontWeight: '600', color: '#10b981' },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#ffffff'
  },
  th: {
    padding: '14px 20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em'
  },
  tdRow: {
    borderBottom: '1px solid #f1f5f9',
    height: '52px'
  },
  tdTime: { padding: '14px 20px', fontSize: '12px', color: '#94a3b8' },
  tdUser: { padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#0f172a' },
  tdAction: { padding: '14px 20px', fontSize: '13px', color: '#334155' },
  td: { padding: '14px 20px' },
  tdBranch: { padding: '14px 20px', fontSize: '13px', color: '#64748b' },
  tdIp: { padding: '14px 20px', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' },
  moduleBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600'
  },
  severityBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'inline-block',
    letterSpacing: '0.04em'
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff'
  },
  paginationText: {
    fontSize: '12px',
    color: '#94a3b8'
  }
};

export default AuditLogs;