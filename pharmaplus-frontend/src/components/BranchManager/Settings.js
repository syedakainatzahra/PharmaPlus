import React, { useState } from 'react';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';

const Settings = () => {
  const [branchName, setBranchName] = useState('Regional Medical Hub');
  const [branchCode, setBranchCode] = useState('#402');
  const [city, setCity] = useState('Islamabad, Pakistan');
  const [contact, setContact] = useState('+92-51-9871234');

  const [managerName, setManagerName] = useState('Rania Malik');
  const [managerEmail, setManagerEmail] = useState('rania.malik@pharmaplus.pk');
  const [managerRole, setManagerRole] = useState('Branch Manager');

  const [fefoDays, setFefoDays] = useState('30');
  const [lowStock, setLowStock] = useState('50');

  return (
    <div style={styles.contentBody}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSub}>Branch configuration and system preferences</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Branch Profile</h3>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Branch Name</label>
            <input 
              type="text" 
              value={branchName} 
              onChange={(e) => setBranchName(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Branch Code</label>
            <input 
              type="text" 
              value={branchCode} 
              onChange={(e) => setBranchCode(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>City / Region</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact Number</label>
            <input 
              type="text" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              style={styles.input} 
            />
          </div>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.saveBtn}>Save Changes</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Manager Profile</h3>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              value={managerName} 
              onChange={(e) => setManagerName(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              value={managerEmail} 
              onChange={(e) => setManagerEmail(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <input 
              type="text" 
              value={managerRole} 
              onChange={(e) => setManagerRole(e.target.value)} 
              style={styles.input} 
            />
          </div>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.saveBtn}>Save Changes</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Notifications</h3>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>FEFO Expiry Alerts (days ahead)</label>
            <input 
              type="text" 
              value={fefoDays} 
              onChange={(e) => setFefoDays(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Low Stock Threshold (units)</label>
            <input 
              type="text" 
              value={lowStock} 
              onChange={(e) => setLowStock(e.target.value)} 
              style={styles.input} 
            />
          </div>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.saveBtn}>Save Changes</button>
        </div>
      </div>

      <div style={styles.dangerCard}>
        <h3 style={styles.dangerTitle}>Danger Zone</h3>
        <p style={styles.dangerSub}>These actions are irreversible. Proceed with caution.</p>
        <button style={styles.dangerBtn}>Reset Branch Data</button>
      </div>
    </div>
  );
};

const styles = {
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 },
  
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#64748b' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none', backgroundColor: '#ffffff' },
  
  btnRow: { display: 'flex', justifyContent: 'flex-end', marginTop: '4px' },
  saveBtn: { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  dangerCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fecaca', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' },
  dangerTitle: { fontSize: '14px', fontWeight: '700', color: '#ef4444', margin: 0 },
  dangerSub: { fontSize: '12px', color: '#64748b', margin: 0 },
  dangerBtn: { backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }
};

export default Settings;