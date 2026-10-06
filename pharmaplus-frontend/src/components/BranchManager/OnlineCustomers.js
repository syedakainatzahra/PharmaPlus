import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiClock, FiCheckCircle, FiTruck, 
  FiPackage, FiAlertCircle, FiPhone, FiFileText, FiChevronRight 
} from 'react-icons/fi';

const OnlineCustomers = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    { id: 'ORD-2847', customer: 'Fatima Noor', phone: '+92-302-1119988', items: 'Metformin 850mg ×2, Lisinopril 10mg ×1', rx: 'Rx ✓', total: 'PKR 1,340', placed: '08:42', status: 'Dispatched', notes: 'Deliver before 2pm' },
    { id: 'ORD-2848', customer: 'Khalid Mir', phone: '+92-333-7778899', items: 'Atorvastatin 20mg ×1, Omeprazole 20mg ×1', rx: 'OTC', total: 'PKR 2,100', placed: '07:15', status: 'Delivered', notes: '—' },
    { id: 'ORD-2849', customer: 'Samina Tariq', phone: '+92-321-5554433', items: 'Azithromycin 250mg ×1', rx: 'Rx ✓', total: 'PKR 1,620', placed: '09:18', status: 'Pending', notes: 'Call before dispatch' },
    { id: 'ORD-2850', customer: 'Amjad Bhatti', phone: '+92-311-9990011', items: 'Salbutamol Inhaler ×2, Cetirizine 10mg ×1', rx: 'Rx ✓', total: 'PKR 5,620', placed: '09:35', status: 'Processing', notes: '—' },
    { id: 'ORD-2851', customer: 'Rubab Khalid', phone: '+92-315-2221133', items: 'Ibuprofen 400mg ×1, Paracetamol 1g ×2', rx: 'OTC', total: 'PKR 420', placed: '06:58', status: 'Delivered', notes: '—' },
    { id: 'ORD-2852', customer: 'Naeem Shahid', phone: '+92-300-4443322', items: 'Cephalexin 250mg Syrup ×1', rx: 'Rx ✓', total: 'PKR 1,850', placed: '09:51', status: 'Pending', notes: 'Fragile — handle w...' },
    { id: 'ORD-2853', customer: 'Sadia Hameed', phone: '+92-322-8887765', items: 'Amlodipine 5mg ×1, Metformin 850mg ×1', rx: 'Rx ✓', total: 'PKR 1,120', placed: '08:05', status: 'Dispatched', notes: '—' }
  ];

  const counts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Dispatched: orders.filter(o => o.status === 'Dispatched').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#fffbeb', color: '#d97706' };
      case 'Processing':
        return { backgroundColor: '#eff6ff', color: '#2563eb' };
      case 'Dispatched':
        return { backgroundColor: '#f3e8ff', color: '#9333ea' };
      case 'Delivered':
        return { backgroundColor: '#f0fdf4', color: '#16a34a' };
      case 'Cancelled':
        return { backgroundColor: '#fef2f2', color: '#ef4444' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={styles.contentBody}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Online Customers & Digital Orders</h1>
        <p style={styles.pageSub}>Track prescriptions, order status, and customer communication</p>
      </div>

      <div style={styles.filterRow}>
        <div style={styles.tabsContainer}>
          {['All', 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab ? styles.activeTabBtn : {})
              }}
            >
              {tab} <span style={styles.tabCount}>({counts[tab] || 0})</span>
            </button>
          ))}
        </div>

        <div style={styles.searchBoxContainer}>
          <FiSearch size={16} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>ORDER ID</th>
              <th style={styles.th}>CUSTOMER</th>
              <th style={styles.th}>ITEMS</th>
              <th style={styles.th}>RX</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>PLACED</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>NOTES</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <span style={styles.orderIdText}>{order.id}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.customerCell}>
                    <span style={styles.customerName}>{order.customer}</span>
                    <span style={styles.customerPhone}>{order.phone}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.itemsText}>{order.items}</span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.rxBadge,
                    backgroundColor: order.rx.includes('✓') ? '#eff6ff' : '#f8fafc',
                    color: order.rx.includes('✓') ? '#2563eb' : '#64748b'
                  }}>
                    {order.rx}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.totalText}>{order.total}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.placedText}>{order.placed}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(order.status) }}>
                    {order.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.notesText}>{order.notes}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  contentBody: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  pageSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  tabsContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tabBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  activeTabBtn: { backgroundColor: '#eff6ff', borderColor: '#2563eb', color: '#2563eb' },
  tabCount: { fontSize: '11px', opacity: 0.8 },

  searchBoxContainer: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '240px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a' },

  tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', verticalAlign: 'middle', fontSize: '13px' },
  
  orderIdText: { fontWeight: '700', color: '#2563eb' },
  customerCell: { display: 'flex', flexDirection: 'column', gap: '2px' },
  customerName: { fontWeight: '700', color: '#0f172a' },
  customerPhone: { fontSize: '11px', color: '#64748b' },
  itemsText: { color: '#334155', fontWeight: '500' },
  rxBadge: { fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', display: 'inline-block' },
  totalText: { fontWeight: '700', color: '#0f172a' },
  placedText: { color: '#64748b', fontSize: '12px' },
  statusBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' },
  notesText: { color: '#64748b', fontSize: '12px' }
};

export default OnlineCustomers;