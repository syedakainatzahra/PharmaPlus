import React, { useState } from 'react';

const DoctorView = ({ user }) => {
  const [appointments, setAppointments] = useState([
    { id: 'APT-101', patientName: 'Ali Raza', time: '10:30 AM', date: 'Today', status: 'CONFIRMED', symptoms: 'Fever & Headaches' },
    { id: 'APT-102', patientName: 'Sana Ahmed', time: '11:15 AM', date: 'Today', status: 'PENDING', symptoms: 'Skin Allergy' },
    { id: 'APT-103', patientName: 'Usman Khan', time: '02:00 PM', date: 'Today', status: 'COMPLETED', symptoms: 'Flu & Cough' }
  ]);

  const [prescription, setPrescription] = useState({ patientName: '', medicine: '', dosage: '', notes: '' });

  return (
    <div style={styles.container}>
      {/* 📋 Doctor Appointments List */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>👨‍⚕️ Today's Patient Appointments</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>APT ID</th>
              <th style={styles.th}>PATIENT NAME</th>
              <th style={styles.th}>TIME & DATE</th>
              <th style={styles.th}>SYMPTOMS</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} style={styles.tdRow}>
                <td style={styles.td}><code>{apt.id}</code></td>
                <td style={styles.td}><strong>{apt.patientName}</strong></td>
                <td style={styles.td}>{apt.time} ({apt.date})</td>
                <td style={styles.td}>{apt.symptoms}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: apt.status === 'CONFIRMED' ? '#C6F6D5' : apt.status === 'COMPLETED' ? '#E2E8F0' : '#FEEBC8',
                    color: apt.status === 'CONFIRMED' ? '#22543D' : apt.status === 'COMPLETED' ? '#2D3748' : '#9C4221'
                  }}>
                    ● {apt.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => setPrescription({ ...prescription, patientName: apt.patientName })}>
                    📝 Write E-Prescription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💊 Digital Prescription Writer */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>✍️ Generate E-Prescription (Sent directly to Pharmacy)</h3>
        <form style={styles.formGrid} onSubmit={(e) => { e.preventDefault(); alert('Prescription sent to Pharmacy Stock system!'); }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Patient Name</label>
            <input type="text" style={styles.input} value={prescription.patientName} onChange={e => setPrescription({...prescription, patientName: e.target.value})} placeholder="Select or type patient name" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Prescribe Medicine</label>
            <input type="text" style={styles.input} placeholder="e.g. Paracetamol 500mg" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Dosage / Frequency</label>
            <input type="text" style={styles.input} placeholder="e.g. 1 Tablet after breakfast (1-0-1)" required />
          </div>

          <button type="submit" style={styles.submitBtn}>
            🚀 Send Prescription to Pharmacy
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: '0 0 15px 0', fontSize: '1.1rem', color: '#2D3748' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { borderBottom: '2px solid #E2E8F0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' },
  tdRow: { borderBottom: '1px solid #EDF2F7' },
  td: { padding: '12px 10px', fontSize: '0.85rem', color: '#2D3748' },
  actionBtn: { backgroundColor: '#319795', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '15px', alignItems: 'end' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.78rem', fontWeight: 'bold', color: '#4A5568' },
  input: { padding: '8px 10px', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' },
  submitBtn: { backgroundColor: '#0F4C81', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
};

export default DoctorView;