import React from 'react';

const ProfileView = ({ user }) => {
  const permissions = [
    { module: 'User Management', read: false, write: false, delete: false, admin: false },
    { module: 'FEFO Inventory', read: true, write: true, delete: false, admin: false },
    { module: 'Warehouse Ops', read: true, write: false, delete: false, admin: false },
    { module: 'Audit Trail', read: false, write: false, delete: false, admin: false },
    { module: 'Reports & Analytics', read: true, write: false, delete: false, admin: false },
    { module: 'Batch Management', read: true, write: true, delete: false, admin: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* User Card */}
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={styles.avatarLarge}>SM</div>
            <h3 style={{ margin: '10px 0 5px 0' }}>{user?.fullName || 'Dr. Sarah Mitchell'}</h3>
            <span style={styles.roleBadge}>{user?.role || 'PHARMACIST'}</span>
          </div>

          <div style={styles.infoLine}>
            <span>Full Name</span>
            <strong>{user?.fullName || 'Dr. Sarah Mitchell'}</strong>
          </div>
          <div style={styles.infoLine}>
            <span>Email</span>
            <strong>{user?.email || 'sarah@pharmaplus.com'}</strong>
          </div>
          <div style={styles.infoLine}>
            <span>Member Since</span>
            <strong>Jan 8, 2026</strong>
          </div>
        </div>

        {/* Session Stats */}
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Active Session</h3>
          <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F7FAFC', padding: '15px', borderRadius: '8px' }}>
            <div>Login Time: <strong>Aug 6, 2026 · 08:42 AM</strong></div>
            <div>IP Address: <strong>10.0.1.47</strong></div>
          </div>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#C6F6D5', color: '#22543D', borderRadius: '6px', fontSize: '0.85rem' }}>
            ✔ Session is secure · MFA verified · Last activity 3 min ago
          </div>
        </div>
      </div>

      {/* RBAC Permission Table */}
      <div style={styles.card}>
        <h3>Role-Based Access Permissions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '10px' }}>FEATURE MODULE</th>
              <th style={{ padding: '10px' }}>READ</th>
              <th style={{ padding: '10px' }}>WRITE</th>
              <th style={{ padding: '10px' }}>DELETE</th>
              <th style={{ padding: '10px' }}>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                <td style={{ padding: '12px 10px' }}>{p.module}</td>
                <td style={{ padding: '10px' }}>{p.read ? '✅' : '❌'}</td>
                <td style={{ padding: '10px' }}>{p.write ? '✅' : '❌'}</td>
                <td style={{ padding: '10px' }}>{p.delete ? '✅' : '❌'}</td>
                <td style={{ padding: '10px' }}>{p.admin ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  avatarLarge: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#319795', color: '#FFF', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' },
  roleBadge: { backgroundColor: '#E6FFFA', color: '#234E52', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' },
  infoLine: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F7FAFC', fontSize: '0.85rem' }
};

export default ProfileView;