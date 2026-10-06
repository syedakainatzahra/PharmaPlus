import React, { useState } from 'react';
const BillingSubscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [invoices] = useState([
    { id: 'INV-2026-1052', branch: 'Islamabad Main', customer: 'Dr. Ahmed Khan', amount: 'PKR 84,500', status: 'Paid', dueDate: 'Aug 15, 2026' },
    { id: 'INV-2026-1051', branch: 'Lahore Central', customer: 'Pharmacy Wholesale Ltd.', amount: 'PKR 212,000', status: 'Pending', dueDate: 'Aug 22, 2026' },
    { id: 'INV-2026-1050', branch: 'Rawalpindi', customer: 'MedSupply Co.', amount: 'PKR 67,300', status: 'Overdue', dueDate: 'Aug 10, 2026' },
    { id: 'INV-2026-1049', branch: 'Karachi DHA', customer: 'HealthCare Distributors', amount: 'PKR 134,000', status: 'Paid', dueDate: 'Aug 8, 2026' },
    { id: 'INV-2026-1048', branch: 'Faisalabad', customer: 'Ali Medical Stores', amount: 'PKR 45,900', status: 'Cancelled', dueDate: 'Jul 30, 2026' },
    { id: 'INV-2026-1047', branch: 'Islamabad Main', customer: 'National Hospital', amount: 'PKR 389,000', status: 'Paid', dueDate: 'Aug 5, 2026' }
  ]);

  // Filter Logic
  const filteredInvoices = invoices.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Paid':
        return { backgroundColor: '#e6f4ea', color: '#137333' };
      case 'Pending':
        return { backgroundColor: '#fef7e0', color: '#b06000' };
      case 'Overdue':
        return { backgroundColor: '#fce8e6', color: '#c5221f' };
      case 'Cancelled':
        return { backgroundColor: '#f1f3f4', color: '#5f6368' };
      default:
        return { backgroundColor: '#f1f3f4', color: '#5f6368' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Billing & Subscriptions</h1>
          <p style={styles.pageSubtitle}>
            Network-wide financial administration and invoice management.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.exportBtn}>Export Financial Report</button>
          <button style={styles.createInvoiceBtn}>+ Create Invoice</button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>NETWORK SALES</div>
          <div style={styles.kpiValue}>PKR 48.6M</div>
          <div style={styles.kpiSubGreen}>↑ 12.8%</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>OUTSTANDING INVOICES</div>
          <div style={styles.kpiValue}>PKR 4.2M</div>
          <div style={styles.kpiSubGray}>12 invoices</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>TOTAL EXPENSES</div>
          <div style={styles.kpiValue}>PKR 19.8M</div>
          <div style={styles.kpiSubRed}>↑ 3.2%</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>NET PROFIT</div>
          <div style={styles.kpiValue}>PKR 28.8M</div>
          <div style={styles.kpiSubGreen}>↑ 19.1%</div>
        </div>
      </div>

      {/* Revenue Trend Chart Card */}
      <div style={styles.chartCard}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Revenue Trend</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Monthly network-wide revenue — PKR millions</span>
        </div>

        {/* Visual Simulated SVG Chart */}
        <div style={{ position: 'relative', width: '100%', height: '140px', marginTop: '10px' }}>
          <svg viewBox="0 0 800 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="800" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="50" x2="800" y2="50" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />

            {/* Gradient Fill */}
            <path
              d="M 0 60 Q 200 45, 400 35 T 800 15 L 800 110 L 0 110 Z"
              fill="url(#chartGradient)"
            />
            {/* Trend Line */}
            <path
              d="M 0 60 Q 200 45, 400 35 T 800 15"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
          </svg>

          {/* X-Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div style={styles.tableCard}>
        {/* Table Header & Search */}
        <div style={styles.tableHeaderRow}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Invoices</h3>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>INVOICE ID</th>
              <th style={styles.th}>BRANCH</th>
              <th style={styles.th}>CUSTOMER</th>
              <th style={styles.th}>AMOUNT</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>DUE DATE</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((item) => (
              <tr key={item.id} style={styles.tdRow}>
                <td style={{ ...styles.td, color: '#1e3a8a', fontWeight: '600', fontSize: '13px' }}>{item.id}</td>
                <td style={{ ...styles.td, color: '#334155', fontSize: '13px' }}>{item.branch}</td>
                <td style={{ ...styles.td, color: '#0f172a', fontWeight: '500', fontSize: '13px' }}>{item.customer}</td>
                <td style={{ ...styles.td, color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{item.amount}</td>

                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(item.status) }}>
                    {item.status}
                  </span>
                </td>

                <td style={{ ...styles.td, color: '#64748b', fontSize: '13px' }}>{item.dueDate}</td>

                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.actionBtn}>View</button>
                    <button style={styles.actionBtn}>Download</button>
                  </div>
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
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  exportBtn: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    padding: '9px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  createInvoiceBtn: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
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
    padding: '20px'
  },
  kpiLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em'
  },
  kpiValue: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '8px 0 6px 0'
  },
  kpiSubGreen: { fontSize: '12px', color: '#16a34a', fontWeight: '600' },
  kpiSubRed: { fontSize: '12px', color: '#dc2626', fontWeight: '600' },
  kpiSubGray: { fontSize: '12px', color: '#64748b' },

  chartCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px'
  },

  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  tableHeaderRow: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f1f5f9'
  },
  searchInputWrapper: {
    width: '260px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 12px'
  },
  searchIcon: {
    fontSize: '12px',
    marginRight: '8px',
    color: '#94a3b8'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    width: '100%',
    color: '#0f172a'
  },
  filterSelect: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '12px 20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em'
  },
  tdRow: {
    borderBottom: '1px solid #f1f5f9',
    height: '52px'
  },
  td: {
    padding: '12px 20px',
    verticalAlign: 'middle'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  actionBtn: {
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer'
  }
};

export default BillingSubscriptions;