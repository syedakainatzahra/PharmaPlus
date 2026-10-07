import React, { useEffect, useState } from 'react';
import {
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';
import axios from 'axios';

const Cart = ({ setActiveTab, setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem('pharmaPlusCart') || '[]'
    );

    setCartItems(savedCart);
    updateCartCount(savedCart);
  }, []);

  // Update Navbar cart count
  const updateCartCount = (items) => {
    const totalItems = items.reduce(
      (total, item) => total + item.qty,
      0
    );

    if (setCartCount) {
      setCartCount(totalItems);
    }
  };

  // Update quantity
  const updateQuantity = (id, delta) => {
    setCartItems((items) => {
      const updatedItems = items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;

            return newQty > 0
              ? { ...item, qty: newQty }
              : null;
          }

          return item;
        })
        .filter(Boolean);

      localStorage.setItem(
        'pharmaPlusCart',
        JSON.stringify(updatedItems)
      );

      updateCartCount(updatedItems);

      return updatedItems;
    });
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems((items) => {
      const updatedItems = items.filter(
        (item) => item.id !== id
      );

      localStorage.setItem(
        'pharmaPlusCart',
        JSON.stringify(updatedItems)
      );

      updateCartCount(updatedItems);

      return updatedItems;
    });
  };

  // Open checkout
  const handleCheckoutClick = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first to place your order.');
      setActiveTab('login');
      return;
    }

    setCheckoutError('');
    setShowCheckout(true);
  };

  // Place order
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first to place your order.');
      setActiveTab('login');
      return;
    }

    if (!deliveryAddress.trim()) {
      setCheckoutError(
        'Please enter your delivery address.'
      );
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    try {
      setPlacingOrder(true);
      setCheckoutError('');

      const orderItems = cartItems.map((item) => ({
        medicineId: item.id,
        quantity: item.qty,
      }));

      const response = await axios.post(
        'https://pharmaplus-production-7fa8.up.railway.app/api/v1/orders',
        {
          items: orderItems,
          deliveryAddress: deliveryAddress.trim(),
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Clear cart
        localStorage.removeItem('pharmaPlusCart');

        setCartItems([]);

        if (setCartCount) {
          setCartCount(0);
        }

        setShowCheckout(false);
        setDeliveryAddress('');
        setPaymentMethod('COD');

        alert(
          'Order placed successfully! 🎉'
        );

        // Go to Orders
        setActiveTab('ordered');
      }

    } catch (error) {
      console.error(
        'Checkout Error:',
        error
      );

      const message =
        error.response?.data?.message ||
        'Failed to place order. Please try again.';

      setCheckoutError(message);

    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.price) * item.qty,
    0
  );

  const deliveryFee =
    subtotal > 2000 || subtotal === 0
      ? 0
      : 150;

  const total =
    subtotal + deliveryFee;

  return (
    <div style={styles.container}>

      <div style={styles.headerRow}>

        <button
          style={styles.backBtn}
          onClick={() =>
            setActiveTab('medicines')
          }
        >
          <FiArrowLeft size={16} />
          Continue Shopping
        </button>

        <h2 style={styles.title}>
          Shopping Cart ({cartItems.length})
        </h2>

      </div>

      {cartItems.length === 0 ? (

        <div style={styles.emptyCart}>

          <FiShoppingBag
            size={48}
            color="#94a3b8"
          />

          <p
            style={{
              fontWeight: '600',
              color: '#475569',
              marginTop: '12px',
            }}
          >
            Your cart is empty!
          </p>

          <button
            style={styles.shopBtn}
            onClick={() =>
              setActiveTab('medicines')
            }
          >
            Browse Medicines
          </button>

        </div>

      ) : (

        <div style={styles.cartGrid}>

          {/* Cart Items */}
          <div style={styles.itemsList}>

            {cartItems.map((item) => (

              <div
                key={item.id}
                style={styles.cartItemCard}
              >

                <div style={styles.itemInfo}>

                  <div style={styles.itemIcon}>
                    💊
                  </div>

                  <div>

                    <h4 style={styles.itemName}>
                      {item.name}
                    </h4>

                    <p style={styles.itemDesc}>
                      {item.desc}
                    </p>

                    <span style={styles.itemPrice}>
                      Rs.{' '}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </span>

                    {item.tag && (
                      <p
                        style={{
                          margin: '3px 0 0',
                          fontSize: '11px',
                          color: '#64748b',
                        }}
                      >
                        {item.tag}
                      </p>
                    )}

                  </div>

                </div>

                <div style={styles.itemActionRight}>

                  {/* Quantity */}
                  <div style={styles.qtyControl}>

                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          -1
                        )
                      }
                    >
                      -
                    </button>

                    <span style={styles.qtyText}>
                      {item.qty}
                    </span>

                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* Item Total */}
                  <span style={styles.itemTotal}>
                    Rs.{' '}
                    {(
                      Number(item.price) *
                      item.qty
                    ).toLocaleString()}
                  </span>

                  {/* Delete */}
                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      removeItem(item.id)
                    }
                    title="Remove"
                  >
                    <FiTrash2
                      size={16}
                      color="#ef4444"
                    />
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Order Summary */}
          <div style={styles.summaryCard}>

            <h3 style={styles.summaryTitle}>
              Order Summary
            </h3>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>

              <span>
                Rs.{' '}
                {subtotal.toLocaleString()}
              </span>
            </div>

            <div style={styles.summaryRow}>
              <span>Delivery Fee</span>

              <span>
                {deliveryFee === 0
                  ? 'FREE'
                  : `Rs. ${deliveryFee}`}
              </span>
            </div>

            <hr style={styles.divider} />

            <div
              style={{
                ...styles.summaryRow,
                fontWeight: '800',
                fontSize: '16px',
                color: '#0f172a',
              }}
            >
              <span>Total Amount</span>

              <span>
                Rs.{' '}
                {total.toLocaleString()}
              </span>
            </div>

            <button
              style={styles.checkoutBtn}
              onClick={handleCheckoutClick}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          CHECKOUT MODAL
      ================================================= */}

      {showCheckout && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h3 style={styles.modalTitle}>
              Complete Your Order
            </h3>

            <p style={styles.modalSubtitle}>
              Enter your delivery details to place
              your order.
            </p>

            {/* Delivery Address */}
            <label style={styles.label}>
              Delivery Address
            </label>

            <textarea
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(
                  e.target.value
                )
              }
              placeholder="Enter your complete delivery address"
              rows={4}
              style={styles.textarea}
            />

            {/* Payment Method */}
            <label style={styles.label}>
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="COD">
                Cash on Delivery
              </option>

              <option value="ONLINE">
                Online Payment
              </option>
            </select>

            {/* Error */}
            {checkoutError && (
              <div style={styles.errorBox}>
                {checkoutError}
              </div>
            )}

            {/* Total */}
            <div style={styles.modalTotal}>
              <span>Total</span>

              <strong>
                Rs.{' '}
                {total.toLocaleString()}
              </strong>
            </div>

            {/* Buttons */}
            <div style={styles.modalActions}>

              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutError('');
                }}
                disabled={placingOrder}
              >
                Cancel
              </button>

              <button
                style={{
                  ...styles.placeOrderBtn,
                  opacity: placingOrder
                    ? 0.7
                    : 1,
                }}
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? 'Placing Order...'
                  : 'Place Order'}
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
    padding: '0 10px',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },

  backBtn: {
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#2563eb',
    cursor: 'pointer',
  },

  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },

  emptyCart: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },

  shopBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '12px',
  },

  cartGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },

  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  cartItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  itemIcon: {
    width: '44px',
    height: '44px',
    backgroundColor: '#eff6ff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },

  itemName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },

  itemDesc: {
    fontSize: '11px',
    color: '#64748b',
    margin: '0 0 4px 0',
  },

  itemPrice: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2563eb',
  },

  itemActionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
  },

  qtyBtn: {
    backgroundColor: '#f8fafc',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#334155',
  },

  qtyText: {
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
  },

  itemTotal: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    width: '90px',
    textAlign: 'right',
  },

  deleteBtn: {
    backgroundColor: '#fef2f2',
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    height: 'fit-content',
  },

  summaryTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#475569',
    marginBottom: '12px',
    fontWeight: '600',
  },

  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '16px 0',
  },

  checkoutBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
  },

  // =================================================
  // CHECKOUT MODAL STYLES
  // =================================================

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },

  modal: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow:
      '0 20px 50px rgba(0,0,0,0.2)',
  },

  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px',
  },

  modalSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 20px',
  },

  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '7px',
    marginTop: '14px',
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    outline: 'none',
  },

  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '14px',
  },

  modalTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#475569',
  },

  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },

  cancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
  },

  placeOrderBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default Cart;