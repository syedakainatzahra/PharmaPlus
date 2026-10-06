import React from 'react';
import Navbar from './Navbar';
import { 
  FiPlus, FiCalendar, FiPrinter 
} from 'react-icons/fi';

const Overview = () => {
  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Overview" subtitle="Tue, 09 Sep 2026 · Morning Shift" />

      <div style={styles.contentBody}>
        {/* KPI Cards Grid */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>TODAY'S WALK-INS</span>
              <span style={styles.badgeGreen}>+3 last hr</span>
            </div>
            <div style={styles.kpiValue}>47</div>
            <div style={styles.kpiSub}>Since 8:00 AM</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>CURRENTLY WAITING</span>
            </div>
            <div style={styles.kpiValue}>12</div>
            <div style={styles.kpiSub}>In lobby</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>ACTIVE DOCTORS</span>
            </div>
            <div style={styles.kpiValue}>4</div>
            <div style={styles.kpiSub}>3 General · 1 Pediatrics</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>DAILY COUNTER REVENUE</span>
              <span style={styles.badgeGreen}>↑ 12%</span>
            </div>
            <div style={styles.kpiValue}>Rs 38,250</div>
            <div style={styles.kpiSub}>Cash + Digital</div>
          </div>
        </div>

        {/* Main Middle Section */}
        <div style={styles.middleSection}>
          {/* Left Column: Live Queue */}
          <div style={styles.liveQueueCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitleWrap}>
                <span style={styles.greenDot}></span>
                <h3 style={styles.cardTitle}>Live Queue — Next 3 Tokens</h3>
              </div>
              <span style={styles.liveBadge}>LIVE</span>
            </div>

            <div style={styles.queueList}>
              <div style={styles.queueItem}>
                <div>
                  <span style={styles.tokenText}>#T-107</span>
                  <div style={styles.patientMeta}>
                    <strong style={styles.patientName}>Fatima Malik</strong>
                    <span style={styles.docName}>Dr. Sara Ahmed</span>
                  </div>
                </div>
                <span style={styles.waitTime}>4 min</span>
              </div>

              <div style={{ ...styles.queueItem, borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' }}>
                <div>
                  <span style={{ ...styles.tokenText, color: '#ef4444' }}>#T-108</span>
                  <div style={styles.patientMeta}>
                    <strong style={styles.patientName}>Usman Tariq</strong>
                    <span style={styles.docName}>Dr. Aris Khan</span>
                  </div>
                </div>
                <div style={styles.rightMeta}>
                  <span style={styles.emergencyTag}>EMERGENCY</span>
                  <span style={styles.waitTime}>12 min</span>
                </div>
              </div>

              <div style={styles.queueItem}>
                <div>
                  <span style={styles.tokenText}>#T-109</span>
                  <div style={styles.patientMeta}>
                    <strong style={styles.patientName}>Nadia Hussain</strong>
                    <span style={styles.docName}>Dr. Sara Ahmed</span>
                  </div>
                </div>
                <span style={styles.waitTime}>18 min</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Doctor Status */}
          <div style={styles.rightColumn}>
            <div style={styles.actionsCard}>
              <h3 style={styles.sectionSmallTitle}>Quick Actions</h3>
              <button style={styles.actionBtnTeal}>
                <FiPlus size={16} /> New Patient Registration
              </button>
              <button style={styles.actionBtnDark}>
                <FiCalendar size={16} /> Book Appointment
              </button>
              <button style={styles.actionBtnPurple}>
                <FiPrinter size={16} /> Print Token
              </button>
            </div>

            <div style={styles.doctorsCard}>
              <h3 style={styles.sectionSmallTitle}>DOCTOR STATUS</h3>
              <div style={styles.doctorList}>
                <div style={styles.docRow}>
                  <span style={{ ...styles.dotIndicator, backgroundColor: '#22c55e' }}></span>
                  <div>
                    <p style={styles.docTitle}>Dr. Sara Ahmed</p>
                    <p style={styles.docSub}>General Physician</p>
                  </div>
                </div>
                <div style={styles.docRow}>
                  <span style={{ ...styles.dotIndicator, backgroundColor: '#2563eb' }}></span>
                  <div>
                    <p style={styles.docTitle}>Dr. Aris Khan</p>
                    <p style={styles.docSub}>Pediatrics</p>
                  </div>
                </div>
                <div style={styles.docRow}>
                  <span style={{ ...styles.dotIndicator, backgroundColor: '#f59e0b' }}></span>
                  <div>
                    <p style={styles.docTitle}>Dr. Kamran Butt</p>
                    <p style={styles.docSub}>General Physician</p>
                  </div>
                </div>
                <div style={styles.docRow}>
                  <span style={{ ...styles.dotIndicator, backgroundColor: '#22c55e' }}></span>
                  <div>
                    <p style={styles.docTitle}>Dr. Layla Noor</p>
                    <p style={styles.docSub}>General Physician</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.statItem}>
            <span style={styles.statNum}>34</span>
            <span style={styles.statLabel}>Consultations Done</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNum}>31</span>
            <span style={styles.statLabel}>Prescriptions Issued</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNum}>18</span>
            <span style={styles.statLabel}>Appointments Today</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNum}>2</span>
            <span style={styles.statLabel}>Emergency Cases</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNum}>14 min</span>
            <span style={styles.statLabel}>Avg Wait Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  kpiCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' },
  kpiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  kpiLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  kpiValue: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
  kpiSub: { fontSize: '12px', color: '#94a3b8' },
  badgeGreen: { backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' },

  middleSection: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  
  liveQueueCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleWrap: { display: 'flex', alignItems: 'center', gap: '8px' },
  greenDot: { width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' },
  cardTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 },
  liveBadge: { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' },
  
  queueList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  queueItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' },
  tokenText: { fontSize: '14px', fontWeight: '800', color: '#2563eb' },
  patientMeta: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' },
  patientName: { fontSize: '13px', color: '#0f172a' },
  docName: { fontSize: '12px', color: '#64748b' },
  waitTime: { fontSize: '12px', fontWeight: '600', color: '#64748b' },
  rightMeta: { display: 'flex', alignItems: 'center', gap: '12px' },
  emergencyTag: { backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' },

  rightColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  actionsCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  sectionSmallTitle: { fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0', letterSpacing: '0.05em' },
  actionBtnTeal: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', width: '100%', justifyContent: 'center' },
  actionBtnDark: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', width: '100%', justifyContent: 'center' },
  actionBtnPurple: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', width: '100%', justifyContent: 'center' },

  doctorsCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  doctorList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  docRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  dotIndicator: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  docTitle: { fontSize: '12px', fontWeight: '700', color: '#0f172a', margin: 0 },
  docSub: { fontSize: '11px', color: '#64748b', margin: 0 },

  bottomBar: { backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  statNum: { fontSize: '18px', fontWeight: '800' },
  statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '500' },
  statDivider: { width: '1px', height: '30px', backgroundColor: '#334155' }
};

export default Overview;