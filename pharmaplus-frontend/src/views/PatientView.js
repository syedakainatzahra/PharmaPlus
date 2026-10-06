import React, { useState } from 'react';

const PatientView = ({ user }) => {
  const doctors = [
    { id: 1, name: 'Dr. Sarah Mitchell', specialty: 'General Physician & Pharmacologist', fee: '1500 PKR', timings: '10:00 AM - 04:00 PM' },
    { id: 2, name: 'Dr. Bilal Ahmed', specialty: 'Dermatologist', fee: '2000 PKR', timings: '02:00 PM - 08:00 PM' }
  ];

  const [booking, setBooking] = useState({ doctorId: '', date: '', timeSlot: '' });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🩺 Book Physical Appointment at Clinic</h3>
        <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '20px' }}>
          Select a doctor to visit our attached clinic branch for a physical checkup.
        </p>

        <div style={styles.doctorGrid}>
          {doctors.map(doc => (
            <div key={doc.id} style={styles.docCard}>
              <div style={styles.avatar}>🩺</div>
              <h4 style={{ margin: '5px 0' }}>{doc.name}</h4>
              <p style={{ fontSize: '0.8rem', color: '#4A5568', margin: '2px 0' }}>{doc.specialty}</p>
              <p style={{ fontSize: '0.8rem', color: '#319795', fontWeight: 'bold', margin: '5px 0' }}>Consultation Fee: {doc.fee}</p>
              <p style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>Timings: {doc.timings}</p>
              
              <button 
                style={styles.bookBtn}
                onClick={() => alert(`Appointment requested with ${doc.name}! Confirm date/time in the clinic counter.`)}
              >
                📅 Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: 0, fontSize: '1.2rem', color: '#2D3748' },
  doctorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  docCard: { border: '1px solid #E2E8F0', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' },
  avatar: { width: '50px', height: '50px', backgroundColor: '#E6FFFA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 10px auto' },
  bookBtn: { backgroundColor: '#319795', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }
};

export default PatientView;