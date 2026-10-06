import React from 'react';
import { FiSearch, FiUpload, FiHeart, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';

const Overview = ({ setActiveTab, setCartCount }) => {
  const categories = [
    { name: 'Medicines & Tablets', icon: '💊', bg: '#eff6ff' },
    { name: 'First Aid & Care', icon: '🩹', bg: '#fef2f2' },
    { name: 'Baby & Child Care', icon: '🍼', bg: '#fef3c7' },
    { name: 'Personal Care & Hygiene', icon: '🧴', bg: '#f0fdf4' },
    { name: 'Vitamins & Supplements', icon: '🌿', bg: '#f0fdf4' },
    { name: 'Medical Devices', icon: '🩺', bg: '#eff6ff' },
  ];

  const popularMedicines = [
    { id: 1, name: 'Paracetamol 500mg', desc: '20 Tablets', price: 'Rs. 120', rating: '4.8 (1.2k)', tag: 'Panadol' },
    { id: 2, name: 'Amoxicillin 500mg', desc: '10 Capsules', price: 'Rs. 250', rating: '4.7 (856)', tag: 'Amoxicillin' },
    { id: 3, name: 'Vitamin C 1000mg', desc: '20 Effervescent Tablets', price: 'Rs. 320', rating: '4.6 (642)', tag: 'Vitamin C' },
    { id: 4, name: 'Cetirizine 10mg', desc: '10 Tablets', price: 'Rs. 180', rating: '4.5 (518)', tag: 'Cetirizine' },
    { id: 5, name: 'ORS (Oral Rehydration)', desc: '6 Sachets', price: 'Rs. 150', rating: '4.7 (732)', tag: 'ORS' },
  ];

  const frequentRefills = [
    { id: 6, name: 'Metformin 500mg', desc: '30 Tablets', price: 'Rs. 220' },
    { id: 7, name: 'Omeprazole 20mg', desc: '14 Capsules', price: 'Rs. 180' },
    { id: 8, name: 'Ibuprofen 400mg', desc: '20 Tablets', price: 'Rs. 160' },
    { id: 9, name: 'Multivitamin Tablets', desc: '30 Tablets', price: 'Rs. 350' },
    { id: 10, name: 'Surgical Mask', desc: '50 Pieces', price: 'Rs. 280' },
  ];

  return (
    <div>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <FiSearch size={18} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search medicines, health products, or upload prescription..." 
          style={styles.searchInput}
        />
      </div>

      {/* Promotional Banners */}
      <div style={styles.bannerGrid}>
        <div style={styles.promoBanner}>
          <div>
            <span style={styles.pillBadge}>Special Offer</span>
            <h2 style={styles.promoTitle}>Up to 25% OFF</h2>
            <p style={styles.promoSub}>on Health &amp; Wellness Products</p>
            <div style={styles.deliveryTag}>
              <span>🚚</span> Free Home Delivery <small>on orders above Rs. 2000</small>
            </div>
            <button style={styles.shopNowBtn}>Shop Now &rarr;</button>
          </div>
        </div>

        <div style={styles.uploadCard}>
          <div style={styles.uploadCardLeft}>
            <div style={styles.uploadIconBox}>
              <FiUpload size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={styles.uploadTitle}>Upload Prescription</h3>
              <p style={styles.uploadDesc}>Snap a photo or upload your prescription for instant review.</p>
            </div>
          </div>
          <button style={styles.uploadBtn} onClick={() => setActiveTab('uploads')}>Upload Now</button>
          <div style={styles.uploadPerks}>
            <span>⚡ Fast Review</span>
            <span>🔒 Safe &amp; Secure</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Browse Categories</h3>
      </div>
      <div style={styles.categoryGrid}>
        {categories.map((cat, idx) => (
          <div key={idx} style={styles.categoryItem}>
            <div style={{ ...styles.categoryIconBox, backgroundColor: cat.bg }}>
              <span style={{ fontSize: '24px' }}>{cat.icon}</span>
            </div>
            <span style={styles.categoryName}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Popular Medicines */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Popular Medicines &amp; Essentials</h3>
        <span style={styles.viewAll}>View All &rarr;</span>
      </div>
      <div style={styles.productRow}>
        {popularMedicines.map((item) => (
          <div key={item.id} style={styles.productCard}>
            <div style={styles.productCardTop}>
              <span style={styles.productTag}>{item.tag}</span>
              <FiHeart size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
            </div>
            <div style={styles.productImgMock}>💊</div>
            <h4 style={styles.productName}>{item.name}</h4>
            <p style={styles.productDesc}>{item.desc}</p>
            <div style={styles.productRating}>⭐ {item.rating}</div>
            <div style={styles.productFooter}>
              <span style={styles.productPrice}>{item.price}</span>
              <button style={styles.addCartBtn} onClick={() => setCartCount(c => c + 1)}>
                <FiShoppingCart size={14} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Frequently Refilled */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Frequently Refilled</h3>
        <span style={styles.viewAll}>View All &rarr;</span>
      </div>
      <div style={styles.productRow}>
        {frequentRefills.map((item) => (
          <div key={item.id} style={styles.productCard}>
            <div style={styles.productCardTop}>
              <span style={styles.productTag}>Refill</span>
              <FiHeart size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
            </div>
            <div style={styles.productImgMock}>🛡️</div>
            <h4 style={styles.productName}>{item.name}</h4>
            <p style={styles.productDesc}>{item.desc}</p>
            <div style={styles.productFooter}>
              <span style={styles.productPrice}>{item.price}</span>
              <button style={styles.addCartBtn} onClick={() => setCartCount(c => c + 1)}>
                <FiShoppingCart size={14} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div style={styles.trustFooter}>
        <div style={styles.trustItem}><FiCheckCircle color="#2563eb" size={18} /><span>100% Genuine Products</span></div>
        <div style={styles.trustItem}><FiCheckCircle color="#2563eb" size={18} /><span>Trusted by 1M+ Customers</span></div>
        <div style={styles.trustItem}><FiCheckCircle color="#2563eb" size={18} /><span>Licensed Pharmacies</span></div>
        <div style={styles.trustItem}><FiCheckCircle color="#2563eb" size={18} /><span>Secure Payment</span></div>
      </div>
    </div>
  );
};

const styles = {
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: 'transparent',
  },
  bannerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '32px',
  },
  promoBanner: {
    backgroundColor: '#dbeafe',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid #bfdbfe',
  },
  pillBadge: {
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
  },
  promoTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1e3a8a',
    margin: '10px 0 4px 0',
  },
  promoSub: {
    fontSize: '14px',
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: '14px',
  },
  deliveryTag: {
    fontSize: '12px',
    color: '#1e3a8a',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  shopNowBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    width: 'fit-content',
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  uploadCardLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  uploadIconBox: {
    backgroundColor: '#eff6ff',
    padding: '10px',
    borderRadius: '10px',
  },
  uploadTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  uploadDesc: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4',
  },
  uploadBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    width: '100%',
    margin: '12px 0 8px 0',
  },
  uploadPerks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  viewAll: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2563eb',
    cursor: 'pointer',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  categoryIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px auto',
  },
  categoryName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
  },
  productRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '14px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTag: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  productImgMock: {
    fontSize: '36px',
    textAlign: 'center',
    margin: '16px 0',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  productDesc: {
    fontSize: '11px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  productRating: {
    fontSize: '11px',
    color: '#ca8a04',
    fontWeight: '700',
    marginBottom: '12px',
  },
  productFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '10px',
  },
  productPrice: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#0f172a',
  },
  addCartBtn: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  trustFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginTop: '20px',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
  },
};

export default Overview;