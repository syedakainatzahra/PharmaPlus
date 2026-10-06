import React, { useState } from 'react';
import { FiPhone, FiMail, FiClock, FiCalendar } from 'react-icons/fi';

const DoctorPage = () => {
  const [activeTab, setActiveTab] = useState('today');

  const consultations = [
    { id: 'C-0481', patient: 'Fatima Noor', age: 34, time: '09:00', type: 'General Checkup', duration: '25 min', status: 'In Progress' },
    { id: 'C-0482', patient: 'Imran Siddiqui', age: 52, time: '09:30', type: 'Follow-Up (Hypertension)', duration: '—', status: 'Waiting' },
    { id: 'C-0483', patient: 'Samina Tariq', age: 28, time: '10:00', type: 'Prescription Renewal', duration: '—', status: 'Waiting' },
    { id: 'C-0484', patient: 'Khalid Mir', age: 67, time: '10:30', type: 'Diabetes Review', duration: '—', status: 'Scheduled' },
  ];

  return (
    <div style={styles.contentBody}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Branch Doctor</h1>
        <p style={styles.pageSub}>Resident physician profile, consultation log, and schedule</p>
      </div>

      <div style={styles.doctorProfileCard}>
        <div style={styles.doctorLeftSection}>
          <div style={styles.doctorAvatarContainer}>
            <div style={styles.doctorAvatar}>AK</div>
            <span style={styles.onlineDot}></span>
          </div>
          <div style={styles.doctorDetails}>
            <h2 style={styles.doctorName}>Dr. Ayesha Khan</h2>
            <p style={styles.doctorDegree}>MBBS, FCPS (Internal Medicine)</p>
            <div style={styles.tagRow}>
              <span style={styles.doctorTag}>Internal Medicine</span>
              <span style={styles.doctorTag}>Diabetes Care</span>
              <span style={styles.doctorTag}>Hypertension</span>
              <span style={styles.doctorTag}>General Practice</span>
            </div>
            <div style={styles.doctorContactRow}>
              <span style={styles.contactItem}><FiPhone size={13} color="#64748b" /> +92-300-8877665</span>
              <span style={styles.contactItem}><FiMail size={13} color="#64748b" /> dr.ayesha.khan@pharmaplus.pk</span>
            </div>
          </div>
        </div>

        <div style={styles.doctorStatsContainer}>
          <div style={styles.docStatBox}>
            <span style={styles.docStatNum}>8</span>
            <span style={styles.docStatLabel}>Today's Patients</span>
          </div>
          <div style={styles.docStatBox}>
            <span style={styles.docStatNum}>3</span>
            <span style={styles.docStatLabel}>Completed</span>
          </div>
          <div style={styles.docStatBox}>
            <span style={styles.docStatNum}>1</span>
            <span style={styles.docStatLabel}>Active Now</span>
          </div>
          <div style={styles.docStatBox}>
            <span style={styles.docStatNum}>2</span>
            <span style={styles.docStatLabel}>Waiting</span>
          </div>
        </div>
      </div>

      <div style={styles.docInfoGrid}>
        <div style={styles.docInfoCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FiClock size={18} />
          </div>
          <div>
            <span style={styles.docInfoTitle}>Clinic Hours</span>
            <p style={styles.docInfoValue}>09:00 AM – 02:00 PM</p>
          </div>
        </div>

        <div style={styles.docInfoCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FiCalendar size={18} />
          </div>
          <div>
            <span style={styles.docInfoTitle}>Days On-Site</span>
            <p style={styles.docInfoValue}>Mon · Wed · Thu · Sat</p>
          </div>
        </div>

        <div style={styles.docInfoCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FiClock size={18} />
          </div>
          <div>
            <span style={styles.docInfoTitle}>Avg. Consultation</span>
            <p style={styles.docInfoValue}>22 minutes</p>
          </div>
        </div>
      </div>

      <div style={styles.logSectionCard}>
        <div style={styles.logHeaderRow}>
          <h3 style={styles.sectionTitle}>Consultation Log — Sep 8, 2026</h3>
          <div style={styles.tabToggleRow}>
            <button 
              style={{
                ...styles.tabBtn, 
                ...(activeTab === 'today' ? styles.tabBtnActive : styles.tabBtnInactive)
              }}
              onClick={() => setActiveTab('today')}
            >
              Today
            </button>
            <button 
              style={{
                ...styles.tabBtn, 
                ...(activeTab === 'weekly' ? styles.tabBtnActive : styles.tabBtnInactive)
              }}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly Schedule
            </button>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>CONSULT ID</th>
                <th style={styles.th}>PATIENT</th>
                <th style={styles.th}>TIME</th>
                <th style={styles.th}>TYPE</th>
                <th style={styles.th}>DURATION</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.consultIdLink}>{item.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div>
                      <p style={styles.patientName}>{item.patient}</p>
                      <span style={styles.patientAge}>Age {item.age}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.timeText}>{item.time}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeText}>{item.type}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.durationText}>{item.duration}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.consultStatusBadge,
                      backgroundColor: item.status === 'In Progress' ? '#eff6ff' : item.status === 'Waiting' ? '#fffbeb' : '#f8fafc',
                      color: item.status === 'In Progress' ? '#2563eb' : item.status === 'Waiting' ? '#d97706' : '#64748b'
                    }}>
                      {item.status}
                    </span>
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
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  iconBox: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '0.05em' },
  tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' },
  doctorProfileCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  doctorLeftSection: { display: 'flex', gap: '20px', alignItems: 'center' },
  doctorAvatarContainer: { position: 'relative' },
  doctorAvatar: { width: '72px', height: '72px', borderRadius: '16px', backgroundColor: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' },
  onlineDot: { position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', backgroundColor: '#10b981', border: '2px solid #ffffff', borderRadius: '50%' },
  doctorDetails: { display: 'flex', flexDirection: 'column', gap: '6px' },
  doctorName: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 },
  doctorDegree: { fontSize: '13px', fontWeight: '600', color: '#2563eb', margin: 0 },
  tagRow: { display: 'flex', gap: '6px', margin: '2px 0' },
  doctorTag: { fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px' },
  doctorContactRow: { display: 'flex', gap: '16px', marginTop: '4px' },
  doctorStatsContainer: { display: 'flex', gap: '12px' },
  docStatBox: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' },
  docStatNum: { fontSize: '20px', fontWeight: '800', color: '#0f172a' },
  docStatLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b', textAlign: 'center', marginTop: '2px' },
  docInfoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  docInfoCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' },
  docInfoTitle: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', margin: 0 },
  docInfoValue: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '2px 0 0 0' },
  logSectionCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  logHeaderRow: { padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' },
  tabToggleRow: { display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '4px' },
  tabBtn: { border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
  tabBtnActive: { backgroundColor: '#2563eb', color: '#fff' },
  tabBtnInactive: { backgroundColor: 'transparent', color: '#64748b' },
  consultIdLink: { fontSize: '13px', fontWeight: '700', color: '#2563eb', cursor: 'pointer' },
  patientName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  patientAge: { fontSize: '11px', color: '#94a3b8' },
  timeText: { fontSize: '13px', color: '#334155', fontWeight: '600' },
  typeText: { fontSize: '13px', color: '#334155', fontWeight: '500' },
  durationText: { fontSize: '13px', color: '#64748b' },
  consultStatusBadge: { display: 'inline-flex', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }
};

export default DoctorPage;