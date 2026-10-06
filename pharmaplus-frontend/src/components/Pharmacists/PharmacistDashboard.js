import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PrescriptionQueue from './PrescriptionQueue';
import OrderDispensing from './OrderDispensing';
import LowStockManagement from './LowStockManagement';
import MedicineManagement from './MedicineManagement';

const PharmacistDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('prescriptions');

  const renderContent = () => {
    switch (activeTab) {
      case 'prescriptions':
        return <PrescriptionQueue />;
      case 'dispensing':
        return <OrderDispensing />;
      case 'inventory':
        return <LowStockManagement />;
      case 'medicines':
        return <MedicineManagement />;
      default:
        return <PrescriptionQueue />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Main Content Wrapper */}
      <div style={styles.mainWrapper}>
        <Navbar activeTab={activeTab} />
        
        <main style={styles.contentBody}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  contentBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
};

export default PharmacistDashboard;