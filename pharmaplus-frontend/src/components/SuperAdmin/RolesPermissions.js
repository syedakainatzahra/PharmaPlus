import React, { useState } from 'react';

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('Doctor');

  const roles = [
    { id: 'sa', name: 'Super Admin', badge: 'SA', color: '#1e3a8a' },
    { id: 'bm', name: 'Branch Manager', badge: 'BM', color: '#0284c7' },
    { id: 'doc', name: 'Doctor', badge: 'D', color: '#059669' },
    { id: 'pharm', name: 'Pharmacist', badge: 'P', color: '#7c3aed' },
    { id: 'rec', name: 'Receptionist', badge: 'R', color: '#d97706' },
    { id: 'pat', name: 'Patient', badge: 'P', color: '#64748b' }
  ];

  // Permissions state categorized by modules
  const [permissions, setPermissions] = useState({
    DASHBOARD: [
      { id: 'view_dashboard', label: 'View Dashboard', enabled: true },
      { id: 'view_analytics', label: 'View Analytics', enabled: true },
      { id: 'export_reports', label: 'Export Reports', enabled: true }
    ],
    PATIENTS: [
      { id: 'view_patients', label: 'View Patients', enabled: true },
      { id: 'create_patient', label: 'Create Patient', enabled: true },
      { id: 'edit_patient', label: 'Edit Patient', enabled: true },
      { id: 'delete_patient', label: 'Delete Patient', enabled: false }
    ],
    PHARMACY: [
      { id: 'view_inventory', label: 'View Inventory', enabled: true },
      { id: 'dispense_medicine', label: 'Dispense Medicine', enabled: true },
      { id: 'manage_inventory', label: 'Manage Inventory', enabled: true }
    ],
    BILLING: [
      { id: 'view_invoices', label: 'View Invoices', enabled: true },
      { id: 'create_invoice', label: 'Create Invoice', enabled: true },
      { id: 'refund_invoice', label: 'Refund Invoice', enabled: false }
    ],
    STAFF: [
      { id: 'view_staff', label: 'View Staff', enabled: true },
      { id: 'create_staff', label: 'Create Staff', enabled: true },
      { id: 'delete_staff', label: 'Delete Staff', enabled: false }
    ],
    SYSTEM: [
      { id: 'view_audit_logs', label: 'View Audit Logs', enabled: true },
      { id: 'manage_settings', label: 'Manage Settings', enabled: false },
      { id: 'database_backup', label: 'Database Backup', enabled: false }
    ]
  });

  const handleToggle = (category, itemIndex) => {
    setPermissions(prev => {
      const updatedCat = [...prev[category]];
      updatedCat[itemIndex] = {
        ...updatedCat[itemIndex],
        enabled: !updatedCat[itemIndex].enabled
      };
      return { ...prev, [category]: updatedCat };
    });
  };

  const currentRoleObj = roles.find(r => r.name === selectedRole) || roles[2];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Roles & Permissions</h1>
        <p style={styles.pageSubtitle}>
          Define access levels and permission scopes for each role.
        </p>
      </div>

      {/* Main Grid */}
      <div style={styles.layoutGrid}>
        {/* Left Sidebar Roles List */}
        <div style={styles.rolesCard}>
          <div style={styles.rolesHeader}>Roles</div>
          <div style={{ padding: '8px' }}>
            {roles.map((role) => {
              const isSelected = selectedRole === role.name;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.name)}
                  style={{
                    ...styles.roleItemBtn,
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent'
                  }}
                >
                  <div style={{ ...styles.roleBadge, backgroundColor: role.color }}>
                    {role.badge}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? '#1d4ed8' : '#334155'
                  }}>
                    {role.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Matrix */}
        <div style={styles.matrixContainer}>
          {/* Header Banner */}
          <div style={styles.matrixHeaderCard}>
            <div style={{ ...styles.matrixRoleBadge, backgroundColor: currentRoleObj.color }}>
              {currentRoleObj.badge}
            </div>
            <div>
              <h2 style={styles.matrixTitle}>{selectedRole} — Permission Matrix</h2>
              <p style={styles.matrixSubtitle}>Configure granular access permissions for this role</p>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={styles.matrixGrid}>
            {Object.keys(permissions).map((category) => (
              <div key={category} style={styles.permCard}>
                <div style={styles.permCardHeader}>{category}</div>
                <div style={styles.permCardBody}>
                  {permissions[category].map((perm, idx) => (
                    <div key={perm.id} style={styles.permRow}>
                      <span style={{
                        fontSize: '13px',
                        color: perm.enabled ? '#0f172a' : '#94a3b8',
                        fontWeight: perm.enabled ? '500' : '400'
                      }}>
                        {perm.label}
                      </span>

                      {/* Switch Toggle */}
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          checked={perm.enabled}
                          onChange={() => handleToggle(category, idx)}
                          style={{ display: 'none' }}
                        />
                        <span style={{
                          ...styles.slider,
                          backgroundColor: perm.enabled ? '#1e3a8a' : '#cbd5e1'
                        }}>
                          <span style={{
                            ...styles.sliderCircle,
                            transform: perm.enabled ? 'translateX(16px)' : 'translateX(0px)'
                          }} />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  rolesCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  rolesHeader: {
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9'
  },
  roleItemBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    textAlign: 'left'
  },
  roleBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matrixContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  matrixHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  matrixRoleBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matrixTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0'
  },
  matrixSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0
  },
  matrixGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  permCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  permCardHeader: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
    letterSpacing: '0.05em'
  },
  permCardBody: {
    padding: '8px 16px'
  },
  permRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f8fafc'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '38px',
    height: '22px',
    cursor: 'pointer'
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '20px',
    transition: '0.2s'
  },
  sliderCircle: {
    position: 'absolute',
    height: '16px',
    width: '16px',
    left: '3px',
    bottom: '3px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '0.2s'
  }
};

export default RolesPermissions;