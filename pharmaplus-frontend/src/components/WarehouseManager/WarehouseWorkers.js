import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiEye } from 'react-icons/fi';

const WarehouseWorkers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const workers = [
    { id: 'WKR-001', name: 'Marcus Holloway', initials: 'MH', role: 'Supervisor', zone: 'Zone A – Cold Storage', shift: '06:00 - 14:00', shiftType: 'Morning Shift', phone: '+1 (555) 201-4433', status: 'Active' },
    { id: 'WKR-002', name: 'Priya Nair', initials: 'PN', role: 'Picker', zone: 'Zone B – Controlled Substances', shift: '06:00 - 14:00', shiftType: 'Morning Shift', phone: '+1 (555) 872-1190', status: 'Active' },
    { id: 'WKR-003', name: 'Daniel Ferreira', initials: 'DF', role: 'Forklift Driver', zone: 'Zone C – Bulk Storage', shift: '06:00 - 14:00', shiftType: 'Morning Shift', phone: '+1 (555) 334-5521', status: 'Active' },
    { id: 'WKR-004', name: 'Aisha Okonkwo', initials: 'AO', role: 'Packer', zone: 'Zone A – Cold Storage', shift: '06:00 - 14:00', shiftType: 'Morning Shift', phone: '+1 (555) 441-8823', status: 'Active' },
    { id: 'WKR-005', name: 'Tomáš Kovář', initials: 'TK', role: 'Picker', zone: 'Zone D – Dry Goods', shift: '14:00 - 22:00', shiftType: 'Evening Shift', phone: '+1 (555) 993-6671', status: 'On Leave' },
    { id: 'WKR-006', name: 'Yuki Tanaka', initials: 'YT', role: 'Packer', zone: 'Zone B – Controlled Substances', shift: '14:00 - 22:00', shiftType: 'Evening Shift', phone: '+1 (555) 720-4498', status: 'Active' },
    { id: 'WKR-007', name: 'Carlos Mendez', initials: 'CM', role: 'Forklift Driver', zone: 'Zone C – Bulk Storage', shift: '22:00 - 06:00', shiftType: 'Night Shift', phone: '+1 (555) 118-3309', status: 'Off Duty' },
    { id: 'WKR-008', name: 'Fatima Al-Hassan', initials: 'FA', role: 'Supervisor', zone: 'Zone D – Dry Goods', shift: '22:00 - 06:00', shiftType: 'Night Shift', phone: '+1 (555) 657-2241', status: 'Active' },
    { id: 'WKR-009', name: 'James Obi', initials: 'JO', role: 'Picker', zone: 'Zone A – Cold Storage', shift: '06:00 - 14:00', shiftType: 'Morning Shift', phone: '+1 (555) 503-8812', status: 'Active' },
    { id: 'WKR-010', name: 'Lena Volkova', initials: 'LV', role: 'Packer', zone: 'Zone C – Bulk Storage', shift: '14:00 - 22:00', shiftType: 'Evening Shift', phone: '+1 (555) 244-9907', status: 'Off Duty' },
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || worker.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || worker.status === statusFilter;
    const matchesRole = roleFilter === 'All' || worker.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <main style={styles.mainContent}>
      <div style={styles.contentBody}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.pageTitle}>Warehouse Workers</h2>
            <p style={styles.pageSub}>Staff management, shifts & performance</p>
          </div>
          <button style={styles.addBtn}>
            <FiPlus size={16} /> Add New Worker
          </button>
        </div>

        <div style={styles.statsBanner}>
          <span style={styles.statsText}>7 active · 5 checked in today</span>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.filterToolbar}>
            <div style={styles.searchBox}>
              <FiSearch size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by name or worker ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filtersRight}>
              <span style={styles.filterLabel}>Filters:</span>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={styles.dropdown}>
                <option value="All">All Roles</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Picker">Picker</option>
                <option value="Forklift Driver">Forklift Driver</option>
                <option value="Packer">Packer</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.dropdown}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>

              <span style={styles.resultCount}>{filteredWorkers.length} results</span>
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Worker ID</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Role / Designation</th>
                <th style={styles.th}>Assigned Zone</th>
                <th style={styles.th}>Shift Timing</th>
                <th style={styles.th}>Contact Number</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker, index) => {
                let badgeBg = '#f0fdf4', badgeColor = '#16a34a', border = '#bbf7d0';
                if (worker.status === 'On Leave') { badgeBg = '#fffbeb'; badgeColor = '#d97706'; border = '#fde68a'; }
                if (worker.status === 'Off Duty') { badgeBg = '#f8fafc'; badgeColor = '#64748b'; border = '#e2e8f0'; }

                let roleBg = '#f5f3ff', roleColor = '#7c3aed';
                if (worker.role === 'Picker') { roleBg = '#eff6ff'; roleColor = '#2563eb'; }
                if (worker.role === 'Forklift Driver') { roleBg = '#fff7ed'; roleColor = '#c2410c'; }
                if (worker.role === 'Packer') { roleBg = '#f0fdf4'; roleColor = '#15803d'; }

                return (
                  <tr key={index} style={styles.tdRow}>
                    <td style={styles.tdSku}>{worker.id}</td>
                    <td style={styles.tdName}>
                      <div style={styles.nameContainer}>
                        <span style={styles.avatar}>{worker.initials}</span>
                        {worker.name}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.roleBadge, backgroundColor: roleBg, color: roleColor }}>
                        {worker.role}
                      </span>
                    </td>
                    <td style={styles.td}>{worker.zone}</td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{worker.shift}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{worker.shiftType}</div>
                    </td>
                    <td style={styles.td}>{worker.phone}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${border}` }}>
                        {worker.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionIcons}>
                        <FiEdit2 size={15} color="#64748b" style={{ cursor: 'pointer' }} />
                        <FiEye size={15} color="#64748b" style={{ cursor: 'pointer' }} />
                      </div>
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
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: '#f8fafc' },
  contentBody: { padding: '24px 32px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  statsBanner: { marginBottom: '20px', fontSize: '13px', color: '#475569', fontWeight: '500' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  filterToolbar: { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', gap: '16px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', width: '340px', gap: '10px' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%', color: '#0f172a' },
  filtersRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterLabel: { fontSize: '12px', fontWeight: '600', color: '#64748b' },
  dropdown: { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#475569', fontWeight: '500', outline: 'none', cursor: 'pointer' },
  resultCount: { fontSize: '12px', color: '#64748b', fontWeight: '600', marginLeft: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 20px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tdRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', fontSize: '13px', color: '#334155' },
  tdSku: { padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b', fontWeight: '600' },
  tdName: { padding: '14px 20px', fontSize: '13px', fontWeight: '700', color: '#0f172a' },
  nameContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  roleBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', display: 'inline-block' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block' },
  actionIcons: { display: 'flex', alignItems: 'center', gap: '12px' }
};

export default WarehouseWorkers;