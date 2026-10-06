import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { downloadPrescriptionPDF } from '../../utils/generatePDF';

const PatientDashboard = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('request-consultation');

  // Form & Data States
  const [problem, setProblem] = useState('');
  const [requestType, setRequestType] = useState('PHYSICAL_CHECKUP');
  const [myRequests, setMyRequests] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {
    fullName: 'Kainat Zahra',
    email: 'kainat@example.com',
  };

  // Fetch Requests
  const fetchMyRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/appointments/my-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setMyRequests(data.requests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  // Fetch Prescriptions
  const fetchMyPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/prescriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setMyPrescriptions(data.prescriptions || []);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    fetchMyPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit Request
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/appointments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ problem, type: requestType }),
      });

      const data = await response.json();

      if (data.success) {
  toast.success('Consultation request sent successfully! 🚀');
  setProblem('');
  setRequestType('PHYSICAL_CHECKUP');
  fetchMyRequests();
} else {
  toast.error(`Error: ${data.message || 'Something went wrong!'}`);
}
    } catch (err) {
      toast.error(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = myRequests.filter((r) => !r.scheduledAt).length;
  const confirmedCount = myRequests.filter((r) => r.scheduledAt).length;
  const latestPrescription = myPrescriptions[0];

  return (
    <div style={styles.appWrapper}>
      {/* 100% FIXED SIDEBAR (WILL NOT SCROLL) */}
      <aside style={styles.fixedSidebar}>
        <div style={styles.brandBox}>
          <div style={styles.brandLogo}>➕</div>
          <div>
            <h2 style={styles.brandText}>PharmaPlus</h2>
            <span style={styles.brandSub}>Patient Portal</span>
          </div>
        </div>

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>👤</div>
          <div>
            <h4 style={styles.userCardName}>{user.fullName}</h4>
            <span style={styles.userCardEmail}>{user.email}</span>
            <span style={styles.patientBadge}>Patient</span>
          </div>
        </div>

        <div style={styles.menuHeading}>MAIN MENU</div>

        <nav style={styles.navGroup}>
          <button
            style={activeTab === 'request-consultation' ? styles.activeNavBtn : styles.navBtn}
            onClick={() => setActiveTab('request-consultation')}
          >
            <span>🩺 Request Consultation</span>
          </button>

          <button
            style={activeTab === 'my-requests' ? styles.activeNavBtn : styles.navBtn}
            onClick={() => setActiveTab('my-requests')}
          >
            <span>📋 My Requests Status</span>
          </button>

          <button
            style={activeTab === 'prescriptions' ? styles.activeNavBtn : styles.navBtn}
            onClick={() => setActiveTab('prescriptions')}
          >
            <span>💊 Prescription History</span>
          </button>
        </nav>

        <div style={styles.supportBox}>
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          <div>
            <strong>Need Help?</strong>
            <p style={styles.supportSub}>Support team is here to help.</p>
          </div>
          <button style={styles.supportBtn}>Contact Support</button>
        </div>

        <button style={styles.logoutBtn}>🚪 Logout</button>
      </aside>

      {/* RIGHT MAIN CONTENT AREA (SCROLLS INDEPENDENTLY) */}
      <main style={styles.scrollableContent}>
        {/* HEADER BAR */}
        <header style={styles.headerBar}>
          <div>
            <h1 style={styles.welcomeText}>Welcome back, {user.fullName.split(' ')[0]} 👋</h1>
            <p style={styles.welcomeSub}>Manage your health consultations and prescriptions in one place.</p>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.bellBox}>🔔<span style={styles.bellBadge}>3</span></div>
            <div style={styles.profileBox}>
              <div style={styles.profileAvatar}>KZ</div>
              <div>
                <strong>{user.fullName}</strong>
                <span style={styles.userRoleText}>Patient</span>
              </div>
            </div>
          </div>
        </header>

        {/* TOP STATS CARDS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff', color: '#2563eb' }}>📅</div>
            <div>
              <span style={styles.statTitle}>Total Requests</span>
              <h2 style={styles.statVal}>{myRequests.length}</h2>
              <small style={styles.statSub}>All time requests</small>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7', color: '#d97706' }}>🕒</div>
            <div>
              <span style={styles.statTitle}>Pending Review</span>
              <h2 style={styles.statVal}>{pendingCount}</h2>
              <small style={styles.statSub}>Awaiting response</small>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7', color: '#16a34a' }}>✅</div>
            <div>
              <span style={styles.statTitle}>Confirmed Appointments</span>
              <h2 style={styles.statVal}>{confirmedCount}</h2>
              <small style={styles.statSub}>Scheduled & confirmed</small>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div style={styles.tabsBar}>
          <button
            style={activeTab === 'request-consultation' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab('request-consultation')}
          >
            🩺 Request Consultation
          </button>
          <button
            style={activeTab === 'my-requests' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab('my-requests')}
          >
            📋 My Requests Status
          </button>
          <button
            style={activeTab === 'prescriptions' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab('prescriptions')}
          >
            💊 Prescription History
          </button>
        </div>

        {/* TAB 1: REQUEST CONSULTATION */}
        {activeTab === 'request-consultation' && (
          <div style={styles.tabContentArea}>
            <div style={styles.gridTwoCols}>
              
              {/* FORM */}
              <div style={styles.formCard}>
                <h3 style={styles.sectionTitle}>Request a Consultation</h3>
                <p style={styles.sectionSub}>Fill out the form below to request an appointment.</p>

                <form onSubmit={handleBookAppointment}>
                  <div style={styles.formRowGroup}>
                    <div style={styles.inputCol}>
                      <label style={styles.inputLabel}>Consultation Type</label>
                      <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        style={styles.selectField}
                      >
                        <option value="PHYSICAL_CHECKUP">🩺 Physical Checkup (General health)</option>
                        <option value="XRAY_SCAN">🩻 X-Ray Scan (Radiology imaging)</option>
                        <option value="LAB_TEST">🧪 Lab Test (Blood, urine & tests)</option>
                        <option value="ONLINE_CONSULT">💻 Online Consult (Doctor online)</option>
                      </select>
                    </div>

                    <div style={styles.inputCol}>
                      <label style={styles.inputLabel}>Symptoms / Health Problem</label>
                      <textarea
                        placeholder="Describe your symptoms, health concerns, or reason for consultation..."
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        style={styles.textareaField}
                        maxLength={500}
                        required
                      />
                      <small style={styles.charCount}>{problem.length}/500</small>
                    </div>
                  </div>

                  <div style={styles.infoAlert}>
                    ℹ️ Please provide accurate information so our healthcare team can assist you better.
                  </div>

                  <button type="submit" style={styles.blueSubmitBtn} disabled={loading}>
                    {loading ? 'Submitting...' : '✈️ Submit Request'}
                  </button>
                </form>
              </div>

              {/* RECENT REQUESTS */}
              <div style={styles.recentRequestsCard}>
                <div style={styles.cardTopHeader}>
                  <h3 style={styles.sectionTitle}>Recent Requests</h3>
                  <button onClick={() => setActiveTab('my-requests')} style={styles.viewAllLink}>
                    View All
                  </button>
                </div>

                {myRequests.length === 0 ? (
                  <p style={styles.noDataText}>No requests submitted yet.</p>
                ) : (
                  <div style={styles.recentList}>
                    {myRequests.slice(0, 3).map((req) => (
                      <div key={req.id} style={styles.recentItem}>
                        <div style={styles.recentIconBox}>🩺</div>
                        <div style={{ flex: 1 }}>
                          <strong style={styles.recentType}>{req.type}</strong>
                          <span style={styles.recentSubText}>
                            Submitted: {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          {req.scheduledAt ? (
                            <span style={styles.confirmedBadgeTag}>Confirmed Slot</span>
                          ) : (
                            <span style={styles.pendingBadgeTag}>Pending Review</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setActiveTab('my-requests')} style={styles.goToBtn}>
                  Go to My Requests →
                </button>
              </div>

            </div>

            {/* LATEST PRESCRIPTION */}
            <div style={styles.latestPrescriptionCard}>
              <div style={styles.cardTopHeader}>
                <h3 style={styles.sectionTitle}>Latest Prescription</h3>
                <button onClick={() => setActiveTab('prescriptions')} style={styles.viewAllLink}>
                  View All Prescriptions
                </button>
                <button
  style={{
    backgroundColor: '#0284c7',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem'
  }}
  onClick={() => downloadPrescriptionPDF(latestPrescription, user.fullName)}
>
  📥 Download PDF
</button>
              </div>

              {latestPrescription ? (
                <div style={styles.presWidgetGrid}>
                  <div>
                    <strong>Dr. Assigned Practitioner</strong>
                    <p style={styles.presSubText}>
                      Date: {new Date(latestPrescription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span style={styles.labelMuted}>Medicines:</span>
                    <p style={styles.presDetailText}>{latestPrescription.medicines}</p>
                  </div>
                  <div style={styles.instructionWidgetBox}>
                    <strong>Instructions:</strong>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
                      {latestPrescription.instructions || 'Take medicines as directed.'}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={styles.noDataText}>No prescriptions issued yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY REQUESTS STATUS */}
        {activeTab === 'my-requests' && (
          <div style={styles.formCard}>
            <h3 style={styles.sectionTitle}>My Submitted Requests</h3>
            {myRequests.length === 0 ? (
              <p style={styles.noDataText}>No requests found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                {myRequests.map((req) => (
                  <div key={req.id} style={styles.recentItem}>
                    <div style={{ flex: 1 }}>
                      <strong>{req.type}</strong>
                      <p style={{ margin: '0.2rem 0', color: '#475569' }}>{req.problem}</p>
                      <small style={styles.recentSubText}>
                        Date: {new Date(req.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div>
                      {req.scheduledAt ? (
                        <span style={styles.confirmedBadgeTag}>
                          📅 {new Date(req.scheduledAt).toLocaleString()}
                        </span>
                      ) : (
                        <span style={styles.pendingBadgeTag}>⏳ Pending Review</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRESCRIPTION HISTORY */}
        {activeTab === 'prescriptions' && (
          <div style={styles.formCard}>
            <h3 style={styles.sectionTitle}>Prescription History</h3>
            {myPrescriptions.length === 0 ? (
              <p style={styles.noDataText}>No prescriptions available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {myPrescriptions.map((pres) => (
                  <div key={pres.id} style={styles.latestPrescriptionCard}>
                    <strong>Prescription #{pres.id.slice(0, 8)}</strong>
                    <p style={{ margin: '0.4rem 0', color: '#334155' }}>
                      <strong>Medicines:</strong> {pres.medicines}
                    </p>
                    {pres.instructions && (
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                        <strong>Instructions:</strong> {pres.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

// FIXED SIDEBAR + SCROLLABLE CONTENT STYLES
const styles = {
  appWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    position: 'relative',
  },

  /* STRICT 100% FIXED SIDEBAR */
  fixedSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflowY: 'auto',
    zIndex: 1000,
  },

  /* MAIN CONTENT WITH MARGIN-LEFT TO ALLOW INDEPENDENT SCROLL */
  scrollableContent: {
    marginLeft: '260px', // Matches sidebar width exactly
    padding: '1.5rem 2rem',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },

  brandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.2rem',
  },
  brandLogo: {
    backgroundColor: '#0284c7',
    color: 'white',
    padding: '0.3rem 0.6rem',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
  brandText: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#0f172a',
  },
  brandSub: {
    fontSize: '0.7rem',
    color: '#64748b',
  },
  userCard: {
    backgroundColor: '#f1f5f9',
    padding: '0.8rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.5rem',
  },
  userAvatar: {
    fontSize: '1.5rem',
  },
  userCardName: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#0f172a',
  },
  userCardEmail: {
    fontSize: '0.7rem',
    color: '#64748b',
    display: 'block',
  },
  patientBadge: {
    fontSize: '0.65rem',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  menuHeading: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: '0.5rem',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
  navBtn: {
    padding: '0.7rem 0.8rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#475569',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  activeNavBtn: {
    padding: '0.7rem 0.8rem',
    border: 'none',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  supportBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.8rem',
  },
  supportSub: {
    margin: '0.2rem 0 0.5rem 0',
    color: '#64748b',
    fontSize: '0.75rem',
  },
  supportBtn: {
    width: '100%',
    padding: '0.4rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  logoutBtn: {
    padding: '0.6rem',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#ef4444',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  welcomeText: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#0f172a',
  },
  welcomeSub: {
    margin: '0.2rem 0 0 0',
    color: '#64748b',
    fontSize: '0.85rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  bellBox: {
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    padding: '0.5rem 0.7rem',
    borderRadius: '8px',
  },
  bellBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '0.6rem',
    padding: '0.1rem 0.3rem',
    borderRadius: '50%',
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  profileAvatar: {
    backgroundColor: '#2563eb',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  userRoleText: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#64748b',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  statTitle: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  statVal: {
    margin: '0.1rem 0',
    fontSize: '1.3rem',
    color: '#0f172a',
  },
  statSub: {
    fontSize: '0.7rem',
    color: '#94a3b8',
  },
  tabsBar: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '1.5rem',
  },
  tabBtn: {
    padding: '0.6rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  activeTabBtn: {
    padding: '0.6rem 1rem',
    border: 'none',
    borderBottom: '2px solid #0284c7',
    backgroundColor: 'transparent',
    color: '#0284c7',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  tabContentArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1.2fr',
    gap: '1.5rem',
  },
  formCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  sectionTitle: {
    margin: '0 0 0.2rem 0',
    fontSize: '1.1rem',
    color: '#0f172a',
  },
  sectionSub: {
    margin: '0 0 1.2rem 0',
    color: '#64748b',
    fontSize: '0.8rem',
  },
  formRowGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  inputCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: '0.3rem',
  },
  selectField: {
    padding: '0.6rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  textareaField: {
    padding: '0.6rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.85rem',
    height: '90px',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.65rem',
    color: '#94a3b8',
  },
  infoAlert: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '0.6rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    marginBottom: '1rem',
  },
  blueSubmitBtn: {
    backgroundColor: '#0284c7',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  recentRequestsCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  viewAllLink: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#0284c7',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.6rem',
    border: '1px solid #f1f5f9',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  },
  recentIconBox: {
    backgroundColor: '#fef3c7',
    padding: '0.4rem',
    borderRadius: '6px',
  },
  recentType: {
    display: 'block',
    fontSize: '0.85rem',
  },
  recentSubText: {
    fontSize: '0.7rem',
    color: '#64748b',
  },
  pendingBadgeTag: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  confirmedBadgeTag: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  goToBtn: {
    width: '100%',
    padding: '0.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#0284c7',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  latestPrescriptionCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  presWidgetGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1.5fr',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '0.8rem',
  },
  presSubText: {
    margin: '0.2rem 0 0 0',
    fontSize: '0.75rem',
    color: '#64748b',
  },
  labelMuted: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  presDetailText: {
    margin: '0.2rem 0 0 0',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#0f172a',
  },
  instructionWidgetBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    color: '#166534',
  },
  noDataText: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
};

export default PatientDashboard;