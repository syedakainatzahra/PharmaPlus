import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiHome, 
  FiPlus, 
  FiBell, 
  FiChevronDown, 
  FiAlertCircle,
  FiCheck,
  FiX,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

const Navbar = ({ onSearch }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Branch Switcher States
  const [branches, setBranches] = useState([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem('selectedBranchName') || 'All Branches'
  );

  // Profile Dropdown State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // 1. Fetch Notifications & Branches from Backend on Mount
  useEffect(() => {
    fetchNotifications();
    fetchBranches();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications || data.data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Seed.js / Backend branches endpoint
  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://pharmaplus-production-7fa8.up.railway.app/api/v1/branches/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Backend response format ke mutabiq branches array set karna
        const branchList = data.branches || data.data || data || [];
        setBranches(branchList);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  // 2. Handle Accept User Request (Status -> ACTIVE)
  const handleAccept = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      });
      const data = await response.json();
      if (response.ok) {
        alert('User approved successfully!');
        fetchNotifications();
      } else {
        alert(data.message || 'Failed to approve user');
      }
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  // 3. Handle Decline User Request (Delete User)
  const handleDecline = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert('User request declined and deleted.');
        fetchNotifications();
      } else {
        alert(data.message || 'Failed to decline user');
      }
    } catch (err) {
      console.error('Error declining user:', err);
    }
  };

  // 4. Actual Search Backend Integration
  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Search results:', data);
          if (onSearch) onSearch(data);
        } else {
          alert('Search failed');
        }
      } catch (err) {
        console.error('Error executing search:', err);
      }
    }
  };

  // 5. Branch Selection Handler
  const handleBranchSelect = (branch) => {
    const branchName = branch ? (branch.name || branch.branchName || branch) : 'All Branches';
    const branchId = branch ? (branch.id || branch._id) : '';
    
    setSelectedBranch(branchName);
    localStorage.setItem('selectedBranchName', branchName);
    localStorage.setItem('selectedBranchId', branchId);
    setShowBranchDropdown(false);
    
    window.location.reload(); 
  };

  // 6. Quick Action Handler
  const handleQuickAction = () => {
    alert('Quick Action triggered.');
  };

  // 7. Backend Logout Handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('https://pharmaplus-production-7fa8.up.railway.app/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <header style={styles.navbarContainer}>
      <div style={styles.leftSectionPlaceholder}></div>

      {/* Middle Section: Search Bar */}
      <div style={styles.searchWrapper}>
        <FiSearch style={styles.searchIcon} size={16} />
        <input
          type="text"
          placeholder="Search patients, doctors, invoices, branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          style={styles.searchInput}
        />
        <div style={styles.kbdShortcut}>⌘K</div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        
        {/* Branch Switcher Dropdown (Connected to seed/backend branches) */}
        <div style={{ position: 'relative' }}>
          <button 
            style={styles.branchSelectBtn}
            onClick={() => {
              setShowBranchDropdown(!showBranchDropdown);
              setShowDropdown(false);
              setShowProfileDropdown(false);
            }}
          >
            <FiHome size={15} color="#475569" />
            <span>{selectedBranch}</span>
            <FiChevronDown size={14} color="#94a3b8" />
          </button>

          {showBranchDropdown && (
            <div style={styles.dropdownMenuBranch}>
              <div 
                style={styles.dropdownItem}
                onClick={() => handleBranchSelect(null)}
              >
                All Branches
              </div>
              {branches.map((branch, idx) => (
                <div 
                  key={branch.id || branch._id || idx}
                  style={styles.dropdownItem}
                  onClick={() => handleBranchSelect(branch)}
                >
                  {branch.name || branch.branchName || branch}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button style={styles.quickActionBtn} onClick={handleQuickAction}>
          <FiPlus size={16} />
          <span>Quick Action</span>
        </button>

        {/* Notification Bell Icon & Dropdown */}
        <div style={styles.notificationBox}>
          <button 
            style={styles.iconBtn} 
            title="Notifications"
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowBranchDropdown(false);
              setShowProfileDropdown(false);
            }}
          >
            <FiBell size={18} color="#475569" />
          </button>
          
          {notifications.length > 0 && (
            <span style={styles.notificationBadge}>{notifications.length}</span>
          )}

          {showDropdown && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownHeader}>
                <span>Notifications & Requests</span>
                <span style={styles.badgeCount}>{notifications.length} New</span>
              </div>

              <div style={styles.dropdownBody}>
                {notifications.length === 0 ? (
                  <div style={styles.noNotifications}>No new requests found.</div>
                ) : (
                  notifications.map((item, index) => (
                    <div key={item.id || index} style={styles.notificationItem}>
                      <div style={styles.notificationIconContainer}>
                        <FiAlertCircle size={16} color="#319795" />
                      </div>
                      <div style={styles.notificationContent}>
                        <p style={styles.notificationText}>
                          {item.message || item.title || 'New system request received.'}
                        </p>
                        <span style={styles.notificationTime}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Just now'}
                        </span>
                      </div>
                      <div style={styles.actionButtons}>
                        <button 
                          style={styles.acceptBtn} 
                          onClick={() => handleAccept(item.id)}
                          title="Accept Request"
                        >
                          <FiCheck size={14} />
                        </button>
                        <button 
                          style={styles.declineBtn} 
                          onClick={() => handleDecline(item.id)}
                          title="Decline Request"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown & Logout */}
        <div style={{ position: 'relative' }}>
          <button 
            style={styles.profileBtn}
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowDropdown(false);
              setShowBranchDropdown(false);
            }}
          >
            <div style={styles.avatar}>SK</div>
            <div style={styles.profileText}>
              <span style={styles.userName}>Syeda Kainat</span>
              <span style={styles.userRole}>SUPER ADMIN</span>
            </div>
            <FiChevronDown size={14} color="#94a3b8" />
          </button>

          {showProfileDropdown && (
            <div style={styles.dropdownMenuProfile}>
              <div style={styles.profileItem} onClick={() => alert('Profile settings opened')}>
                <FiUser size={14} /> Profile
              </div>
              <div style={styles.profileItem} onClick={() => alert('System settings opened')}>
                <FiSettings size={14} /> Settings
              </div>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
              <div style={{ ...styles.profileItem, color: '#ef4444' }} onClick={handleLogout}>
                <FiLogOut size={14} /> Logout
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

const styles = {
  navbarContainer: {
    height: '60px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    position: 'relative',
    zIndex: 90,
    boxSizing: 'border-box'
  },
  leftSectionPlaceholder: {
    display: 'flex',
    alignItems: 'center'
  },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '350px' },
  searchIcon: { position: 'absolute', left: '12px', color: '#94a3b8' },
  searchInput: { width: '100%', height: '36px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', paddingLeft: '36px', paddingRight: '44px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  kbdShortcut: { position: 'absolute', right: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' },
  rightSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  branchSelectBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: '500', color: '#334155', cursor: 'pointer' },
  dropdownMenuBranch: { position: 'absolute', right: 0, top: '44px', width: '190px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden', maxHeight: '220px', overflowY: 'auto' },
  dropdownItem: { padding: '10px 14px', fontSize: '12px', color: '#334155', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' },
  quickActionBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: '600', color: '#ffffff', cursor: 'pointer' },
  notificationBox: { position: 'relative' },
  iconBtn: { width: '36px', height: '36px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  notificationBadge: { position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: '700', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' },
  
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: '44px',
    width: '340px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    zIndex: 1000,
    overflow: 'hidden'
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e3a8a',
    backgroundColor: '#f8fafc'
  },
  badgeCount: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700'
  },
  dropdownBody: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  noNotifications: {
    padding: '20px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '13px'
  },
  notificationItem: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    alignItems: 'center',
    transition: 'background 0.2s'
  },
  notificationIconContainer: {
    marginTop: '2px'
  },
  notificationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1
  },
  notificationText: {
    margin: 0,
    fontSize: '12px',
    color: '#334155',
    lineHeight: '1.4'
  },
  notificationTime: {
    fontSize: '10px',
    color: '#94a3b8'
  },
  actionButtons: {
    display: 'flex',
    gap: '6px'
  },
  acceptBtn: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: 'none',
    borderRadius: '6px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  declineBtn: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    borderRadius: '6px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  profileBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px 4px 4px', cursor: 'pointer' },
  dropdownMenuProfile: { position: 'absolute', right: 0, top: '44px', width: '150px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' },
  profileItem: { padding: '10px 14px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },

  avatar: { width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1e3a8a', color: '#ffffff', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  profileText: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  userName: { fontSize: '12px', fontWeight: '600', color: '#0f172a', lineHeight: 1.2 },
  userRole: { fontSize: '8px', fontWeight: '700', color: '#1e3a8a', letterSpacing: '0.04em' }
};

export default Navbar;