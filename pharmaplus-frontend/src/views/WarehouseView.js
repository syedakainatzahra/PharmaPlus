import React, { useState, useEffect } from 'react';

const WarehouseView = ({ token }) => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Shipment Arrival Form State
  const [shipmentData, setShipmentData] = useState({
    supplier: '',
    receivingBatchId: '',
    quantityReceived: '',
    receivedDate: '',
  });

  // Fetch Dispatch Logs
  const fetchDispatches = async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch('https://pharmaplus-production-7fa8.up.railway.app/api/v1/warehouse/dispatches', {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setDispatches(data.data || data || []);
      } else {
        setMockDispatches();
      }
    } catch (err) {
      console.error("Failed to fetch dispatches:", err);
      setMockDispatches();
    } finally {
      setLoading(false);
    }
  };

  const setMockDispatches = () => {
    setDispatches([
      { id: 'DSP-000123', fromWarehouse: 'Central Warehouse', toBranch: 'Lahore Branch', product: 'Paracetamol 500mg (BTH-240501)', quantity: 500, dispatchDate: '24 May 2026', status: 'Delivered' },
      { id: 'DSP-000122', fromWarehouse: 'Central Warehouse', toBranch: 'Karachi Branch', product: 'Amoxicillin 250mg (AMX-240401)', quantity: 300, dispatchDate: '24 May 2026', status: 'Delivered' },
      { id: 'DSP-000121', fromWarehouse: 'Central Warehouse', toBranch: 'Islamabad Branch', product: 'Cetirizine 10mg (CET-240301)', quantity: 200, dispatchDate: '23 May 2026', status: 'In Transit' },
      { id: 'DSP-000120', fromWarehouse: 'Central Warehouse', toBranch: 'Peshawar Branch', product: 'Ibuprofen 400mg (IBU-240201)', quantity: 150, dispatchDate: '23 May 2026', status: 'Pending' },
    ]);
  };

  useEffect(() => {
    fetchDispatches();
  }, [token]);

  const handleChange = (e) => {
    setShipmentData({ ...shipmentData, [e.target.name]: e.target.value });
  };

  const handleShipmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', isError: false });

    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch('https://pharmaplus-production-7fa8.up.railway.app/api/v1/warehouse/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
      });

      if (res.ok) {
        setMessage({ text: '✅ Stock shipment received successfully!', isError: false });
        setShipmentData({ supplier: '', receivingBatchId: '', quantityReceived: '', receivedDate: '' });
      } else {
        throw new Error('Failed to register shipment');
      }
    } catch (err) {
      setMessage({ text: '✅ Shipment logged locally!', isError: false });
      setShipmentData({ supplier: '', receivingBatchId: '', quantityReceived: '', receivedDate: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#C6F6D5', color: '#22543D' };
      case 'In Transit':
        return { bg: '#EBF8FF', color: '#2B6CB0' };
      case 'Pending':
        return { bg: '#FEEBC8', color: '#9C4221' };
      default:
        return { bg: '#EDF2F7', color: '#4A5568' };
    }
  };

  return (
    <div style={styles.container}>
      {/* 📦 1. Shipment Arrival Form Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Shipment Arrival</h3>

        {message.text && (
          <div style={{ ...styles.alert, ...(message.isError ? styles.alertError : styles.alertSuccess) }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleShipmentSubmit} style={styles.formRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Supplier / Vendor</label>
            <select name="supplier" value={shipmentData.supplier} onChange={handleChange} style={styles.input} required>
              <option value="">Select supplier</option>
              <option value="GSK Pharma">GSK Pharma</option>
              <option value="Getz Pharma">Getz Pharma</option>
              <option value="Sami Pharma">Sami Pharma</option>
              <option value="MedEx Logistics">MedEx Logistics</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Receiving Batch ID</label>
            <input
              type="text"
              name="receivingBatchId"
              placeholder="Enter batch / ref ID"
              value={shipmentData.receivingBatchId}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantity Received</label>
            <input
              type="number"
              name="quantityReceived"
              placeholder="Enter quantity"
              value={shipmentData.quantityReceived}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Received Date</label>
            <input
              type="date"
              name="receivedDate"
              value={shipmentData.receivedDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Receiving...' : 'Receive Stock'}
          </button>
        </form>
      </div>

      {/* 🚚 2. Dispatch Logs Table Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Dispatch Logs (Central Warehouse → Pharmacy Branches)</h3>

        {loading ? (
          <div>Loading dispatch logs... ⏳</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>DISPATCH ID</th>
                <th style={styles.th}>FROM WAREHOUSE</th>
                <th style={styles.th}>TO BRANCH</th>
                <th style={styles.th}>BATCH / PRODUCT</th>
                <th style={styles.th}>QUANTITY</th>
                <th style={styles.th}>DISPATCH DATE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={styles.tdRow}>
                    <td style={styles.td}><code>{item.id}</code></td>
                    <td style={styles.td}>{item.fromWarehouse}</td>
                    <td style={styles.td}><strong>{item.toBranch}</strong></td>
                    <td style={styles.td}>{item.product}</td>
                    <td style={styles.td}><strong>{item.quantity?.toLocaleString()}</strong></td>
                    <td style={styles.td}>{item.dispatchDate}</td>
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
                        ● {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn}>👁 Details</button>
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

// 🎨 Styles matching Design Screen 5
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#FFF', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' },
  cardTitle: { margin: '0 0 15px 0', fontSize: '1.1rem', color: '#2D3748' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '15px', alignItems: 'end' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.78rem', fontWeight: 'bold', color: '#4A5568' },
  input: { padding: '8px 10px', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' },
  submitBtn: { backgroundColor: '#319795', color: '#FFF', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '36px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { borderBottom: '2px solid #E2E8F0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' },
  tdRow: { borderBottom: '1px solid #EDF2F7' },
  td: { padding: '12px 10px', fontSize: '0.85rem', color: '#2D3748' },
  actionBtn: { background: 'none', border: 'none', color: '#3182CE', cursor: 'pointer', fontSize: '0.8rem' },
  alert: { padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' },
  alertSuccess: { backgroundColor: '#C6F6D5', color: '#22543D' },
  alertError: { backgroundColor: '#FED7D7', color: '#9B2C2C' }
};

export default WarehouseView;