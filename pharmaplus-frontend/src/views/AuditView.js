import React, { useState, useEffect } from 'react';

const AuditView = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Audit Logs matching Screen 6 UI
    setLogs([
      { id: 'LOG-8821', user: 'Super Admin', action: 'ROLE_UPDATE', details: 'Updated user Aiden Clarke from CUSTOMER → PHARMACIST', ip: '192.168.1.10', time: '2 min ago', status: 'SUCCESS' },
      { id: 'LOG-8820', user: 'Dr. Sarah Mitchell', action: 'STOCK_ADD', details: 'Added 1,250 units to Batch #BTH-240501 (Paracetamol 500mg)', ip: '10.0.1.47', time: '14 min ago', status: 'SUCCESS' },
      { id: 'LOG-8819', user: 'System Worker', action: 'EXPIRY_ALERT', details: 'Automated FEFO trigger: Cetirizine 10mg entering 30-day expiry window', ip: 'SERVER_LOCAL', time: '1 hr ago', status: 'WARNING' },
      { id: 'LOG-8818', user: 'Aiden Clarke', action: 'DISPATCH_CREATE', details: 'Dispatched 500 units to Branch 2 (Lahore Branch)', ip: '192.168.1.15', time: '3 hrs ago', status: 'SUCCESS' },
      { id: 'LOG-8817', user: 'Unknown User', action: 'AUTH_FAILED', details: 'Failed login attempt with email admin@badrequest.com', ip: '185.220.101.5', time: '5 hrs ago', status: 'CRITICAL' },
    ]);

    // Mock Users for RBAC Panel
    setUsers([
      { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@pharmaplus.com', role: 'PHARMACIST', status: 'ACTIVE' },
      { id: 2, name: 'Aiden Clarke', email: 'aiden@pharmaplus.com', role: 'WAREHOUSE_MANAGER', status: 'ACTIVE' },
      { id: 3, name: 'Super Admin', email: 'admin@pharmaplus.com', role: 'SUPER_ADMIN', status: 'ACTIVE' },
      { id: 4, name: 'Priya Nair', email: 'priya@pharmaplus.com', role: 'CUSTOMER', status: 'INACTIVE' },
    ]);

    setLoading(false);
  }, []);

  const getLogStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return { bg: '#C6F6D5', color: '#22543D' };
      case 'WARNING':
        return { bg: '#FEEBC8', color: '#9C4221' };
      case 'CRITICAL':
        return { bg: '#FED7D7', color: '#9B2C2C' };
      default:
        return { bg: '#EDF2F7', color: '#4A5568' };
    }
  };

  return (
    <div style={styles.container}>
      {/* ⚖️ 1. System Audit Trail Logs Table */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={styles.cardTitle}>System Audit Trail</h3>
          <button style={styles.exportBtn}>📥 Export Audit CSV</button>
        </div>

        {loading ? (
          <div>Loading system audit logs... ⏳</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>LOG ID</th>
                <th style={styles.th}>PERFORMED BY</th>
                <th style={styles.th}>ACTION TYPE</th>
                <th style={styles.th}>DETAILS / DESCRIPTION</th>
                <th style={styles.th}>IP ADDRESS</th>
                <th style={styles.th}>TIMESTAMP</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => {
                const badge = getLogStatusBadge(item.status);
                return (
                  <tr key={item.id} style={styles.tdRow}>
                    <td style={styles.td}><code>{item.id}</code></td>
                    <td style={styles.td}><strong>{item.user}</strong></td>
                    <td style={styles.td}>
                      <span style={styles.actionTag}>{item.action}</span>
                    </td>
                    <td style={styles.td}>{item.details}</td>
                    <td style={styles.td}><code>{item.ip}</code></td>
                    <td style={styles.td}>{item.time}</td>
                    <td style={styles.td}>
                      <span style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        ● {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 👥 2. User Role & Access Control Management */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Accounts & Access Control (RBAC)</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>USER NAME</th>
              <th style={styles.th}>EMAIL</th>
              <th style={styles.th}>CURRENT ROLE</th>
              <th style={styles.th}>ACCOUNT STATUS</th>
              <th style={styles.th}>MANAGE ROLE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.tdRow}>
                <td style={styles.td}><strong>{u.name}</strong></td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={styles.roleBadge}>{u.role}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: u.status === 'ACTIVE' ? '#38A169' : '#E53E3E', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    ● {u.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <select style={styles.roleSelect} defaultValue={u.role}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🎨 Styling
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: 0, fontSize: '1.1rem', color: '#2D3748' },
  exportBtn: { backgroundColor: '#E2E8F0', color: '#2D3748', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  thRow: { borderBottom: '2px solid #E2E8F0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' },
  tdRow: { borderBottom: '1px solid #EDF2F7' },
  td: { padding: '12px 10px', fontSize: '0.85rem', color: '#2D3748' },
  actionTag: { backgroundColor: '#EDF2F7', color: '#2B6CB0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  roleBadge: { backgroundColor: '#E6FFFA', color: '#234E52', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  roleSelect: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E0', fontSize: '0.8rem' }
};

export default AuditView;