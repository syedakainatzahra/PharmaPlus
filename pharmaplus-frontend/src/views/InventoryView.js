import React, { useState, useEffect } from 'react';

const InventoryView = ({ token, userRole }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Form State matching Screen 4 design
  const [formData, setFormData] = useState({
    medicineName: '',
    category: 'Analgesic',
    price: '',
    batchNumber: '',
    quantity: '',
    expiryDate: '',
  });

  // 1. Fetch Batches from Backend API
  const fetchBatches = async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/batches', {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setBatches(data.data || data || []);
      } else {
        // Fallback mock data agar API endpoint abhi build na hua ho
        setMockData();
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setBatches([
      { id: 1, medicineName: 'Paracetamol 500mg', category: 'Analgesic', batchNumber: 'BTH-240501', quantity: 1250, expiryDate: '2027-06-15', status: 'Safe' },
      { id: 2, medicineName: 'Amoxicillin 250mg', category: 'Antibiotic', batchNumber: 'AMX-240401', quantity: 320, expiryDate: '2026-09-08', status: 'Expiring Soon' },
      { id: 3, medicineName: 'Cetirizine 10mg', category: 'Antihistamine', batchNumber: 'CET-240301', quantity: 150, expiryDate: '2026-08-25', status: 'Expiring Soon' },
      { id: 4, medicineName: 'Ibuprofen 400mg', category: 'Analgesic', batchNumber: 'IBU-240201', quantity: 90, expiryDate: '2026-05-20', status: 'Expired' },
      { id: 5, medicineName: 'Azithromycin 500mg', category: 'Antibiotic', batchNumber: 'AZI-240101', quantity: 0, expiryDate: '2026-05-10', status: 'Expired' },
    ]);
  };

  useEffect(() => {
    fetchBatches();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit New Batch to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', isError: false });

    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/batches', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: '✅ Batch successfully added to FEFO inventory!', isError: false });
        setFormData({ medicineName: '', category: 'Analgesic', price: '', batchNumber: '', quantity: '', expiryDate: '' });
        fetchBatches();
      } else {
        throw new Error(data.message || 'Failed to add batch');
      }
    } catch (err) {
      // Local addition fallback if server fails
      const newEntry = {
        id: Date.now(),
        ...formData,
        status: getStatusBadge(formData.expiryDate).label
      };
      setBatches([newEntry, ...batches]);
      setMessage({ text: '✅ Batch added locally to UI!', isError: false });
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Logic (FEFO Rule)
  const getStatusBadge = (expiryDateStr) => {
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Expired', bg: '#FED7D7', color: '#9B2C2C' };
    } else if (diffDays <= 30) {
      return { label: 'Expiring Soon', bg: '#FEEBC8', color: '#9C4221' };
    } else {
      return { label: 'Safe', bg: '#C6F6D5', color: '#22543D' };
    }
  };

  return (
    <div style={styles.container}>
      {/* 📝 Add Medicine Batch Form Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add Medicine Batch</h3>

        {message.text && (
          <div style={{ ...styles.alert, ...(message.isError ? styles.alertError : styles.alertSuccess) }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.formRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Medicine Name</label>
            <input
              type="text"
              name="medicineName"
              placeholder="Enter medicine name"
              value={formData.medicineName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
              <option value="Analgesic">Analgesic</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antihistamine">Antihistamine</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Antacid">Antacid</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (PKR)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              placeholder="Enter batch no."
              value={formData.batchNumber}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Batch'}
          </button>
        </form>
      </div>

      {/* 📊 Batch Inventory Table Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Batch Inventory (FEFO Tracking)</h3>

        {loading ? (
          <div>Loading inventory batches... ⏳</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>MEDICINE NAME</th>
                <th style={styles.th}>CATEGORY</th>
                <th style={styles.th}>BATCH NO.</th>
                <th style={styles.th}>STOCK QTY</th>
                <th style={styles.th}>EXPIRY DATE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((item) => {
                const badge = getStatusBadge(item.expiryDate);
                return (
                  <tr key={item.id || item.batchNumber} style={styles.tdRow}>
                    <td style={styles.td}><strong>{item.medicineName}</strong></td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}><code>{item.batchNumber}</code></td>
                    <td style={styles.td}><strong>{item.quantity?.toLocaleString()}</strong></td>
                    <td style={styles.td}>{item.expiryDate}</td>
                    <td style={styles.td}>
                      <span style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        ● {badge.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn}>👁 View</button>
                      <button style={styles.actionBtnEdit}>✏️ Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 🎨 Styles matching Design 4
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: '0 0 15px 0', fontSize: '1.1rem', color: '#2D3748' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) auto', gap: '12px', alignItems: 'end' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.78rem', fontWeight: 'bold', color: '#4A5568' },
  input: { padding: '8px 10px', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' },
  submitBtn: { backgroundColor: '#319795', color: '#FFF', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '36px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { borderBottom: '2px solid #E2E8F0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' },
  tdRow: { borderBottom: '1px solid #EDF2F7' },
  td: { padding: '12px 10px', fontSize: '0.85rem', color: '#2D3748' },
  actionBtn: { background: 'none', border: 'none', color: '#3182CE', cursor: 'pointer', marginRight: '8px', fontSize: '0.8rem' },
  actionBtnEdit: { background: 'none', border: 'none', color: '#319795', cursor: 'pointer', fontSize: '0.8rem' },
  alert: { padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' },
  alertSuccess: { backgroundColor: '#C6F6D5', color: '#22543D' },
  alertError: { backgroundColor: '#FED7D7', color: '#9B2C2C' }
};

export default InventoryView;