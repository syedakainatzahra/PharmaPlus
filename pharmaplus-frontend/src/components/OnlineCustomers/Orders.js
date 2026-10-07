import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiPackage,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiEye,
  FiX,
  FiCheckCircle,
  FiTruck,
} from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://pharmaplus-production-7fa8.up.railway.app/api/v1/orders/my-orders',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);

      setError(
        err.response?.data?.message ||
        'Unable to load your orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
        };

      case 'CANCELLED':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
        };

      case 'OUT_FOR_DELIVERY':
        return {
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
        };

      case 'PROCESSING':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
        };

      case 'CONFIRMED':
        return {
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
        };

      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#475569',
        };
    }
  };

  const formatStatus = (status) => {
    return status
      ?.replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Cancel Order
  const handleCancelOrder = async (order) => {
    if (
      order.status === 'DELIVERED' ||
      order.status === 'CANCELLED'
    ) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) return;

    try {
      setCancellingOrder(true);

      const token = localStorage.getItem('token');

      await axios.patch(
        `https://pharmaplus-production-7fa8.up.railway.app/api/v1/orders/${order.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Order cancelled successfully.');

      setSelectedOrder(null);

      // Refresh orders from database
      await fetchOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);

      alert(
        err.response?.data?.message ||
        'Unable to cancel this order.'
      );
    } finally {
      setCancellingOrder(false);
    }
  };

  const canCancel = (status) => {
    return (
      status !== 'DELIVERED' &&
      status !== 'CANCELLED' &&
      status !== 'OUT_FOR_DELIVERY'
    );
  };

  return (
    <div style={styles.tabContentCard}>
      <h2 style={styles.tabTitle}>Ordered Products Lists</h2>

      <p style={styles.tabSubtitle}>
        Track your orders and check their current status.
      </p>

      {/* Loading */}
      {loading && (
        <div style={styles.placeholderBox}>
          <FiPackage size={48} color="#94a3b8" />

          <p style={styles.messageText}>
            Loading your orders...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={styles.placeholderBox}>
          <FiPackage size={48} color="#ef4444" />

          <p
            style={{
              ...styles.messageText,
              color: '#dc2626',
            }}
          >
            {error}
          </p>

          <button
            onClick={fetchOrders}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Orders */}
      {!loading && !error && orders.length === 0 && (
        <div style={styles.placeholderBox}>
          <FiPackage size={48} color="#94a3b8" />

          <p style={styles.messageText}>
            No orders found.
          </p>

          <p style={styles.emptySubtitle}>
            Your placed orders will appear here.
          </p>
        </div>
      )}

      {/* Orders */}
      {!loading && !error && orders.length > 0 && (
        <div style={styles.ordersContainer}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>

              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderTitle}>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h3>

                  <div style={styles.dateRow}>
                    <FiClock size={14} />

                    <span>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(order.status),
                  }}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div style={styles.itemsContainer}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={styles.itemRow}
                  >
                    <div style={styles.itemInfo}>
                      <div style={styles.packageIcon}>
                        <FiPackage size={18} />
                      </div>

                      <div>
                        <p style={styles.medicineName}>
                          {item.medicine?.name || 'Medicine'}
                        </p>

                        <p style={styles.itemQuantity}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div style={styles.itemPrice}>
                      PKR{' '}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div style={styles.infoRow}>
                  <FiMapPin size={17} color="#64748b" />

                  <span>
                    <strong>Delivery:</strong>{' '}
                    {order.deliveryAddress}
                  </span>
                </div>
              )}

              {/* Payment */}
              <div style={styles.infoRow}>
                <FiCreditCard
                  size={17}
                  color="#64748b"
                />

                <span>
                  <strong>Payment:</strong>{' '}
                  {order.paymentMethod || 'COD'}
                </span>
              </div>

              {/* Footer */}
              <div style={styles.orderFooter}>
                <div>
                  <span style={styles.totalLabel}>
                    Total Amount
                  </span>

                  <strong style={styles.totalAmount}>
                    PKR{' '}
                    {Number(
                      order.totalAmount
                    ).toLocaleString()}
                  </strong>
                </div>

                {order.deliveryFee > 0 && (
                  <span style={styles.deliveryFee}>
                    Delivery: PKR {order.deliveryFee}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={styles.actionRow}>
                <button
                  onClick={() => setSelectedOrder(order)}
                  style={styles.detailsButton}
                >
                  <FiEye size={16} />
                  View Details
                </button>

                {canCancel(order.status) && (
                  <button
                    onClick={() =>
                      handleCancelOrder(order)
                    }
                    style={styles.cancelButton}
                    disabled={cancellingOrder}
                  >
                    <FiX size={16} />

                    {cancellingOrder
                      ? 'Cancelling...'
                      : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}

      {selectedOrder && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  Order Details
                </h2>

                <p style={styles.modalOrderNumber}>
                  Order #
                  {selectedOrder.id
                    .slice(0, 8)
                    .toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={styles.closeButton}
              >
                <FiX size={21} />
              </button>
            </div>

            {/* Status */}
            <div style={styles.modalStatusRow}>
              <span style={styles.modalStatusLabel}>
                Current Status
              </span>

              <span
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle(
                    selectedOrder.status
                  ),
                }}
              >
                {formatStatus(
                  selectedOrder.status
                )}
              </span>
            </div>

            {/* Tracking */}
            <div style={styles.trackingSection}>
              <h3 style={styles.sectionTitle}>
                <FiTruck size={18} />
                Order Tracking
              </h3>

              <div style={styles.timeline}>
                {[
                  'PENDING',
                  'CONFIRMED',
                  'PROCESSING',
                  'OUT_FOR_DELIVERY',
                  'DELIVERED',
                ].map((status, index) => {

                  const statusOrder = [
                    'PENDING',
                    'CONFIRMED',
                    'PROCESSING',
                    'OUT_FOR_DELIVERY',
                    'DELIVERED',
                  ];

                  const currentIndex =
                    statusOrder.indexOf(
                      selectedOrder.status
                    );

                  const isCompleted =
                    selectedOrder.status !==
                      'CANCELLED' &&
                    currentIndex >= index;

                  const isCurrent =
                    selectedOrder.status === status;

                  return (
                    <div
                      key={status}
                      style={styles.timelineItem}
                    >
                      <div
                        style={{
                          ...styles.timelineDot,
                          ...(isCompleted
                            ? styles.timelineDotActive
                            : {}),
                        }}
                      >
                        {isCompleted && (
                          <FiCheckCircle size={16} />
                        )}
                      </div>

                      <div>
                        <p
                          style={{
                            ...styles.timelineTitle,
                            ...(isCurrent
                              ? styles.timelineCurrent
                              : {}),
                          }}
                        >
                          {formatStatus(status)}
                        </p>

                        {isCurrent && (
                          <p
                            style={
                              styles.timelineCurrentText
                            }
                          >
                            Current order status
                          </p>
                        )}
                      </div>

                      {index < 4 && (
                        <div
                          style={{
                            ...styles.timelineLine,
                            ...(currentIndex > index
                              ? styles.timelineLineActive
                              : {}),
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cancelled Status */}
              {selectedOrder.status ===
                'CANCELLED' && (
                <div style={styles.cancelledBox}>
                  <FiX size={18} />

                  <span>
                    This order has been cancelled.
                  </span>
                </div>
              )}
            </div>

            {/* Medicines */}
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>
                <FiPackage size={18} />
                Ordered Medicines
              </h3>

              {selectedOrder.items?.map((item) => (
                <div
                  key={item.id}
                  style={styles.detailItem}
                >
                  <div>
                    <p style={styles.detailMedicineName}>
                      {item.medicine?.name ||
                        'Medicine'}
                    </p>

                    <p style={styles.detailQuantity}>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <strong>
                    PKR{' '}
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Delivery Details */}
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>
                <FiMapPin size={18} />
                Delivery Details
              </h3>

              <p style={styles.detailText}>
                {selectedOrder.deliveryAddress ||
                  'No delivery address available.'}
              </p>
            </div>

            {/* Payment + Date */}
            <div style={styles.detailGrid}>
              <div style={styles.detailBox}>
                <span>Payment Method</span>
                <strong>
                  {selectedOrder.paymentMethod ||
                    'COD'}
                </strong>
              </div>

              <div style={styles.detailBox}>
                <span>Order Date</span>
                <strong>
                  {formatDateTime(
                    selectedOrder.createdAt
                  )}
                </strong>
              </div>
            </div>

            {/* Total */}
            <div style={styles.modalTotal}>
              <span>Total Amount</span>

              <strong>
                PKR{' '}
                {Number(
                  selectedOrder.totalAmount
                ).toLocaleString()}
              </strong>
            </div>

            {/* Cancel */}
            {canCancel(
              selectedOrder.status
            ) && (
              <button
                onClick={() =>
                  handleCancelOrder(
                    selectedOrder
                  )
                }
                style={styles.modalCancelButton}
                disabled={cancellingOrder}
              >
                <FiX size={17} />

                {cancellingOrder
                  ? 'Cancelling Order...'
                  : 'Cancel This Order'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  tabContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    minHeight: '60vh',
  },

  tabTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },

  tabSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 24px 0',
  },

  placeholderBox: {
    textAlign: 'center',
    padding: '60px 20px',
    border: '2px dashed #e2e8f0',
    borderRadius: '12px',
    marginTop: '20px',
  },

  messageText: {
    fontWeight: '600',
    color: '#475569',
    marginTop: '15px',
  },

  emptySubtitle: {
    color: '#94a3b8',
    fontSize: '13px',
  },

  retryButton: {
    marginTop: '10px',
    padding: '9px 18px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
  },

  ordersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  orderCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    backgroundColor: '#ffffff',
  },

  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f1f5f9',
  },

  orderTitle: {
    margin: '0 0 7px 0',
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
  },

  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#64748b',
  },

  statusBadge: {
    padding: '6px 11px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  itemsContainer: {
    padding: '15px 0',
  },

  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '10px 0',
  },

  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  packageIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '9px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  medicineName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
  },

  itemQuantity: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#64748b',
  },

  itemPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
    whiteSpace: 'nowrap',
  },

  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '12px',
    color: '#64748b',
    padding: '8px 0',
  },

  orderFooter: {
    marginTop: '12px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
  },

  totalLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '3px',
  },

  totalAmount: {
    display: 'block',
    fontSize: '18px',
    color: '#0f172a',
  },

  deliveryFee: {
    fontSize: '11px',
    color: '#64748b',
  },

  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #f1f5f9',
  },

  detailsButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#ffffff',
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
  },

  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    backgroundColor: '#fff5f5',
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
  },

  /* Modal */

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    zIndex: 9999,
  },

  modal: {
    width: '100%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '18px',
    borderBottom: '1px solid #e2e8f0',
  },

  modalTitle: {
    margin: 0,
    fontSize: '21px',
    fontWeight: '800',
    color: '#0f172a',
  },

  modalOrderNumber: {
    margin: '5px 0 0',
    fontSize: '12px',
    color: '#64748b',
  },

  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalStatusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '18px',
  },

  modalStatusLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#475569',
  },

  trackingSection: {
    marginTop: '24px',
    padding: '18px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 18px',
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
  },

  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },

  timelineItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    minHeight: '55px',
  },

  timelineDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 2,
  },

  timelineDotActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },

  timelineTitle: {
    margin: '5px 0 0',
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
  },

  timelineCurrent: {
    color: '#2563eb',
    fontWeight: '800',
  },

  timelineCurrentText: {
    margin: '3px 0 0',
    fontSize: '11px',
    color: '#64748b',
  },

  timelineLine: {
    position: 'absolute',
    left: '13px',
    top: '28px',
    width: '2px',
    height: '27px',
    backgroundColor: '#e2e8f0',
    zIndex: 1,
  },

  timelineLineActive: {
    backgroundColor: '#2563eb',
  },

  cancelledBox: {
    marginTop: '10px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '700',
  },

  detailSection: {
    marginTop: '22px',
    paddingBottom: '18px',
    borderBottom: '1px solid #e2e8f0',
  },

  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
  },

  detailMedicineName: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },

  detailQuantity: {
    margin: '4px 0 0',
    fontSize: '11px',
    color: '#64748b',
  },

  detailText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#64748b',
  },

  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '18px',
  },

  detailBox: {
    padding: '13px',
    borderRadius: '9px',
    backgroundColor: '#f8fafc',
  },

  detailBoxSpan: {
    fontSize: '11px',
    color: '#64748b',
  },

  modalTotal: {
    marginTop: '18px',
    paddingTop: '18px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
  },

  modalCancelButton: {
    width: '100%',
    marginTop: '18px',
    padding: '12px',
    borderRadius: '9px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
  },
};

export default Orders;