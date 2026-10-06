import React, { useState } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiExternalLink, FiFileText } from 'react-icons/fi';

const PrescriptionQueue = () => {
  // Sample prescriptions data matching the Figma UI
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'P-1001',
      patientName: 'John Smith',
      initials: 'JS',
      date: 'Apr 26, 2025 • 09:15 AM',
      status: 'Pending',
      medicines: [
        '1. Amoxicillin 500mg (x3 daily)',
        '2. Paracetamol 500mg (x2 daily)',
        '3. Vitamin D3 1000UI (x1 daily)',
      ],
    },
    {
      id: 'P-1002',
      patientName: 'Maria Garcia',
      initials: 'MJ',
      date: 'Apr 26, 2025 • 09:32 AM',
      status: 'Pending',
      medicines: [
        '1. Metformin 500mg (x2 daily)',
        '2. Atorvastatin 20mg (x1 daily)',
        '3. Lisinopril 10mg (x1 daily)',
      ],
    },
    {
      id: 'P-1003',
      patientName: 'Alex Lee',
      initials: 'AL',
      date: 'Apr 26, 2025 • 09:48 AM',
      status: 'Pending',
      medicines: [
        '1. Pantoprazole 40mg (x1 daily)',
        '2. Ibuprofen 400mg (x2 daily)',
        '3. Multivitamin (x1 daily)',
      ],
    },
    {
      id: 'P-1004',
      patientName: 'Sarah Lopez',
      initials: 'SL',
      date: 'Apr 26, 2025 • 10:02 AM',
      status: 'Approved',
      medicines: [
        '1. Levothyroxine 50mcg (x1 daily)',
        '2. Calcium Carbonate 500mg (x2 daily)',
      ],
    },
    {
      id: 'P-1005',
      patientName: 'Robert Taylor',
      initials: 'RT',
      date: 'Apr 26, 2025 • 10:08 AM',
      status: 'Rejected',
      medicines: [
        '1. Amlodipine 5mg (x1 daily)',
        '2. Hydrochlorothiazide 25mg (x1 daily)',
      ],
    },
    {
      id: 'P-1006',
      patientName: 'Nancy Brown',
      initials: 'NB',
      date: 'Apr 26, 2025 • 10:15 AM',
      status: 'Pending',
      medicines: [
        '1. Sertraline 50mg (x1 daily)',
        '2. Alprazolam 0.5mg (x1 daily)',
      ],
    },
  ]);

  const handleApprove = (id) => {
    setPrescriptions(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  };

  const handleReject = (id) => {
    setPrescriptions(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
  };

  return (
    <div>
      {/* Top Banner Counter */}
      <div style={styles.banner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.bannerIcon}>
            <FiFileText size={18} color="#2563eb" />
          </div>
          <div>
            <h3 style={styles.bannerTitle}>Pending Prescriptions</h3>
            <p style={styles.bannerSubtitle}>3 prescriptions awaiting review</p>
          </div>
        </div>
        <span style={styles.timestampBadge}>Last updated: Apr 26, 2025 • 10:24 AM</span>
      </div>

      {/* Cards Grid */}
      <div style={styles.grid}>
        {prescriptions.map(rx => {
          const isPending = rx.status === 'Pending';
          const isApproved = rx.status === 'Approved';
          
          return (
            <div key={rx.id} style={styles.card}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.patientInfo}>
                  <div style={styles.avatar}>{rx.initials}</div>
                  <div>
                    <h4 style={styles.patientName}>{rx.patientName}</h4>
                    <span style={styles.patientId}>Patient ID: {rx.id}</span>
                  </div>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: isApproved ? '#dcfce7' : rx.status === 'Rejected' ? '#fef2f2' : '#fef3c7',
                  color: isApproved ? '#16a34a' : rx.status === 'Rejected' ? '#dc2626' : '#d97706',
                }}>
                  {rx.status}
                </span>
              </div>

              {/* Date */}
              <p style={styles.dateText}>
                <FiClock size={12} /> {rx.date}
              </p>

              {/* Prescription Preview Box */}
              <div style={styles.previewBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.docIcon}>📄</span>
                  <div>
                    <p style={styles.previewTitle}>Prescription Preview</p>
                    <a href="#view" onClick={(e) => { e.preventDefault(); alert(`Opening document for ${rx.patientName}`); }} style={styles.previewLink}>
                      View Full Prescription <FiExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Prescribed Medicines List */}
              <div style={styles.medsSection}>
                <p style={styles.medsHeader}>Prescribed Medicines</p>
                {rx.medicines.map((med, index) => (
                  <p key={index} style={styles.medItem}>{med}</p>
                ))}
              </div>

              {/* Action Buttons / Status Footer */}
              {isPending ? (
                <div style={styles.actionRow}>
                  <button style={styles.approveBtn} onClick={() => handleApprove(rx.id)}>
                    <FiCheckCircle size={14} /> Approve
                  </button>
                  <button style={styles.rejectBtn} onClick={() => handleReject(rx.id)}>
                    <FiXCircle size={14} /> Reject
                  </button>
                </div>
              ) : (
                <div style={{
                  ...styles.statusFooter,
                  backgroundColor: isApproved ? '#f0fdf4' : '#fef2f2',
                  color: isApproved ? '#15803d' : '#991b1b',
                }}>
                  {isApproved ? '✓ Prescription approved - Ready for dispensing' : '✕ Prescription rejected - Patient notified'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  bannerIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  bannerSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  timestampBadge: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '18px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  patientInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
  },
  patientName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  patientId: {
    fontSize: '11px',
    color: '#64748b',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  dateText: {
    fontSize: '11px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '14px',
  },
  previewBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '14px',
  },
  docIcon: {
    fontSize: '18px',
  },
  previewTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  previewLink: {
    fontSize: '11px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  medsSection: {
    marginBottom: '16px',
  },
  medsHeader: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  medItem: {
    fontSize: '12px',
    color: '#334155',
    margin: '0 0 3px 0',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#dcfce7',
    color: '#15803d',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  statusFooter: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '8px',
    borderRadius: '6px',
    textAlign: 'center',
  },
};

export default PrescriptionQueue;