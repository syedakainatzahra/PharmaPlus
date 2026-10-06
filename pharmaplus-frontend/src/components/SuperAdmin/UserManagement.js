import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  ChevronDown,
  UserCheck,
  UserX,
  UserMinus,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/users', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();
      if (data.success) {
        // Filter out patients and map user data
        const formattedUsers = data.users
          .filter(user => user.role !== 'PATIENT' && user.role !== 'Patient')
          .map((user) => ({
            id: user.id,
            name: user.fullName,
            email: user.email,
            initials: user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
            avatarBg: '#1e3a8a',
            role: user.role,
            branch: user.branch?.name || 'Main Branch',
            status: user.status || 'Active',
            lastActive: 'Just now',
            created: new Date(user.createdAt).toLocaleDateString()
          }));
        setUsersData(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setActiveMenu(null);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setActiveMenu(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredUsers.map((u) => u.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#dcfce7', icon: <UserCheck size={11} color="#16a34a" /> };
      case 'Pending':
        return { bg: '#fef9c3', color: '#ca8a04', border: '#fef08a', icon: <Clock size={11} color="#ca8a04" /> };
      case 'Suspended':
      case 'Rejected':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fee2e2', icon: <UserX size={11} color="#dc2626" /> };
      case 'Inactive':
        return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', icon: <UserMinus size={11} color="#64748b" /> };
      default:
        return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>User & Staff Management</h2>
          <p style={styles.subtitle}>Manage staff roles, branch assignments, and registration requests.</p>
        </div>
      </div>

      <div style={styles.filterRow}>
        <div style={styles.searchWrapper}>
          <Search size={15} color="#94a3b8" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.selectWrapper}>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={styles.selectInput}>
            <option>All Roles</option>
            <option>DOCTOR</option>
            <option>PHARMACIST</option>
            <option>WAREHOUSE_MANAGER</option>
            <option>Admin</option>
            <option>Branch Manager</option>
            <option>Warehouse Staff</option>
            <option>General Staff</option>
            <option>Security Guard</option>
          </select>
          <ChevronDown size={14} color="#64748b" style={styles.selectIcon} />
        </div>

        <button style={styles.moreFiltersBtn}>
          <SlidersHorizontal size={14} color="#64748b" />
          <span>More Filters</span>
        </button>
      </div>

      <div style={styles.tableWrapper}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading users from backend...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                    style={styles.checkbox}
                  />
                </th>
                <th style={styles.th}>USER</th>
                <th style={styles.th}>ROLE</th>
                <th style={styles.th}>BRANCH</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>LAST ACTIVE</th>
                <th style={styles.th}>CREATED</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const statusStyle = getStatusBadge(user.status);
                  return (
                    <tr key={user.id} style={styles.tr}>
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(user.id)}
                          onChange={() => handleSelectRow(user.id)}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.userInfo}>
                          <div style={{ ...styles.avatar, backgroundColor: user.avatarBg }}>
                            {user.initials}
                          </div>
                          <div>
                            <div style={styles.userName}>{user.name}</div>
                            <div style={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.cellWithIcon}>
                          <Briefcase size={13} color="#94a3b8" />
                          <span style={{ color: '#334155' }}>{user.role}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.cellWithIcon}>
                          <MapPin size={13} color="#94a3b8" />
                          <span style={{ color: '#334155' }}>{user.branch}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ 
                          ...styles.badge, 
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`
                        }}>
                          {statusStyle.icon}
                          <span>{user.status}</span>
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.cellWithIcon}>
                          <Clock size={12} color="#94a3b8" />
                          <span style={{ color: '#64748b' }}>{user.lastActive}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.cellWithIcon}>
                          <Calendar size={12} color="#94a3b8" />
                          <span style={{ color: '#64748b' }}>{user.created}</span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', position: 'relative' }}>
                        <button 
                          style={styles.actionBtn}
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        >
                          <MoreVertical size={16} color="#94a3b8" />
                        </button>

                        {activeMenu === user.id && (
                          <div style={styles.dropdownMenu}>
                            {user.status === 'Pending' && (
                              <>
                                <div 
                                  style={{ ...styles.menuItem, color: '#16a34a' }}
                                  onClick={() => handleUpdateStatus(user.id, 'Active')}
                                >
                                  <CheckCircle size={13} color="#16a34a" />
                                  <span>Approve</span>
                                </div>
                                <div 
                                  style={{ ...styles.menuItem, color: '#dc2626' }}
                                  onClick={() => handleUpdateStatus(user.id, 'Rejected')}
                                >
                                  <XCircle size={13} color="#dc2626" />
                                  <span>Reject</span>
                                </div>
                              </>
                            )}
                            <div style={styles.menuItem}>
                              <Eye size={13} color="#64748b" />
                              <span>View Details</span>
                            </div>
                            <div style={styles.menuItem}>
                              <Edit size={13} color="#64748b" />
                              <span>Edit User</span>
                            </div>
                            <div 
                              style={{ ...styles.menuItem, color: '#dc2626' }}
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={13} color="#dc2626" />
                              <span>Delete</span>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  cardContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
  filterRow: { display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
  searchWrapper: { position: 'relative', flex: '1', minWidth: '240px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { width: '100%', padding: '8px 12px 8px 34px', fontSize: '13px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' },
  selectWrapper: { position: 'relative', minWidth: '120px' },
  selectInput: { width: '100%', appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 28px 8px 12px', fontSize: '13px', color: '#334155', cursor: 'pointer', outline: 'none' },
  selectIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  moreFiltersBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' },
  th: { padding: '12px 10px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '14px 10px', verticalAlign: 'middle' },
  checkbox: { borderRadius: '4px', borderColor: '#cbd5e1', cursor: 'pointer' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', color: '#ffffff', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userName: { fontWeight: '600', color: '#0f172a', fontSize: '13px' },
  userEmail: { fontSize: '12px', color: '#94a3b8' },
  cellWithIcon: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' },
  dropdownMenu: { position: 'absolute', right: '10px', top: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, width: '130px', padding: '4px 0' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', color: '#334155', cursor: 'pointer', transition: 'background-color 0.15s' }
};

export default UserManagement;