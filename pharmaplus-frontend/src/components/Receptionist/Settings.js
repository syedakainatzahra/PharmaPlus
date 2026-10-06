import React, { useState } from 'react';
import Navbar from './Navbar';
import { FiChevronDown, FiClock } from 'react-icons/fi';

const Settings = ({ onLogout }) => {
  const [autoPrint, setAutoPrint] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [longWaitWarning, setLongWaitWarning] = useState(true);
  const [handoverReport, setHandoverReport] = useState(true);
  
  // Modal state for confirmation popup
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  

  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Settings" subtitle="Front Desk Configuration · Branch #402" />

      <div style={styles.contentBody}>
        {/* Top Save Changes Action Bar */}
        <div style={styles.topActionBar}>
          <button style={styles.saveChangesBtn}>Save Changes</button>
        </div>

        {/* 2x2 Grid of Settings Cards */}
        <div style={styles.gridContainer}>
          {/* Card 1: Printer Setup */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Printer Setup</h3>
            
            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Token Printer</p>
                <p style={styles.settingSub}>Used for queue token slips</p>
              </div>
              <div style={styles.selectWrapper}>
                <span style={styles.selectText}>HP LaserJet Pro M404n</span>
                <FiChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Receipt Printer</p>
                <p style={styles.settingSub}>For billing receipts</p>
              </div>
              <div style={styles.selectWrapper}>
                <span style={styles.selectText}>Epson TM-T20III (POS)</span>
                <FiChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Auto-print Token</p>
                <p style={styles.settingSub}>Print token slip on registration</p>
              </div>
              <label style={styles.switch}>
                <input type="checkbox" checked={autoPrint} onChange={() => setAutoPrint(!autoPrint)} style={styles.checkbox} />
                <span style={{ ...styles.slider, backgroundColor: autoPrint ? '#0d9488' : '#cbd5e1' }}>
                  <span style={{ ...styles.sliderKnob, transform: autoPrint ? 'translateX(18px)' : 'translateX(2px)' }}></span>
                </span>
              </label>
            </div>

            <div style={{ ...styles.settingRow, borderBottom: 'none' }}>
              <p style={styles.settingLabel}>Print Test Page</p>
              <button style={styles.testPrintBtn}>Test Print</button>
            </div>
          </div>

          {/* Card 2: Counter Assignment */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Counter Assignment</h3>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Counter Number</p>
                <p style={styles.settingSub}>This front desk station</p>
              </div>
              <div style={styles.selectWrapper}>
                <span style={styles.selectText}>Counter #3</span>
                <FiChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Branch</p>
                <p style={styles.settingSub}>Currently assigned</p>
              </div>
              <span style={styles.badgeText}>Branch #402</span>
            </div>

            <div style={{ ...styles.settingRow, borderBottom: 'none' }}>
              <div>
                <p style={styles.settingLabel}>Display Name</p>
                <p style={styles.settingSub}>Shown on token slips</p>
              </div>
              <input type="text" defaultValue="PharmaPlus Reception" style={styles.textInput} />
            </div>
          </div>

          {/* Card 3: Notifications & Alerts */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Notifications & Alerts</h3>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Emergency Walk-in Alert</p>
                <p style={styles.settingSub}>Play alert for Emergency priority patients</p>
              </div>
              <label style={styles.switch}>
                <input type="checkbox" checked={emergencyAlert} onChange={() => setEmergencyAlert(!emergencyAlert)} style={styles.checkbox} />
                <span style={{ ...styles.slider, backgroundColor: emergencyAlert ? '#0d9488' : '#cbd5e1' }}>
                  <span style={{ ...styles.sliderKnob, transform: emergencyAlert ? 'translateX(18px)' : 'translateX(2px)' }}></span>
                </span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Sound Alerts</p>
                <p style={styles.settingSub}>Audible notification on new token</p>
              </div>
              <label style={styles.switch}>
                <input type="checkbox" checked={soundAlerts} onChange={() => setSoundAlerts(!soundAlerts)} style={styles.checkbox} />
                <span style={{ ...styles.slider, backgroundColor: soundAlerts ? '#0d9488' : '#cbd5e1' }}>
                  <span style={{ ...styles.sliderKnob, transform: soundAlerts ? 'translateX(18px)' : 'translateX(2px)' }}></span>
                </span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Long Wait Warning</p>
                <p style={styles.settingSub}>Warn when patient waits &gt;30 min</p>
              </div>
              <label style={styles.switch}>
                <input type="checkbox" checked={longWaitWarning} onChange={() => setLongWaitWarning(!longWaitWarning)} style={styles.checkbox} />
                <span style={{ ...styles.slider, backgroundColor: longWaitWarning ? '#0d9488' : '#cbd5e1' }}>
                  <span style={{ ...styles.sliderKnob, transform: longWaitWarning ? 'translateX(18px)' : 'translateX(2px)' }}></span>
                </span>
              </label>
            </div>

            <div style={{ ...styles.settingRow, borderBottom: 'none' }}>
              <p style={styles.settingLabel}>Alert Sound</p>
              <div style={styles.selectWrapper}>
                <span style={styles.selectText}>Chime (Default)</span>
                <FiChevronDown size={14} color="#64748b" />
              </div>
            </div>
          </div>

          {/* Card 4: Shift Management */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Shift Management</h3>

            <div style={styles.settingRow}>
              <p style={styles.settingLabel}>Current Shift</p>
              <span style={styles.activeShiftBadge}>Morning Shift — Active</span>
            </div>

            <div style={styles.settingRow}>
              <p style={styles.settingLabel}>Shift Start Time</p>
              <div style={styles.timeInputBox}>
                <span>08:00 AM</span>
                <FiClock size={14} color="#64748b" />
              </div>
            </div>

            <div style={styles.settingRow}>
              <p style={styles.settingLabel}>Shift End Time</p>
              <div style={styles.timeInputBox}>
                <span>04:00 PM</span>
                <FiClock size={14} color="#64748b" />
              </div>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Handover Report</p>
                <p style={styles.settingSub}>Auto-generate at shift end</p>
              </div>
              <label style={styles.switch}>
                <input type="checkbox" checked={handoverReport} onChange={() => setHandoverReport(!handoverReport)} style={styles.checkbox} />
                <span style={{ ...styles.slider, backgroundColor: handoverReport ? '#0d9488' : '#cbd5e1' }}>
                  <span style={{ ...styles.sliderKnob, transform: handoverReport ? 'translateX(18px)' : 'translateX(2px)' }}></span>
                </span>
              </label>
            </div>

            <div style={{ padding: '16px 0 0 0' }}>
              <button style={styles.endShiftBtn}>End Shift &amp; Hand Over</button>
            </div>
          </div>
        </div>

        {/* Bottom Profile Bar */}
        <div style={styles.profileBar}>
          <div style={styles.profileInfo}>
            <div style={styles.avatar}>SR</div>
            <div>
              <p style={styles.profileName}>Sara Raza</p>
              <p style={styles.profileSub}>Front Desk Operator · Employee ID: EMP-2024-042</p>
            </div>
          </div>
          <div style={styles.profileActions}>
            <button style={styles.changePasswordBtn}>Change Password</button>
            <button 
              style={styles.signoutBtn} 
              onClick={() => setShowLogoutModal(true)}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Popup */}
      {showLogoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Confirm Sign Out</h3>
            <p style={styles.modalText}>Kya aap waqai apna account sign out kar ke auth form par jana chahte hain?</p>
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelModalBtn} 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
  style={styles.signOutBtn} 
  onClick={onLogout} // Yeh App.js ke handleLogout ko trigger kare ga
>
  Sign Out
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  
  topActionBar: { display: 'flex', justifyContent: 'flex-end' },
  saveChangesBtn: { backgroundColor: '#0d9488', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' },

  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  settingLabel: { fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0 },
  settingSub: { fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' },

  selectWrapper: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', backgroundColor: '#ffffff' },
  selectText: { fontSize: '12px', color: '#334155', fontWeight: '500' },
  badgeText: { fontSize: '12px', color: '#334155', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' },
  textInput: { border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#334155', outline: 'none', width: '160px' },
  timeInputBox: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', backgroundColor: '#ffffff', fontSize: '12px', color: '#334155', fontWeight: '500' },

  switch: { position: 'relative', display: 'inline-block', width: '38px', height: '20px', cursor: 'pointer' },
  checkbox: { opacity: 0, width: 0, height: 0 },
  slider: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '20px', transition: '.3s' },
  sliderKnob: { position: 'absolute', content: "''", height: '16px', width: '16px', left: '2px', bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.3s' },

  testPrintBtn: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  activeShiftBadge: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  endShiftBtn: { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', width: '100%', textAlign: 'center' },

  profileBar: { backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', marginTop: '4px' },
  profileInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' },
  profileName: { fontSize: '13px', fontWeight: '700', margin: 0 },
  profileSub: { fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' },
  profileActions: { display: 'flex', gap: '10px' },
  changePasswordBtn: { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  signoutBtn: { backgroundColor: '#ef4444', border: 'none', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },

  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', width: '380px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  modalTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },
  modalText: { fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' },
  cancelModalBtn: { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  confirmModalBtn: { backgroundColor: '#ef4444', border: 'none', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }
};

export default Settings;