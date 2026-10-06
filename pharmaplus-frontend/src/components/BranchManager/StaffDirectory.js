import React, { useState,useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { FiSearch, FiUsers } from 'react-icons/fi';

const StaffDirectory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        const response = await fetch(
          'http://localhost:5000/api/v1/branch-managers/staff',
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
          throw new Error(data.message || 'Failed to load staff');
        }

        const formattedStaff = (data.staff || []).map((member, index) => ({
          id: member.employeeId || `STAFF-${String(index + 1).padStart(3, '0')}`,
          name: member.fullName,
          role: member.role,
          dept: getDepartment(member.role),
          phone: member.phone || '—',
          email: member.email,
          shift: '—',
          today: '—',
          attendance: '—',
          status: formatStatus(member.status),
          avatarBg: getAvatarColor(index),
        }));

        setStaffMembers(formattedStaff);
      } catch (err) {
        console.error('Staff Directory Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const getDepartment = (role) => {
    switch (role) {
      case 'DOCTOR':
        return 'Medical';
      case 'PHARMACIST':
        return 'Pharmacy';
      case 'RECEPTIONIST':
        return 'Administration';
      case 'BRANCH_MANAGER':
        return 'Management';
      case 'DELIVERY_RIDER':
        return 'Logistics';
      default:
        return 'Staff';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';

    switch (status) {
      case 'ACTIVE':
        return 'Present';
      case 'ON_LEAVE':
        return 'On Leave';
      case 'INACTIVE':
      case 'SUSPENDED':
        return 'Absent';
      default:
        return status;
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      '#2563eb',
      '#7c3aed',
      '#059669',
      '#d97706',
      '#dc2626',
      '#0284c7',
      '#8b5cf6',
      '#e11d48',
    ];

    return colors[index % colors.length];
  };

  const filteredStaff = staffMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      member.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      member.id.toLowerCase().includes(searchFilter.toLowerCase());

    if (activeTab === 'present') {
      return matchesSearch && member.status === 'Present';
    }

    if (activeTab === 'absent') {
      return matchesSearch && member.status === 'Absent';
    }

    if (activeTab === 'leave') {
      return matchesSearch && member.status === 'On Leave';
    }

    return matchesSearch;
  });

  const totalStaff = staffMembers.length;
  const presentStaff = staffMembers.filter(
    (member) => member.status === 'Present'
  ).length;

  const absentStaff = staffMembers.filter(
    (member) => member.status === 'Absent'
  ).length;

  const leaveStaff = staffMembers.filter(
    (member) => member.status === 'On Leave'
  ).length;

  if (loading) {
    return (
      <div style={styles.layoutContainer}>
        <Sidebar />

        <main style={styles.mainContent}>
          <Navbar />

          <div style={styles.contentBody}>
            <h1 style={styles.pageTitle}>Staff Directory</h1>
            <p style={styles.pageSub}>Loading branch staff...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.layoutContainer}>
        <Sidebar />

        <main style={styles.mainContent}>
          <Navbar />

          <div style={styles.contentBody}>
            <h1 style={styles.pageTitle}>Staff Directory</h1>

            <p
              style={{
                ...styles.pageSub,
                color: '#ef4444',
              }}
            >
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.layoutContainer}>
      <Sidebar />

      <main style={styles.mainContent}>
        <Navbar />

        <div style={styles.contentBody}>

          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Staff Directory</h1>

            <p style={styles.pageSub}>
              All {totalStaff} employees assigned to your branch
            </p>
          </div>

          <div style={styles.filterBar}>

            <div style={styles.tabButtons}>

              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'all' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('all')}
              >
                <span
                  style={{
                    ...styles.tabCount,
                    ...(activeTab === 'all'
                      ? styles.activeCount
                      : {}),
                  }}
                >
                  {totalStaff}
                </span>

                All Staff
              </button>

              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'present'
                    ? styles.activeTab
                    : {}),
                }}
                onClick={() => setActiveTab('present')}
              >
                <span
                  style={{
                    ...styles.tabCount,
                    ...(activeTab === 'present'
                      ? styles.activeCount
                      : {}),
                  }}
                >
                  {presentStaff}
                </span>

                Present
              </button>

              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'absent'
                    ? styles.activeTab
                    : {}),
                }}
                onClick={() => setActiveTab('absent')}
              >
                <span
                  style={{
                    ...styles.tabCount,
                    ...(activeTab === 'absent'
                      ? styles.activeCount
                      : {}),
                  }}
                >
                  {absentStaff}
                </span>

                Absent
              </button>

              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'leave'
                    ? styles.activeTab
                    : {}),
                }}
                onClick={() => setActiveTab('leave')}
              >
                <span
                  style={{
                    ...styles.tabCount,
                    ...(activeTab === 'leave'
                      ? styles.activeCount
                      : {}),
                  }}
                >
                  {leaveStaff}
                </span>

                On Leave
              </button>

            </div>

            <div style={styles.searchBox}>
              <FiSearch size={16} color="#94a3b8" />

              <input
                type="text"
                placeholder="Search staff..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={styles.searchInput}
              />
            </div>

          </div>

          <div style={styles.tableCard}>

            <table style={styles.table}>

              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>EMPLOYEE</th>
                  <th style={styles.th}>ROLE & DEPT</th>
                  <th style={styles.th}>CONTACT</th>
                  <th style={styles.th}>SHIFT</th>
                  <th style={styles.th}>TODAY</th>
                  <th style={styles.th}>ATTENDANCE</th>
                  <th style={styles.th}>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#64748b',
                      }}
                    >
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      style={styles.tableRow}
                    >

                      <td style={styles.td}>
                        <div style={styles.employeeCell}>

                          <div
                            style={{
                              ...styles.avatar,
                              backgroundColor: member.avatarBg,
                            }}
                          >
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p style={styles.empName}>
                              {member.name}
                            </p>

                            <span style={styles.empId}>
                              {member.id}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td style={styles.td}>
                        <p style={styles.empRole}>
                          {member.role}
                        </p>

                        <span style={styles.empDept}>
                          {member.dept}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <p style={styles.empPhone}>
                          {member.phone}
                        </p>

                        <span style={styles.empEmail}>
                          {member.email}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.shiftText}>
                          {member.shift}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.todayText,
                            color:
                              member.today === '—'
                                ? '#94a3b8'
                                : '#10b981',
                          }}
                        >
                          {member.today}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.attendanceWrapper}>

                          <div style={styles.progressBarBg}>
                            <div
                              style={{
                                ...styles.progressBarFill,
                                width:
                                  member.attendance === '—'
                                    ? '0%'
                                    : member.attendance,
                                backgroundColor:
                                  member.attendance !== '—' &&
                                  parseInt(member.attendance) > 90
                                    ? '#10b981'
                                    : '#f59e0b',
                              }}
                            />
                          </div>

                          <span style={styles.attendancePct}>
                            {member.attendance}
                          </span>

                        </div>
                      </td>

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor:
                              member.status === 'Present'
                                ? '#f0fdf4'
                                : member.status === 'Absent'
                                ? '#fef2f2'
                                : '#fffbeb',

                            color:
                              member.status === 'Present'
                                ? '#16a34a'
                                : member.status === 'Absent'
                                ? '#ef4444'
                                : '#d97706',
                          }}
                        >
                          {member.status}
                        </span>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>
      </main>
    </div>
  );
};
const styles = {
  layoutContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },

  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tabButtons: { display: 'flex', gap: '8px' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  activeTab: { backgroundColor: '#ffffff', borderColor: '#2563eb', color: '#2563eb' },
  tabCount: { backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px' },
  activeCount: { backgroundColor: '#eff6ff', color: '#2563eb' },

  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', gap: '10px', width: '260px' },
  searchInput: { border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a' },

  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },

  employeeCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 },
  empName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: '1.2' },
  empId: { fontSize: '11px', color: '#94a3b8' },

  empRole: { fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0, lineHeight: '1.2' },
  empDept: { fontSize: '11px', color: '#94a3b8' },

  empPhone: { fontSize: '13px', fontWeight: '600', color: '#334155', margin: 0, lineHeight: '1.2' },
  empEmail: { fontSize: '11px', color: '#94a3b8' },

  shiftText: { fontSize: '13px', color: '#475569', fontWeight: '500' },
  todayText: { fontSize: '13px', fontWeight: '700' },

  attendanceWrapper: { display: 'flex', alignItems: 'center', gap: '10px', width: '140px' },
  progressBarBg: { flex: 1, height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '3px' },
  attendancePct: { fontSize: '12px', fontWeight: '700', color: '#475569', width: '32px' },

  statusBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.05em' }
};

export default StaffDirectory;