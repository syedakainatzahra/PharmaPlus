import React, { useState } from 'react';
import { FiSearch, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('FEFO (Expiry)');

  const inventoryItems = [
    { id: 'MED-0041', name: 'Amoxicillin 500mg Capsules', batch: 'B2209', category: 'Antibiotic', stock: '240 caps', expiry: '2026-09-14', days: '6 days remaining', status: 'Critical', price: 'PKR 18', supplier: 'MedCo Pharma' },
    { id: 'MED-0088', name: 'Metformin 850mg Tablets', batch: 'C3301', category: 'Antidiabetic', stock: '580 tabs', expiry: '2026-09-19', days: '11 days remaining', status: 'Expiring Soon', price: 'PKR 12', supplier: 'PharmGen Ltd' },
    { id: 'MED-0112', name: 'Lisinopril 10mg Tablets', batch: 'D0902', category: 'Antihypertensive', stock: '310 tabs', expiry: '2026-09-24', days: '16 days remaining', status: 'Expiring Soon', price: 'PKR 22', supplier: 'CardioRx' },
    { id: 'MED-0007', name: 'Paracetamol 1g Tablets', batch: 'A1104', category: 'Analgesic', stock: '1,200 tabs', expiry: '2026-09-26', days: '18 days remaining', status: 'Expiring Soon', price: 'PKR 5', supplier: 'UniMed' },
    { id: 'MED-0203', name: 'Atorvastatin 20mg Tablets', batch: 'E4412', category: 'Statin', stock: '420 tabs', expiry: '2027-01-15', days: '129 days remaining', status: 'Safe', price: 'PKR 35', supplier: 'CardioRx' },
    { id: 'MED-0059', name: 'Azithromycin 250mg Tablets', batch: 'F5521', category: 'Antibiotic', stock: '180 tabs', expiry: '2027-02-28', days: '173 days remaining', status: 'Safe', price: 'PKR 45', supplier: 'MedCo Pharma' },
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.contentBody}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Inventory & FEFO Management</h1>
          <p style={styles.pageSub}>Sorted by First Expired, First Out — dispense critical items first</p>
        </div>
        <div style={styles.alertCounters}>
          <span style={styles.criticalBadge}>1 Critical</span>
          <span style={styles.expiringBadge}>3 Expiring Soon</span>
        </div>
      </div>

      <div style={styles.banner}>
        <div style={styles.bannerIcon}>
          <FiClock size={20} color="#2563eb" />
        </div>
        <div>
          <p style={styles.bannerTitle}>FEFO Protocol Active</p>
          <p style={styles.bannerText}>Inventory is automatically sorted by nearest expiry date. Dispensing staff must issue highlighted batches before newer stock. Review critical items immediately.</p>
        </div>
      </div>

      <div style={styles.filterCard}>
        <div style={styles.searchBoxContainer}>
          <FiSearch size={16} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search medicine, SKU, batch..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.sortContainer}>
          <span style={styles.sortLabel}>Sort by:</span>
          {['FEFO (Expiry)', 'Low Stock', 'Name'].map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              style={{
                ...styles.sortBtn,
                ...(sortBy === sort ? styles.activeSortBtn : {})
              }}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>MEDICINE NAME</th>
              <th style={styles.th}>SKU / BATCH</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>STOCK</th>
              <th style={styles.th}>EXPIRY DATE</th>
              <th style={styles.th}>FEFO STATUS</th>
              <th style={styles.th}>UNIT PRICE</th>
              <th style={styles.th}>SUPPLIER</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <span style={styles.medicineName}>{item.name}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.skuCell}>
                    <span style={styles.skuText}>{item.id}</span>
                    <span style={styles.batchText}>{item.batch}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.categoryBadge}>{item.category}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.stockText}>{item.stock}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.expiryCell}>
                    <span style={styles.expiryDate}>{item.expiry}</span>
                    <span style={{
                      ...styles.expiryDays,
                      color: item.status === 'Critical' ? '#ef4444' : item.status === 'Expiring Soon' ? '#d97706' : '#64748b'
                    }}>
                      {item.days}
                    </span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: item.status === 'Critical' ? '#fef2f2' : item.status === 'Expiring Soon' ? '#fffbeb' : '#f0fdf4',
                    color: item.status === 'Critical' ? '#ef4444' : item.status === 'Expiring Soon' ? '#d97706' : '#16a34a'
                  }}>
                    {item.status === 'Critical' && '● Critical'}
                    {item.status === 'Expiring Soon' && '● Expiring Soon'}
                    {item.status === 'Safe' && '✓ Safe'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.priceText}>{item.price}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.supplierText}>{item.supplier}</span>
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
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },
  alertCounters: { display: 'flex', gap: '8px' },
  criticalBadge: { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
  expiringBadge: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
  
  banner: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px' },
  bannerIcon: { backgroundColor: '#dbeafe', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: '14px', fontWeight: '700', color: '#1e40af', margin: '0 0 2px 0' },
  bannerText: { fontSize: '12px', color: '#1e3a8a', margin: 0, lineHeight: '1.4' },

  filterCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
  searchBoxContainer: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '320px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a' },
  sortContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  sortLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
  sortBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  activeSortBtn: { backgroundColor: '#2563eb', borderColor: '#2563eb', color: '#ffffff' },

  tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', verticalAlign: 'middle', fontSize: '13px' },
  
  medicineName: { fontWeight: '700', color: '#0f172a' },
  skuCell: { display: 'flex', flexDirection: 'column', gap: '2px' },
  skuText: { fontSize: '12px', fontWeight: '700', color: '#2563eb' },
  batchText: { fontSize: '11px', color: '#94a3b8' },
  categoryBadge: { fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', display: 'inline-block' },
  stockText: { fontWeight: '600', color: '#0f172a' },
  expiryCell: { display: 'flex', flexDirection: 'column', gap: '2px' },
  expiryDate: { fontWeight: '600', color: '#0f172a' },
  expiryDays: { fontSize: '11px', fontWeight: '600' },
  statusBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' },
  priceText: { fontWeight: '700', color: '#0f172a' },
  supplierText: { color: '#64748b', fontSize: '12px' }
};

export default InventoryPage;