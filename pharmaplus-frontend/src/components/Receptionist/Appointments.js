import React, { useState } from 'react';
import Navbar from './Navbar';
import { FiPlus } from 'react-icons/fi';

const Appointments = () => {
  const [viewMode, setViewMode] = useState('Week');
  const [selectedDay, setSelectedDay] = useState('Wed 09 Today');

  const days = [
    { label: 'Mon 07', key: 'Mon 07' },
    { label: 'Tue 08', key: 'Tue 08' },
    { label: 'Wed 09 Today', key: 'Wed 09 Today' },
    { label: 'Thu 10', key: 'Thu 10' },
    { label: 'Fri 11', key: 'Fri 11' },
    { label: 'Sat 12', key: 'Sat 12' }
  ];

  const doctors = [
    { name: 'Dr. Sara Ahmed', specialty: 'General Physician' },
    { name: 'Dr. Aris Khan', specialty: 'Pediatrics' },
    { name: 'Dr. Kamran Butt', specialty: 'General Physician' },
    { name: 'Dr. Layla Noor', specialty: 'General Physician' }
  ];

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30'];

  const appointmentsData = [
    { doctorIndex: 0, time: '09:00', name: 'Ahmed Siddiqui', desc: 'Follow-up BP', type: 'Appointment', bg: '#f0fdf4', border: '#22c55e', tagBg: '#dcfce7', tagColor: '#16a34a' },
    { doctorIndex: 0, time: '10:00', name: 'Bilal Chaudhry', desc: 'Chest pain — urgent', type: 'Walk-in', bg: '#fef2f2', border: '#ef4444', tagBg: '#fef08a', tagColor: '#854d0e' },
    { doctorIndex: 0, time: '14:00', name: 'Sana Ijaz', desc: '', type: 'Appointment', bg: '#f0fdf4', border: '#22c55e', tagBg: '#dcfce7', tagColor: '#16a34a' },
    { doctorIndex: 1, time: '09:30', name: 'Zainab Qureshi', desc: 'Child vaccination', type: 'Appointment', bg: '#f5f3ff', border: '#8b5cf6', tagBg: '#ede9fe', tagColor: '#7c3aed' },
    { doctorIndex: 2, time: '10:30', name: 'Mariam Farooq', desc: '', type: 'Appointment', bg: '#fffbeb', border: '#f59e0b', tagBg: '#fef3c7', tagColor: '#d97706' },
    { doctorIndex: 3, time: '11:00', name: 'Hassan Raza', desc: 'Diabetes review', type: 'Appointment', bg: '#f0fdf4', border: '#22c55e', tagBg: '#dcfce7', tagColor: '#16a34a' },
  ];

  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Appointments" subtitle="Week of 07–12 Sep 2026" />

      <div style={styles.contentBody}>
        {/* Top Control Bar */}
        <div style={styles.topControlBar}>
          <div style={styles.daySelectorContainer}>
            {days.map(d => (
              <button 
                key={d.key} 
                style={{ ...styles.dayBtn, ...(selectedDay === d.key ? styles.dayBtnActive : {}) }}
                onClick={() => setSelectedDay(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div style={styles.rightControls}>
            <div style={styles.viewToggle}>
              <button 
                style={{ ...styles.toggleBtn, ...(viewMode === 'Day' ? styles.toggleBtnActive : {}) }}
                onClick={() => setViewMode('Day')}
              >
                Day
              </button>
              <button 
                style={{ ...styles.toggleBtn, ...(viewMode === 'Week' ? styles.toggleBtnActive : {}) }}
                onClick={() => setViewMode('Week')}
              >
                Week
              </button>
            </div>
            <button style={styles.bookSlotBtn}>
              <FiPlus size={16} /> Book Slot
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div style={styles.scheduleCard}>
          {/* Doctors Header Row */}
          <div style={styles.gridHeaderRow}>
            <div style={styles.timeColumnHeader}></div>
            {doctors.map((doc, idx) => (
              <div key={idx} style={styles.docHeaderCell}>
                <p style={styles.docNameHeader}>{doc.name}</p>
                <p style={styles.docSubHeader}>{doc.specialty}</p>
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          {timeSlots.map((time, tIdx) => (
            <div key={tIdx} style={styles.gridRow}>
              <div style={styles.timeLabelCell}>{time}</div>
              {doctors.map((_, dIdx) => {
                const matchedAppt = appointmentsData.find(a => a.doctorIndex === dIdx && a.time === time);
                return (
                  <div key={dIdx} style={styles.gridCell}>
                    {matchedAppt && (
                      <div style={{ ...styles.apptCard, backgroundColor: matchedAppt.bg, borderLeft: `4px solid ${matchedAppt.border}` }}>
                        <p style={styles.apptPatientName}>{matchedAppt.name}</p>
                        {matchedAppt.desc && <p style={styles.apptDesc}>{matchedAppt.desc}</p>}
                        <span style={{ ...styles.apptTypeTag, backgroundColor: matchedAppt.tagBg, color: matchedAppt.tagColor }}>
                          {matchedAppt.type}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  
  topControlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  daySelectorContainer: { display: 'flex', gap: '8px' },
  dayBtn: { border: '1px solid #cbd5e1', backgroundColor: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' },
  dayBtnActive: { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' },
  
  rightControls: { display: 'flex', alignItems: 'center', gap: '12px' },
  viewToggle: { display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' },
  toggleBtn: { border: 'none', backgroundColor: 'transparent', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' },
  toggleBtnActive: { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  bookSlotBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },

  scheduleCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  gridHeaderRow: { display: 'grid', gridTemplateColumns: '80px repeat(4, 1fr)', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  timeColumnHeader: { borderRight: '1px solid #e2e8f0' },
  docHeaderCell: { padding: '12px 16px', borderRight: '1px solid #e2e8f0' },
  docNameHeader: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  docSubHeader: { fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' },

  gridRow: { display: 'grid', gridTemplateColumns: '80px repeat(4, 1fr)', borderBottom: '1px solid #f1f5f9', minHeight: '65px' },
  timeLabelCell: { padding: '10px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  gridCell: { borderRight: '1px solid #f1f5f9', padding: '6px', position: 'relative' },

  apptCard: { padding: '8px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '3px', height: '100%', boxSizing: 'border-box' },
  apptPatientName: { fontSize: '12px', fontWeight: '700', color: '#0f172a', margin: 0 },
  apptDesc: { fontSize: '11px', color: '#64748b', margin: 0 },
  apptTypeTag: { fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start', marginTop: '2px' }
};

export default Appointments;