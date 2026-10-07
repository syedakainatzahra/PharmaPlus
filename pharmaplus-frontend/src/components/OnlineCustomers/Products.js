import React, { useEffect, useState } from "react";
import { FiSearch, FiShoppingCart, FiPlus } from "react-icons/fi";

const Products = ({ setActiveTab, setCartCount }) => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://pharmaplus-production-7fa8.up.railway.app/api/v1/medicines"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch medicines");
      }

      setMedicines(data.medicines || []);
      setFilteredMedicines(data.medicines || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setError("Unable to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = medicines.filter((medicine) =>
      `${medicine.name} ${medicine.brand} ${medicine.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const handleAddToCart = (medicine) => {
    const existingCart = JSON.parse(
      localStorage.getItem("pharmaPlusCart") || "[]"
    );

    const existingItem = existingCart.find(
      (item) => item.id === medicine.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === medicine.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: medicine.id,
          name: medicine.name,
          desc: medicine.description || medicine.category,
          price: medicine.price,
          qty: 1,
          tag: medicine.brand,
        },
      ];
    }

    localStorage.setItem(
      "pharmaPlusCart",
      JSON.stringify(updatedCart)
    );

    const totalItems = updatedCart.reduce(
      (total, item) => total + item.qty,
      0
    );

    if (setCartCount) {
      setCartCount(totalItems);
    }

    alert(`${medicine.name} added to cart!`);
  };

  if (loading) {
    return (
      <div style={styles.centerMessage}>
        <div style={styles.loader}></div>
        <p>Loading medicines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerMessage}>
        <p style={styles.errorText}>{error}</p>

        <button onClick={fetchMedicines} style={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Medicines</h1>
          <p style={styles.subtitle}>
            Browse medicines and add them to your cart.
          </p>
        </div>

        <button
          style={styles.cartBtn}
          onClick={() => setActiveTab("cart")}
        >
          <FiShoppingCart size={18} />
          Cart
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchWrapper}>
        <FiSearch size={20} color="#64748b" />

        <input
          type="text"
          placeholder="Search medicines, brands or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Results */}
      <div style={styles.resultInfo}>
        <span>
          {filteredMedicines.length} medicine
          {filteredMedicines.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {filteredMedicines.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No medicines found</h3>
          <p>Try searching with another name or category.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} style={styles.card}>
              <div style={styles.medicineIcon}>
                💊
              </div>

              <div style={styles.cardBody}>
                <span style={styles.category}>
                  {medicine.category || "Medicine"}
                </span>

                <h3 style={styles.medicineName}>
                  {medicine.name}
                </h3>

                <p style={styles.brand}>
                  {medicine.brand}
                </p>

                <p style={styles.description}>
                  {medicine.description ||
                    "Quality healthcare medicine."}
                </p>

                <div style={styles.bottomRow}>
                  <div>
                    <p style={styles.price}>
                      Rs. {Number(medicine.price).toLocaleString()}
                    </p>

                    <p
                      style={{
                        ...styles.stock,
                        color:
                          medicine.stock > 0
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    >
                      {medicine.stock > 0
                        ? `${medicine.stock} available`
                        : "Out of stock"}
                    </p>
                  </div>

                  <button
                    style={{
                      ...styles.addBtn,
                      opacity: medicine.stock <= 0 ? 0.5 : 1,
                      cursor:
                        medicine.stock <= 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                    disabled={medicine.stock <= 0}
                    onClick={() => handleAddToCart(medicine)}
                  >
                    <FiPlus size={17} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    padding: "32px 5%",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  cartBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 17px",
    fontWeight: "700",
    cursor: "pointer",
  },

  searchWrapper: {
    maxWidth: "700px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0 15px",
    boxSizing: "border-box",
    marginBottom: "20px",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
  },

  resultInfo: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
  },

  medicineIcon: {
    height: "130px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    fontSize: "48px",
  },

  cardBody: {
    padding: "18px",
  },

  category: {
    display: "inline-block",
    backgroundColor: "#ecfeff",
    color: "#0f766e",
    fontSize: "11px",
    fontWeight: "700",
    padding: "5px 8px",
    borderRadius: "6px",
    marginBottom: "9px",
  },

  medicineName: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },

  brand: {
    margin: "5px 0",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
  },

  description: {
    margin: "10px 0",
    color: "#64748b",
    fontSize: "13px",
    minHeight: "38px",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "15px",
  },

  price: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
  },

  stock: {
    margin: "5px 0 0",
    fontSize: "12px",
    fontWeight: "600",
  },

  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "9px 13px",
    fontWeight: "700",
  },

  centerMessage: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  errorText: {
    color: "#dc2626",
    marginBottom: "12px",
  },

  retryBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "9px 16px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyState: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    marginBottom: "10px",
  },
};

export default Products;