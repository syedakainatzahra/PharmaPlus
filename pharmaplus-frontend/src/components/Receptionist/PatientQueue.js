import React, { useState } from 'react';
import Navbar from './Navbar';
import { FiSearch, FiVolume2, FiEye } from 'react-icons/fi';

const PatientQueue = () => {
  const [activeTab, setActiveTab] = useState('All');

  const patients = [
    { token: '#T-101', name: 'Ahmed Siddiqui', ageSex: '45y / M', doctor: 'Dr. Sara Ahmed', priority: 'NORMAL', waitTime: '52 min', status: 'Completed', dotColor: '#22c55e', bgBadge: '#dcfce7', textBadge: '#16a34a' },
    { token: '#T-102', name: 'Zainab Qureshi', ageSex: '28y / F', doctor: 'Dr. Aris Khan', priority: 'NORMAL', waitTime: '48 min', status: 'Completed', dotColor: '#22c55e', bgBadge: '#dcfce7', textBadge: '#16a34a' },
    { token: '#T-103', name: 'Bilal Chaudhry', ageSex: '33y / M', doctor: 'Dr. Sara Ahmed', priority: 'EMERGENCY', waitTime: '35 min', status: 'In Consultation', dotColor: '#2563eb', bgBadge: '#dbeafe', textBadge: '#2563eb' },
    { token: '#T-104', name: 'Mariam Farooq', ageSex: '19y / F', doctor: 'Dr. Kamran Butt', priority: 'NORMAL', waitTime: '22 min', status: 'In Consultation', dotColor: '#2563eb', bgBadge: '#dbeafe', textBadge: '#2563eb' },
    { token: '#T-105', name: 'Hassan Raza', ageSex: '62y / M', doctor: 'Dr. Layla Noor', priority: 'NORMAL', waitTime: '18 min', status: 'Waiting', dotColor: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#d97706', showCall: true },
    { token: '#T-106', name: 'Sana Ijaz', ageSex: '41y / F', doctor: 'Dr. Sara Ahmed', priority: 'NORMAL', waitTime: '12 min', status: 'Waiting', dotColor: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#d97706', showCall: true },
    { token: '#T-107', name: 'Fatima Malik', ageSex: '25y / F', doctor: 'Dr. Sara Ahmed', priority: 'NORMAL', waitTime: '4 min', status: 'Waiting', dotColor: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#d97706', showCall: true },
    { token: '#T-108', name: 'Usman Tariq', ageSex: '38y / M', doctor: 'Dr. Aris Khan', priority: 'EMERGENCY', waitTime: '2 min', status: 'Waiting', dotColor: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#d97706', showCall: true },
    { token: '#T-109', name: 'Nadia Hussain', ageSex: '55y / F', doctor: 'Dr. Sara Ahmed', priority: 'NORMAL', waitTime: '—', status: 'Waiting', dotColor: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#d97706', showCall: true },
    { token: '#T-110', name: 'Imran Sheikh', ageSex: '30y / M', doctor: 'Dr. Kamran Butt', priority: 'NORMAL', waitTime: '—', status: 'Cancelled', dotColor: '#94a3b8', bgBadge: '#f1f5f9', textBadge: '#64748b' }
  ];

  const filteredPatients = patients.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Waiting (5)' && p.status === 'Waiting') return true;
    if (activeTab === 'In Consultation (2)' && p.status === 'In Consultation') return true;
    if (activeTab === 'Completed (2)' && p.status === 'Completed') return true;
    if (activeTab === 'Cancelled (1)' && p.status === 'Cancelled') return true;
    return false;
  });

  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Patient Queue" subtitle="5 patients waiting" />

      <div style={styles.contentBody}>
        {/* Top Action Bar */}
        <div style={styles.topActionBar}>
          <div style={styles.tabsContainer}>
            {['All', 'Waiting (5)', 'In Consultation (2)', 'Completed (2)', 'Cancelled (1)'].map(tab => (
              <button 
                key={tab} 
                style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <button style={styles.callNextBtn}>
            <FiVolume2 size={16} /> Call Next Patient
          </button>
        </div>

        {/* Patients Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>TOKEN</th>
                <th style={styles.th}>PATIENT</th>
                <th style={styles.th}>AGE / SEX</th>
                <th style={styles.th}>DOCTOR</th>
                <th style={styles.th}>PRIORITY</th>
                <th style={styles.th}>WAIT TIME</th>
                <th style={styles.th}>STATUS</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={{ ...styles.td, fontWeight: '800', color: '#2563eb' }}>{p.token}</td>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#0f172a' }}>{p.name}</td>
                  <td style={styles.td}>{p.ageSex}</td>
                  <td style={styles.td}>{p.doctor}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.priorityBadge, 
                      backgroundColor: p.priority === 'EMERGENCY' ? '#fee2e2' : '#f1f5f9',
                      color: p.priority === 'EMERGENCY' ? '#ef4444' : '#475569'
                    }}>
                      {p.priority}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#64748b' }}>{p.waitTime}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, backgroundColor: p.bgBadge, color: p.textBadge }}>
                      <span style={{ ...styles.statusDot, backgroundColor: p.dotColor }}></span>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actionCell}>
                      <button style={styles.viewBtn}>View</button>
                      {p.showCall && <button style={styles.callBtn}>Call</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  
  topActionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tabsContainer: { display: 'flex', gap: '8px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '10px' },
  tabBtn: { border: 'none', backgroundColor: 'transparent', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' },
  tabBtnActive: { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  callNextBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

  tableCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#334155' },
  priorityBadge: { fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  actionCell: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  viewBtn: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  callBtn: { backgroundColor: '#0d9488', border: 'none', color: '#ffffff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }
};

export default PatientQueue;