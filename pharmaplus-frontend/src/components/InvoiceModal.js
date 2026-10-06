import React from 'react';
import html2pdf from 'html2pdf.js';

const InvoiceModal = ({ data, onClose }) => {
  if (!data) return null;

  const downloadPDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin:       10,
      filename:     `Invoice_Rx_${data.id || 'order'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.card}>
        {/* PRINTABLE AREA */}
        <div id="invoice-content" style={modalStyles.invoiceBody}>
          <div style={modalStyles.header}>
            <h2>💊 PharmaPlus Pharmacy</h2>
            <p style={{ margin: 0, color: '#64748b' }}>Official Dispense Receipt</p>
          </div>

          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          <div style={modalStyles.detailsGrid}>
            <div>
              <strong>Receipt No:</strong> #RX-{data.id}<br />
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Patient:</strong> {data.patient?.fullName || 'N/A'}<br />
              <strong>Doctor:</strong> {data.doctor?.fullName || 'N/A'}
            </div>
          </div>

          <table style={modalStyles.table}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={modalStyles.th}>Item / Medicine</th>
                <th style={modalStyles.th}>Instructions</th>
                <th style={modalStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={modalStyles.td}>{data.medicines || 'Prescribed Medication'}</td>
                <td style={modalStyles.td}>{data.instructions || 'As per doctor advise'}</td>
                <td style={modalStyles.td}>DISPENSED</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <h4>Status: Paid & Completed ✅</h4>
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={modalStyles.cancelBtn}>Close</button>
          <button onClick={downloadPDF} style={modalStyles.downloadBtn}>📥 Download Invoice PDF</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  card: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    width: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  invoiceBody: {
    padding: '10px',
    fontFamily: 'sans-serif'
  },
  header: {
    textAlign: 'center'
  },
  detailsGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  th: {
    padding: '8px',
    textAlign: 'left',
    fontSize: '0.85rem',
    borderBottom: '2px solid #cbd5e1'
  },
  td: {
    padding: '8px',
    fontSize: '0.85rem',
    borderBottom: '1px solid #e2e8f0'
  },
  downloadBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default InvoiceModal;