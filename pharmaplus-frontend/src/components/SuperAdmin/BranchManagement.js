import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiSearch, 
  FiHome, 
  FiPlus, 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiSlash,
  FiAlertTriangle,
  FiX
} from 'react-icons/fi';

const BranchManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const API_BASE_URL = 'https://pharmaplus-production-7fa8.up.railway.app/api/v1/branches';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/all`, getAuthHeaders());
      if (response.data.success) {
        setBranches(response.data.branches);
      }
    } catch (error) {
      console.error('Error fetching branches:', error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleToggleStatus = async (branchId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/toggle/${branchId}`,
        {},
        getAuthHeaders()
      );
      if (response.data.success) {
        setBranches((prev) =>
          prev.map((b) =>
            b.id === branchId ? { ...b, isActive: response.data.branch.isActive, status: response.data.branch.isActive ? 'Active' : 'Disabled' } : b
          )
        );
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Action failed!');
    }
  };

  // Open Custom Modal instead of window.confirm
  const confirmDelete = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  // Actual Delete API Request
  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${branchToDelete.id}`, getAuthHeaders());
      if (response.data.success) {
        setBranches(prev => prev.filter(b => b.id !== branchToDelete.id));
        setShowDeleteModal(false);
        setBranchToDelete(null);
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Branch delete karne mein masla aaya!');
      setShowDeleteModal(false);
    }
  };

  // Filter Logic
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (branch.location && branch.location.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (branch.code && branch.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const isBranchActive = branch.isActive !== undefined ? branch.isActive : (branch.status === 'Active');
    const matchesStatus = statusFilter === 'All Status' || 
                          (statusFilter === 'Active' && isBranchActive) || 
                          (statusFilter === 'Disabled' && !isBranchActive);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (isActive) => {
    if (isActive) {
      return { backgroundColor: '#e6f4ea', color: '#137333' };
    } else {
      return { backgroundColor: '#f1f3f4', color: '#5f6368' };
    }
  };

  const activeCount = branches.filter(b => b.isActive !== false && b.status !== 'Disabled').length;
  const disabledCount = branches.filter(b => b.isActive === false || b.status === 'Disabled').length;

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>Loading Branch Data...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Branch Management</h1>
          <p style={styles.pageSubtitle}>
            Manage all network branches, assignments, and performance.
          </p>
        </div>
        <button style={styles.addBranchBtn}>
          <FiPlus size={16} /> Add Branch
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiActiveCard}>
          <div style={styles.kpiActiveNumber}>{activeCount}</div>
          <div style={styles.kpiActiveLabel}>Active Branches</div>
        </div>
        <div style={styles.kpiMaintenanceCard}>
          <div style={styles.kpiMaintenanceNumber}>0</div>
          <div style={styles.kpiMaintenanceLabel}>Under Maintenance</div>
        </div>
        <div style={styles.kpiDisabledCard}>
          <div style={styles.kpiDisabledNumber}>{disabledCount}</div>
          <div style={styles.kpiDisabledLabel}>Disabled</div>
        </div>
      </div>

      {/* Main Table Card Container */}
      <div style={styles.tableCard}>
        {/* Search & Filter Bar */}
        <div style={styles.filterRow}>
          <div style={styles.searchInputWrapper}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            style={styles.filterSelect}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        {/* Branches Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>BRANCH</th>
              <th style={styles.th}>CODE</th>
              <th style={styles.th}>LOCATION</th>
              <th style={styles.th}>PHONE</th>
              <th style={styles.th}>STAFF</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map((item) => {
              const isActive = item.isActive !== undefined ? item.isActive : true;
              const statusText = isActive ? 'Active' : 'Disabled';
              
              return (
                <tr key={item.id} style={styles.tdRow}>
                  {/* Branch Name with Icon */}
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.branchIconBox}>
                        <FiHome style={{ color: '#1a56db', fontSize: '14px' }} />
                      </div>
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td style={{ ...styles.td, color: '#374151', fontSize: '13px' }}>{item.code || '—'}</td>
                  <td style={{ ...styles.td, color: '#6b7280', fontSize: '13px' }}>{item.location}</td>
                  <td style={{ ...styles.td, color: '#374151', fontSize: '13px' }}>{item.phone || '—'}</td>
                  <td style={{ ...styles.td, color: '#374151', fontSize: '13px' }}>{item._count?.users || 0} Staff</td>
                  
                  {/* Status Badge */}
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(isActive) }}>
                      <span style={{
                        height: '6px',
                        width: '6px',
                        borderRadius: '50%',
                        backgroundColor: getStatusBadgeStyle(isActive).color,
                        display: 'inline-block'
                      }} />
                      {statusText}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button style={styles.actionBtnView}>
                        <FiEye size={12} /> View
                      </button>
                      <button style={styles.actionBtnEdit}>
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button 
                        style={isActive ? styles.actionBtnDisable : styles.actionBtnEnable}
                        onClick={() => handleToggleStatus(item.id)}
                      >
                        {isActive ? <FiSlash size={12} /> : <FiCheckCircle size={12} />}
                        {isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        style={styles.actionBtnDelete}
                        onClick={() => confirmDelete(item)}
                      >
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredBranches.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                  No branches match your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalIconBox}>
              <FiAlertTriangle size={24} color="#dc2626" />
            </div>
            <h3 style={styles.modalTitle}>Are you sure you want to delete?</h3>
            <p style={styles.modalDesc}>
              This action cannot be undone. This will permanently delete 
              <strong style={{ color: '#0f172a' }}> {branchToDelete?.name}</strong> and remove its data from the system.
            </p>
            <div style={styles.modalBtnRow}>
              <button 
                style={styles.modalCancelBtn} 
                onClick={() => { setShowDeleteModal(false); setBranchToDelete(null); }}
              >
                Cancel
              </button>
              <button 
                style={styles.modalConfirmDeleteBtn} 
                onClick={handleDeleteBranch}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '28px 36px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  addBranchBtn: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '24px'
  },
  kpiActiveCard: {
    backgroundColor: '#e6f4ea',
    border: '1px solid #ceead6',
    borderRadius: '12px',
    padding: '24px'
  },
  kpiActiveNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#137333',
    lineHeight: '1.1'
  },
  kpiActiveLabel: {
    fontSize: '14px',
    color: '#137333',
    marginTop: '6px',
    fontWeight: '500'
  },
  kpiMaintenanceCard: {
    backgroundColor: '#fef7e0',
    border: '1px solid #feefc3',
    borderRadius: '12px',
    padding: '24px'
  },
  kpiMaintenanceNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#b06000',
    lineHeight: '1.1'
  },
  kpiMaintenanceLabel: {
    fontSize: '14px',
    color: '#b06000',
    marginTop: '6px',
    fontWeight: '500'
  },
  kpiDisabledCard: {
    backgroundColor: '#f1f3f4',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px'
  },
  kpiDisabledNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#5f6368',
    lineHeight: '1.1'
  },
  kpiDisabledLabel: {
    fontSize: '14px',
    color: '#5f6368',
    marginTop: '6px',
    fontWeight: '500'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    overflow: 'hidden'
  },
  filterRow: {
    padding: '16px 20px',
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  searchInputWrapper: {
    width: '320px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 12px'
  },
  searchIcon: {
    fontSize: '14px',
    marginRight: '8px',
    color: '#94a3b8'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    width: '100%',
    color: '#0f172a'
  },
  filterSelect: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '12px 20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em'
  },
  tdRow: {
    borderBottom: '1px solid #f1f5f9',
    height: '56px'
  },
  td: {
    padding: '12px 20px',
    verticalAlign: 'middle'
  },
  branchIconBox: {
    width: '32px',
    height: '32px',
    backgroundColor: '#eff6ff',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  actionBtnView: {
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionBtnEdit: {
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionBtnDisable: {
    border: 'none',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionBtnEnable: {
    border: 'none',
    backgroundColor: '#e6f4ea',
    color: '#137333',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionBtnDelete: {
    border: 'none',
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  // Modal Custom Styling
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    textAlign: 'center',
    animation: 'fadeIn 0.2s ease-in-out'
  },
  modalIconBox: {
    width: '48px',
    height: '48px',
    backgroundColor: '#fef2f2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px'
  },
  modalDesc: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  modalBtnRow: {
    display: 'flex',
    gap: '12px'
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modalConfirmDeleteBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default BranchManagement;