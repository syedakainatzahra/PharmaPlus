import React, { useState } from 'react';
import Navbar from './Navbar';
import { FiGrid } from 'react-icons/fi';

const BillingCounter = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [rxId, setRxId] = useState('');

  const methods = ['Cash', 'JazzCash', 'Easypaisa', 'Credit Card'];

  return (
    <div style={styles.wrapper}>
      <Navbar pageTitle="Billing & Counter" subtitle="Counter #3 · Morning Shift" />

      <div style={styles.contentBody}>
        {/* Top Collected Today Badge */}
        <div style={styles.topBadgeRow}>
          <div style={styles.collectedBadge}>
            Rs 38,250 collected today
          </div>
        </div>

        {/* Main Grid Section */}
        <div style={styles.gridContainer}>
          {/* Left Column: Prescription Lookup */}
          <div style={styles.lookupCard}>
            <h3 style={styles.cardTitle}>Prescription Lookup</h3>
            <div style={styles.inputGroup}>
              <div style={styles.inputWrapper}>
                <FiGrid size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Enter RX ID (e.g. RX-2026-0847)" 
                  value={rxId} 
                  onChange={(e) => setRxId(e.target.value)}
                  style={styles.input} 
                />
              </div>
              <button style={styles.fetchBtn}>Fetch</button>
            </div>
          </div>

          {/* Right Column: Payment Method & Prompt */}
          <div style={styles.rightColumn}>
            <div style={styles.paymentCard}>
              <h3 style={styles.cardTitle}>Payment Method</h3>
              <div style={styles.paymentGrid}>
                {methods.map(m => (
                  <button 
                    key={m} 
                    style={{ ...styles.paymentBtn, ...(paymentMethod === m ? styles.paymentBtnActive : {}) }}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.promptCard}>
              <p style={styles.promptMainText}>Fetch a prescription to begin billing</p>
              <p style={styles.promptSubText}>Try: RX-2026-0847</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  
  topBadgeRow: { display: 'flex', justifyContent: 'flex-end' },
  collectedBadge: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },

  gridContainer: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' },

  lookupCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 },
  inputGroup: { display: 'flex', gap: '12px' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 14px', flex: 1, height: '42px' },
  input: { border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a', backgroundColor: 'transparent' },
  fetchBtn: { backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', height: '42px' },

  rightColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  paymentCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  paymentGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  paymentBtn: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' },
  paymentBtnActive: { borderColor: '#0d9488', color: '#0d9488', backgroundColor: '#f0fdf4', borderWidth: '1.5px' },

  promptCard: { backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', textAlign: 'center' },
  promptMainText: { fontSize: '13px', fontWeight: '600', color: '#64748b', margin: 0 },
  promptSubText: { fontSize: '12px', color: '#94a3b8', margin: 0 }
};

export default BillingCounter;