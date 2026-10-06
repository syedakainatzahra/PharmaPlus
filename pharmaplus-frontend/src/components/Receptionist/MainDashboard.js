import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import PatientQueue from './PatientQueue';
import Appointments from './Appointments';
import PatientDirectory from './PatientDirectory';
import BillingCounter from './BillingCounter';
import Settings from './Settings';

const ReceptionistDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onLogout={onLogout} />; // onLogout pass kiya agar wahan button hai
      case 'patientQueue':
      case 'queue':
        return <PatientQueue />;
      case 'appointments':
        return <Appointments />;
      case 'patientDirectory':
      case 'directory':
        return <PatientDirectory />;
      case 'billingCounter':
      case 'billing':
        return <BillingCounter />;
      case 'settings':
        return <Settings onLogout={onLogout} />;
      default:
        return <Overview onLogout={onLogout} />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    fontFamily: 'sans-serif'
  },
  mainContent: {
    flex: 1,
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: '#f8fafc'
  }
};

export default ReceptionistDashboard;