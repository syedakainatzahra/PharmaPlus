import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DoctorPage from './DoctorPage';
import OnlineCustomers from './OnlineCustomers'; // Imported from your components folder
import InventoryPage from './InventoryPage'; // Placeholder for the Inventory page component
import RevenuePage from './RevenuePage';
import Settings from './Settings';
import { 
  FiDollarSign, FiUsers, FiUserCheck, FiShoppingBag, 
  FiTrendingUp, FiSearch, FiPlus, FiPhone, FiMail, FiCheckCircle, FiClock, FiAlertCircle 
} from 'react-icons/fi';

const BranchOverviewContent = () => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        const response = await fetch(
          'http://localhost:5000/api/v1/branch-managers/stats',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load branch data');
        }

        setBranchData(data);
      } catch (err) {
        console.error('Branch Stats Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.contentBody}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Branch Overview</h1>
          <p style={styles.pageSub}>Loading branch information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.contentBody}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Branch Overview</h1>
          <p style={{ ...styles.pageSub, color: '#ef4444' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const branch = branchData?.branch;
  const stats = branchData?.stats;

  return (
    <div style={styles.contentBody}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Branch Overview</h1>

        <p style={styles.pageSub}>
          {branch?.name || 'Branch'} — {branch?.location || 'Location unavailable'}
        </p>
      </div>

      <div style={styles.statsGrid}>

        {/* BRANCH */}
        <div style={styles.card}>
          <div style={styles.cardHeaderTop}>
            <span style={styles.cardTitle}>BRANCH</span>

            <div
              style={{
                ...styles.iconBox,
                backgroundColor: '#eff6ff',
                color: '#2563eb',
              }}
            >
              <FiShoppingBag size={18} />
            </div>
          </div>

          <h2 style={styles.cardMainValue}>
            {branch?.name || '—'}
          </h2>

          <p style={styles.cardSubText}>
            {branch?.code || 'No branch code'}
          </p>
        </div>

        {/* DOCTORS */}
        <div style={styles.card}>
          <div style={styles.cardHeaderTop}>
            <span style={styles.cardTitle}>DOCTORS</span>

            <div
              style={{
                ...styles.iconBox,
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
              }}
            >
              <FiUserCheck size={18} />
            </div>
          </div>

          <h2 style={styles.cardMainValue}>
            {stats?.doctorsCount ?? 0}
          </h2>

          <p style={styles.cardSubText}>
            Doctors assigned to this branch
          </p>
        </div>

        {/* PHARMACISTS */}
        <div style={styles.card}>
          <div style={styles.cardHeaderTop}>
            <span style={styles.cardTitle}>PHARMACISTS</span>

            <div
              style={{
                ...styles.iconBox,
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
              }}
            >
              <FiUsers size={18} />
            </div>
          </div>

          <h2 style={styles.cardMainValue}>
            {stats?.pharmacistsCount ?? 0}
          </h2>

          <p style={styles.cardSubText}>
            Pharmacists assigned to this branch
          </p>
        </div>

        {/* PRESCRIPTIONS */}
        <div style={styles.card}>
          <div style={styles.cardHeaderTop}>
            <span style={styles.cardTitle}>PRESCRIPTIONS</span>

            <div
              style={{
                ...styles.iconBox,
                backgroundColor: '#fffbeb',
                color: '#d97706',
              }}
            >
              <FiShoppingBag size={18} />
            </div>
          </div>

          <h2 style={styles.cardMainValue}>
            {stats?.totalPrescriptions ?? 0}
          </h2>

          <p style={styles.cardSubText}>
            Total prescriptions for this branch
          </p>
        </div>
      </div>

      {/* MEDICINE SUMMARY */}
      <div style={styles.bottomGrid}>

        <div style={styles.feedCard}>
          <div style={styles.feedHeaderRow}>
            <h3 style={styles.sectionTitle}>
              BRANCH INFORMATION
            </h3>
          </div>

          <div style={styles.feedList}>

            <div style={styles.feedItem}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: '#2563eb',
                }}
              />

              <div style={styles.feedContent}>
                <p style={styles.feedText}>
                  Branch Name
                </p>

                <div style={styles.feedMeta}>
                  <span>
                    {branch?.name || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.feedItem}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: '#10b981',
                }}
              />

              <div style={styles.feedContent}>
                <p style={styles.feedText}>
                  Branch Code
                </p>

                <div style={styles.feedMeta}>
                  <span>
                    {branch?.code || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.feedItem}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: '#9333ea',
                }}
              />

              <div style={styles.feedContent}>
                <p style={styles.feedText}>
                  Location
                </p>

                <div style={styles.feedMeta}>
                  <span>
                    {branch?.location || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.feedItem}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: '#f59e0b',
                }}
              />

              <div style={styles.feedContent}>
                <p style={styles.feedText}>
                  Branch Status
                </p>

                <div style={styles.feedMeta}>
                  <span>
                    {branch?.status || '—'}
                  </span>

                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a',
                    }}
                  >
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div style={styles.rightColumn}>

          <div style={styles.subCard}>
            <h3 style={styles.sectionTitle}>
              MEDICINE INVENTORY
            </h3>

            <div style={styles.alertList}>

              <div style={styles.alertItem}>
                <div>
                  <p style={styles.medicineName}>
                    Total Medicines
                  </p>

                  <span style={styles.batchCode}>
                    Assigned to this branch
                  </span>
                </div>

                <span
                  style={{
                    ...styles.daysBadge,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                  }}
                >
                  {stats?.totalMedicines ?? 0}
                </span>
              </div>

            </div>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.sectionTitle}>
              BRANCH STAFF SUMMARY
            </h3>

            <div style={styles.revenueRow}>

              <div style={styles.revenueMeta}>
                <span style={styles.revLabel}>
                  Doctors
                </span>

                <span style={styles.revAmount}>
                  {stats?.doctorsCount ?? 0}
                </span>
              </div>

              <div style={styles.revenueMeta}>
                <span style={styles.revLabel}>
                  Pharmacists
                </span>

                <span style={styles.revAmount}>
                  {stats?.pharmacistsCount ?? 0}
                </span>
              </div>

              <div style={styles.revenueMeta}>
                <span style={styles.revLabel}>
                  Prescriptions
                </span>

                <span style={styles.revAmount}>
                  {stats?.totalPrescriptions ?? 0}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const staffMembers = [
    { id: 'STF-101', name: 'Dr. Ayesha Khan', role: 'Medical Consultant', shift: 'Morning (08:00 - 16:00)', status: 'Present', phone: '+92 300 4567891', email: 'ayesha.khan@pharmaplus.pk', avatar: 'AK' },
    { id: 'STF-102', name: 'Rania Malik', role: 'Branch Manager', shift: 'General (09:00 - 17:00)', status: 'Present', phone: '+92 321 9876543', email: 'rania.malik@pharmaplus.pk', avatar: 'RM' },
    { id: 'STF-103', name: 'Usman Tariq', role: 'Senior Pharmacist', shift: 'Morning (08:00 - 16:00)', status: 'Present', phone: '+92 333 1122334', email: 'usman.tariq@pharmaplus.pk', avatar: 'UT' },
    { id: 'STF-104', name: 'Bilal Ahmed', role: 'Inventory Specialist', shift: 'Evening (15:00 - 23:00)', status: 'On Leave', phone: '+92 312 5566778', email: 'bilal.ahmed@pharmaplus.pk', avatar: 'BA' },
    { id: 'STF-105', name: 'Zainab Bibi', role: 'Cashier / Billing', shift: 'Morning (08:00 - 16:00)', status: 'Present', phone: '+92 302 3344556', email: 'zainab.bibi@pharmaplus.pk', avatar: 'ZB' },
    { id: 'STF-106', name: 'Kamran Akmal', role: 'Delivery Coordinator', shift: 'Evening (15:00 - 23:00)', status: 'Present', phone: '+92 345 6678899', email: 'kamran.akmal@pharmaplus.pk', avatar: 'KA' },
  ];

  const filteredStaff = staffMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.contentBody}>
      <div style={styles.pageHeaderRow}>
        <div>
          <h1 style={styles.pageTitle}>Staff Directory</h1>
          <p style={styles.pageSub}>Manage branch personnel, shift schedules, and attendance tracking.</p>
        </div>
        <button style={styles.primaryBtn}>
          <FiPlus size={16} /> Add Staff Member
        </button>
      </div>

      <div style={styles.filterCard}>
        <div style={styles.searchBoxContainer}>
          <FiSearch size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search staff by name or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterStats}>
          <span style={styles.filterBadge}>Total: 13</span>
          <span style={{ ...styles.filterBadge, backgroundColor: '#f0fdf4', color: '#16a34a' }}>Present: 11</span>
          <span style={{ ...styles.filterBadge, backgroundColor: '#fef2f2', color: '#ef4444' }}>On Leave: 2</span>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Staff Member</th>
              <th style={styles.th}>Role & Department</th>
              <th style={styles.th}>Shift Timing</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Contact Info</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <div style={styles.staffInfoCell}>
                    <div style={styles.tableAvatar}>{staff.avatar}</div>
                    <div>
                      <p style={styles.staffName}>{staff.name}</p>
                      <span style={styles.staffId}>{staff.id}</span>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.roleText}>{staff.role}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.shiftCell}>
                    <FiClock size={13} color="#64748b" />
                    <span>{staff.shift}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: staff.status === 'Present' ? '#f0fdf4' : '#fef2f2',
                    color: staff.status === 'Present' ? '#16a34a' : '#ef4444'
                  }}>
                    {staff.status === 'Present' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
                    {staff.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.contactCell}>
                    <span style={styles.contactItem}><FiPhone size={12} /> {staff.phone}</span>
                    <span style={styles.contactItem}><FiMail size={12} /> {staff.email}</span>
                  </div>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button style={styles.actionBtn}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



const BranchManager = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={styles.layoutContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.mainContent}>
        <Navbar />
        <div style={styles.outletWrapper}>
          {activeTab === 'overview' && <BranchOverviewContent />}
          {activeTab === 'staff' && <StaffPage />}
          {activeTab === 'doctor' && <DoctorPage />}
          {activeTab === 'customers' && <OnlineCustomers />}
          {activeTab === 'inventory' && <InventoryPage />}
          {activeTab === 'revenue' && <RevenuePage/>}
          {activeTab === 'settings' && <Settings/>}
        </div>
      </main>
    </div>
  );
};

