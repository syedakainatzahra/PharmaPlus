import React from 'react';
import Navbar from './Navbar';
import { FiPlus } from 'react-icons/fi';

const PatientDirectory = () => {
  const patients = [
    { id: 'P-1001', name: 'Ahmed Siddiqui', cnic: '35201-1234567-1', phone: '0300-1234567', ageSex: '45y / M', lastVisit: '09 Sep 2026', visits: 12 },
    { id: 'P-1002', name: 'Zainab Qureshi', cnic: '35202-9876543-2', phone: '0321-9876543', ageSex: '28y / F', lastVisit: '09 Sep 2026', visits: 3 },
    { id: 'P-1003', name: 'Bilal Chaudhry', cnic: '35203-5678901-3', phone: '0333-5678901', ageSex: '33y / M', lastVisit: '09 Sep 2026', visits: 5 },
    { id: 'P-1004', name: 'Mariam Farooq', cnic: '35201-4567890-4', phone: '0312-4567890', ageSex: '19y / F', lastVisit: '09 Sep 2026', visits: 2 },
    { id: 'P-1005', name: 'Hassan Raza', cnic: '35202-2345678-5', phone: '0311-2345678', ageSex: '62y / M', lastVisit: '09 Sep 2026', visits: 24 },
    { id: 'P-1006', name: 'Sana Ijaz', cnic: '35203-6789012-6', phone: '0345-6789012', ageSex: '41y / F', lastVisit: '07 Sep 2026', visits: 7 },
    { id: 'P-1007', name: 'Fatima Malik', cnic: '35201-7890123-7', phone: '0300-7890123', ageSex: '25y / F', lastVisit: '07 Sep 2026', visits: 4 },
    { id: 'P-1008', name: 'Usman Tariq', cnic: '35202-8901234-8', phone: '0321-8901234', ageSex: '38y / M', lastVisit: '05 Sep 2026', visits: 9 },
    { id: 'P-1009', name: 'Nadia Hussain', cnic: '35203-9012345-9', phone: '0333-9012345', ageSex: '55y / F', lastVisit: '04 Sep 2026', visits: 18 },
    { id: 'P-1010', name: 'Imran Sheikh', cnic: '35201-0123456-0', phone: '0312-0123456', ageSex: '30y / M', lastVisit: '02 Sep 2026', visits: 1 },
    { id: 'P-1011', name: 'Rida Aslam', cnic: '35202-1234560-1', phone: '0311-1234560', ageSex: '22y / F', lastVisit: '01 Sep 2026', visits: 2 },
    { id: 'P-1012', name: 'Tariq Mehmood', cnic: '35203-2345601-2', phone: '0345-2345601', ageSex: '50y / M', lastVisit: '28 Aug 2026', visits: 31 }
  ];

  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Patient Directory" subtitle="12 registered patients" />

      <div style={styles.contentBody}>
        {/* Top Control Bar */}
        <div style={styles.topActionBar}>
          <div style={styles.resultsCount}></div>
          <button style={styles.registerPatientBtn}>
            <FiPlus size={16} /> Register Patient
          </button>
        </div>

        {/* Patients Table Card */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>PATIENT ID</th>
                <th style={styles.th}>NAME</th>
                <th style={styles.th}>CNIC</th>
                <th style={styles.th}>PHONE</th>
                <th style={styles.th}>AGE/SEX</th>
                <th style={styles.th}>LAST VISIT</th>
                <th style={styles.th}>VISITS</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#0d9488' }}>{p.id}</td>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#0f172a' }}>{p.name}</td>
                  <td style={{ ...styles.td, color: '#475569' }}>{p.cnic}</td>
                  <td style={{ ...styles.td, color: '#475569' }}>{p.phone}</td>
                  <td style={styles.td}>{p.ageSex}</td>
                  <td style={{ ...styles.td, color: '#475569' }}>{p.lastVisit}</td>
                  <td style={styles.td}>
                    <span style={styles.visitBadge}>{p.visits}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button style={styles.historyBtn}>History</button>
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
  
  topActionBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
  registerPatientBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

  tableCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '14px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#334155' },
  visitBadge: { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' },
  historyBtn: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default PatientDirectory;