import React, { useState } from 'react';
import { FiGrid, FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([
    { id: 'M-001', name: 'Paracetamol 500mg', category: 'Analgesic', price: 'Rs. 150', stock: 120, status: 'Available' },
    { id: 'M-002', name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 'Rs. 350', stock: 45, status: 'Available' },
    { id: 'M-003', name: 'Metformin 500mg', category: 'Antidiabetic', price: 'Rs. 220', stock: 18, status: 'Low Stock' },
    { id: 'M-004', name: 'Ibuprofen 400mg', category: 'Analgesic', price: 'Rs. 180', stock: 95, status: 'Available' },
    { id: 'M-005', name: 'Omeprazole 20mg', category: 'Antacid', price: 'Rs. 290', stock: 14, status: 'Low Stock' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', category: '', price: '', stock: '' });

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.price) return;
    
    const item = {
      id: `M-00${medicines.length + 1}`,
      name: newMed.name,
      category: newMed.category || 'General',
      price: `Rs. ${newMed.price}`,
      stock: Number(newMed.stock) || 50,
      status: Number(newMed.stock) < 20 ? 'Low Stock' : 'Available',
    };

    setMedicines([...medicines, item]);
    setNewMed({ name: '', category: '', price: '', stock: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div>
      {/* Banner */}
      <div style={styles.banner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.bannerIcon}>
            <FiGrid size={18} color="#2563eb" />
          </div>
          <div>
            <h3 style={styles.bannerTitle}>Medicine Management</h3>
            <p style={styles.bannerSubtitle}>Add, update, or remove store pharmaceutical products</p>
          </div>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <FiPlus size={16} /> Add New Medicine
        </button>
      </div>

      {/* Add Modal Form (Inline Prompt Style) */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Add New Medicine</h3>
            <form onSubmit={handleAddMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Medicine Name & Dosage (e.g. Disprin 300mg)" 
                value={newMed.name} 
                onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                style={styles.inputField}
                required
              />
              <input 
                type="text" 
                placeholder="Category (e.g. Analgesic)" 
                value={newMed.category} 
                onChange={(e) => setNewMed({...newMed, category: e.target.value})}
                style={styles.inputField}
              />
              <input 
                type="number" 
                placeholder="Price in Rs (e.g. 200)" 
                value={newMed.price} 
                onChange={(e) => setNewMed({...newMed, price: e.target.value})}
                style={styles.inputField}
                required
              />
              <input 
                type="number" 
                placeholder="Initial Stock Quantity" 
                value={newMed.stock} 
                onChange={(e) => setNewMed({...newMed, stock: e.target.value})}
                style={styles.inputField}
                required
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" style={styles.submitBtn}>Save Medicine</button>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Item ID</th>
              <th style={styles.th}>Medicine Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(med => (
              <tr key={med.id} style={styles.tbodyRow}>
                <td style={styles.td}><strong>{med.id}</strong></td>
                <td style={styles.td}>{med.name}</td>
                <td style={styles.td}>{med.category}</td>
                <td style={styles.td}>{med.price}</td>
                <td style={styles.td}>{med.stock} units</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: med.status === 'Available' ? '#dcfce7' : '#fef3c7',
                    color: med.status === 'Available' ? '#16a34a' : '#b45309',
                  }}>
                    {med.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.iconActionBtn} title="Edit">
                      <FiEdit3 size={14} color="#2563eb" />
                    </button>
                    <button style={styles.iconDeleteBtn} title="Delete" onClick={() => handleDelete(med.id)}>
                      <FiTrash2 size={14} color="#dc2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  addBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
  },
  theadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  th: {
    padding: '14px 16px',
    fontWeight: '700',
    color: '#475569',
  },
  tbodyRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    color: '#0f172a',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
  },
  iconActionBtn: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  iconDeleteBtn: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    width: '380px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  inputField: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default MedicineManagement;