const styles = {
  layoutContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  outletWrapper: { flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden', boxSizing: 'border-box' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardHeaderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  iconBox: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardMainValue: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 },
  cardSubText: { fontSize: '12px', color: '#64748b', margin: 0 },
  trendUp: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#16a34a', fontWeight: '600', marginTop: '4px' },

  bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '16px' },
  feedCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' },
  feedHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '0.05em' },
  autoRefresh: { fontSize: '11px', color: '#94a3b8', fontWeight: '500' },
  feedList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  feedItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
  feedContent: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
  feedText: { fontSize: '13px', color: '#334155', fontWeight: '500', margin: 0 },
  feedMeta: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' },
  badge: { fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', letterSpacing: '0.05em' },

  rightColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },
  subCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' },
  alertList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  alertItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f8fafc' },
  medicineName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  batchCode: { fontSize: '11px', color: '#94a3b8' },
  daysBadge: { fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' },

  revenueRow: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' },
  revenueMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  revLabel: { color: '#64748b', fontWeight: '500' },
  revAmount: { color: '#0f172a', fontWeight: '700' },
  progressBarBg: { width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' },

  filterCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchBoxContainer: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '350px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a' },
  filterStats: { display: 'flex', gap: '8px' },
  filterBadge: { fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569' },
  tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  staffInfoCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  tableAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  staffName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 },
  staffId: { fontSize: '11px', color: '#94a3b8' },
  roleText: { fontSize: '13px', color: '#334155', fontWeight: '600' },
  shiftCell: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' },
  contactCell: { display: 'flex', flexDirection: 'column', gap: '2px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' },
  actionBtn: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default BranchManager;