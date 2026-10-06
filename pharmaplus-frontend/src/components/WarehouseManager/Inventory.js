import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get('http://localhost:5000/api/v1/warehouse/inventory', { headers });
        
        const combined = [
          ...(res.data.medicines || []),
          ...(res.data.products || [])
        ];
        setInventory(combined);
      } catch (err) {
        console.error('Error fetching inventory', err);
      }
    };
    fetchInventory();
  }, []);

  // Fallback mock items matching UI if backend is empty
  const displayItems = inventory.length > 0 ? inventory : [
    { id: 1, sku: 'AMX-500-C', name: 'Amoxicillin 500mg Caps', category: { name: 'Antibiotic' }, zone: 'Zone D', stock: 8400, unit: 'Capsules', expiryDate: 'Mar 2026', status: 'Delivered' },
    { id: 2, sku: 'MET-850-T', name: 'Metformin 850mg Tabs', category: { name: 'Antidiabetic' }, zone: 'Zone D', stock: 3600, unit: 'Tablets', expiryDate: 'Jun 2026', status: 'Delivered' },
    { id: 3, sku: 'ATV-020-T', name: 'Atorvastatin 20mg Tabs', category: { name: 'Lipid-lowering' }, zone: 'Zone D', stock: 950, unit: 'Tablets', expiryDate: 'Nov 2025', status: 'Processing' },
    { id: 4, sku: 'INS-GLR-V', name: 'Insulin Glargine 100U/mL', category: { name: 'Insulin' }, zone: 'Zone A', stock: 42, unit: 'Vials', expiryDate: 'Jan 2026', status: 'Customs Hold' },
    { id: 5, sku: 'LSN-010-T', name: 'Lisinopril 10mg Tabs', category: { name: 'ACE Inhibitor' }, zone: 'Zone D', stock: 5200, unit: 'Tablets', expiryDate: 'Sep 2026', status: 'Delivered' },
    { id: 6, sku: 'OMP-020-C', name: 'Omeprazole 20mg Caps', category: { name: 'PPI' }, zone: 'Zone D', stock: 2800, unit: 'Capsules', expiryDate: 'Aug 2026', status: 'Delivered' },
    { id: 7, sku: 'EPI-001-A', name: 'Adrenaline (Epinephrine) 1mg', category: { name: 'Emergency' }, zone: 'Zone B', stock: 18, unit: 'Ampoules', expiryDate: 'Dec 2025', status: 'Customs Hold' },
    { id: 8, sku: 'MRP-010-V', name: 'Morphine Sulfate 10mg/mL', category: { name: 'Opioid Analgesic' }, zone: 'Zone B', stock: 8, unit: 'Vials', expiryDate: 'Feb 2026', status: 'Customs Hold' },
  ];

  const filteredItems = displayItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'All Zones' || item.zone === zoneFilter;
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    return matchesSearch && matchesZone && matchesStatus;
  });

  return (
    <main style={styles.mainContent}>
      <div style={styles.contentBody}>
        {/* Filter & Action Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.filterSearchBox}>
            <FiSearch size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search medicines, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.toolbarRight}>
            <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} style={styles.selectDropdown}>
              <option>All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
              <option>Zone D</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.selectDropdown}>
              <option>All Status</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Customs Hold</option>
            </select>

            <button style={styles.addSkuBtn}>
              <FiPlus size={16} /> Add SKU
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Medicine Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Zone</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Expiry Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const status = item.status || 'Delivered';
                let badgeBg = '#f0fdf4', badgeColor = '#16a34a', borderColor = '#bbf7d0';
                if (status === 'Processing') { badgeBg = '#f5f3ff'; badgeColor = '#7c3aed'; borderColor = '#ddd6fe'; }
                if (status === 'Customs Hold') { badgeBg = '#fffbeb'; badgeColor = '#d97706'; borderColor = '#fde68a'; }

                return (
                  <tr key={item.id || index} style={styles.tdRow}>
                    <td style={styles.tdSku}>{item.sku}</td>
                    <td style={styles.tdName}>{item.name}</td>
                    <td style={styles.td}>{item.category?.name || item.category || 'General'}</td>
                    <td style={styles.td}>
                      <span style={styles.zoneBadge}>{item.zone || 'Zone A'}</span>
                    </td>
                    <td style={styles.tdQty}>{item.stock ?? item.quantity ?? 0}</td>
                    <td style={styles.td}>{item.unit || 'Units'}</td>
                    <td style={styles.tdDate}>{item.expiryDate || 'Jan 2026'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${borderColor}` }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

const styles = {
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  contentBody: { padding: '24px 32px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' },
  filterSearchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', width: '380px', gap: '10px' },
  filterInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%', color: '#0f172a' },
  toolbarRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  selectDropdown: { padding: '10px 14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#475569', fontWeight: '500', outline: 'none', cursor: 'pointer' },
  addSkuBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 20px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tdRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', fontSize: '13px', color: '#334155' },
  tdSku: { padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b', fontWeight: '600' },
  tdName: { padding: '14px 20px', fontSize: '13px', fontWeight: '700', color: '#0f172a' },
  tdQty: { padding: '14px 20px', fontSize: '14px', fontWeight: '800', color: '#0f172a' },
  tdDate: { padding: '14px 20px', fontSize: '13px', color: '#64748b' },
  zoneBadge: { padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block' }
};

export default Inventory;