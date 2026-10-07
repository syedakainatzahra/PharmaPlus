import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";

const API_URL = "https://pharmaplus-production-7fa8.up.railway.app/api/v1";

const Medicines = ({ setActiveTab, setCartCount }) => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchRef = useRef(null);

  // =========================
  // FETCH MEDICINES
  // =========================
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/medicines`);

      if (!response.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();

      setMedicines(data.medicines || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FUZZY SEARCH HELPERS
  // =========================

  // Normalizes text
  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // Checks whether search characters appear in order
  // Example:
  // "para" -> "paracetamol"
  const isSubsequence = (search, text) => {
    let searchIndex = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === search[searchIndex]) {
        searchIndex++;

        if (searchIndex === search.length) {
          return true;
        }
      }
    }

    return false;
  };

  // Simple fuzzy score
  const fuzzyScore = (search, text) => {
    search = normalizeText(search);
    text = normalizeText(text);

    if (!search) return 0;

    // Exact match
    if (text === search) return 100;

    // Starts with search
    if (text.startsWith(search)) return 95;

    // Contains search
    if (text.includes(search)) return 85;

    // Characters appear in order
    if (isSubsequence(search, text)) return 70;

    // Compare individual words
    const searchWords = search.split(" ");
    const textWords = text.split(" ");

    let matchedWords = 0;

    searchWords.forEach((searchWord) => {
      if (
        textWords.some(
          (word) =>
            word.startsWith(searchWord) ||
            word.includes(searchWord) ||
            isSubsequence(searchWord, word)
        )
      ) {
        matchedWords++;
      }
    });

    if (matchedWords > 0) {
      return 50 + matchedWords * 5;
    }

    // Small typo tolerance
    let matchingCharacters = 0;

    for (const char of search) {
      if (text.includes(char)) {
        matchingCharacters++;
      }
    }

    const similarity = matchingCharacters / search.length;

    if (similarity >= 0.7) return 40;
    if (similarity >= 0.5) return 25;

    return 0;
  };

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        medicines
          .map((medicine) => medicine.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [medicines]);

  // =========================
  // SEARCH RESULTS
  // =========================

  const searchResults = useMemo(() => {
    const search = normalizeText(searchTerm);

    let results = medicines;

    if (selectedCategory !== "All") {
      results = results.filter(
        (medicine) =>
          normalizeText(medicine.category) ===
          normalizeText(selectedCategory)
      );
    }

    if (!search) {
      return results;
    }

    return results
      .map((medicine) => {
        const searchableText = `
          ${medicine.name}
          ${medicine.brand}
          ${medicine.category}
          ${medicine.description || ""}
        `;

        return {
          medicine,
          score: fuzzyScore(search, searchableText),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.medicine);
  }, [medicines, searchTerm, selectedCategory]);

  // =========================
  // SUGGESTIONS
  // =========================

  const suggestions = useMemo(() => {
    const search = normalizeText(searchTerm);

    if (!search) {
      return [];
    }

    return medicines
      .map((medicine) => {
        const searchableText = `
          ${medicine.name}
          ${medicine.brand}
          ${medicine.category}
        `;

        return {
          medicine,
          score: fuzzyScore(search, searchableText),
        };
      })
      .filter((item) => item.score >= 25)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.medicine);
  }, [medicines, searchTerm]);

  // =========================
  // CLOSE SUGGESTIONS
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // SELECT SUGGESTION
  // =========================

  const handleSuggestionClick = (medicine) => {
    setSearchTerm(medicine.name);
    setSuggestionsOpen(false);
  };

  // =========================
  // CART
  // =========================

  const getCart = () => {
    try {
      return JSON.parse(
        localStorage.getItem("pharmaPlusCart") || "[]"
      );
    } catch {
      return [];
    }
  };

  const addToCart = (medicine) => {
    if (!medicine.stock || medicine.stock <= 0) {
      return;
    }

    const cart = getCart();

    const existingIndex = cart.findIndex(
      (item) => item.id === medicine.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: medicine.id,
        name: medicine.name,
        brand: medicine.brand,
        price: medicine.price,
        qty: 1,
        stock: medicine.stock,
      });
    }

    localStorage.setItem(
      "pharmaPlusCart",
      JSON.stringify(cart)
    );

    const totalQuantity = cart.reduce(
      (total, item) => total + item.qty,
      0
    );

    if (setCartCount) {
      setCartCount(totalQuantity);
    }
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestionsOpen(false);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>
            Loading medicines...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>

          <h3 style={styles.errorTitle}>
            Something went wrong
          </h3>

          <p style={styles.errorText}>{error}</p>

          <button
            style={styles.retryButton}
            onClick={fetchMedicines}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Medicines
            </h1>

            <p style={styles.subtitle}>
              Find the medicines you need and order them
              easily.
            </p>
          </div>

          <button
  style={styles.cartButton}
  onClick={() => setActiveTab("cart")}
>
  <FiShoppingCart size={17} />
  <span>View Cart</span>
</button>
        </div>

        {/* ================= SEARCH ================= */}
        <div style={styles.searchSection}>

          <div
            ref={searchRef}
            style={styles.searchWrapper}
          >
           <div style={styles.searchIcon}>
  <FiSearch size={19} />
</div>

            <input
              type="text"
              value={searchTerm}
              placeholder="Search medicines, brands or categories..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => {
                if (searchTerm.trim()) {
                  setSuggestionsOpen(true);
                }
              }}
              style={styles.searchInput}
            />

            {searchTerm && (
              <button
  onClick={clearSearch}
  style={styles.clearButton}
  aria-label="Clear search"
>
  <FiX size={18} />
</button>
            )}

            {/* ================= SUGGESTIONS ================= */}
            {suggestionsOpen &&
              searchTerm.trim() &&
              suggestions.length > 0 && (
                <div style={styles.suggestionsBox}>

                  <div style={styles.suggestionHeader}>
                    <span>Suggestions</span>
                  </div>

                  {suggestions.map((medicine) => (
                    <button
                      key={medicine.id}
                      style={styles.suggestionItem}
                      onClick={() =>
                        handleSuggestionClick(medicine)
                      }
                    >
                      <div style={styles.suggestionIcon}>
                        💊
                      </div>

                      <div style={styles.suggestionInfo}>
                        <div style={styles.suggestionName}>
                          {medicine.name}
                        </div>

                        <div style={styles.suggestionMeta}>
                          {medicine.brand
                            ? medicine.brand
                            : "PharmaPlus"}{" "}
                          {medicine.category
                            ? `• ${medicine.category}`
                            : ""}
                        </div>
                      </div>

                      <span style={styles.arrow}>
                        →
                      </span>
                    </button>
                  ))}
                </div>
              )}

            {suggestionsOpen &&
              searchTerm.trim() &&
              suggestions.length === 0 && (
                <div style={styles.noSuggestionBox}>
                  No medicine suggestions found.
                </div>
              )}
          </div>

          {/* CATEGORY FILTER */}
          <div style={styles.categoryContainer}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category
                    ? styles.categoryButtonActive
                    : {}),
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ================= RESULTS INFO ================= */}
        <div style={styles.resultsRow}>
          <p style={styles.resultsText}>
            {searchTerm
              ? `${searchResults.length} medicine${
                  searchResults.length !== 1 ? "s" : ""
                } found`
              : `${searchResults.length} medicines available`}
          </p>

          {searchTerm && (
            <button
              onClick={clearSearch}
              style={styles.clearSearchText}
            >
              Clear search
            </button>
          )}
        </div>

        {/* ================= MEDICINE GRID ================= */}
        {searchResults.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🔎</div>

            <h3 style={styles.emptyTitle}>
              No medicines found
            </h3>

            <p style={styles.emptyText}>
              Try a different medicine name, brand,
              category, or check the spelling.
            </p>

            <button
              onClick={clearSearch}
              style={styles.retryButton}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {searchResults.map((medicine) => {
              const isOutOfStock =
                !medicine.stock || medicine.stock <= 0;

              const isLowStock =
                medicine.stock > 0 &&
                medicine.stock <= 10;

              return (
                <div
                  key={medicine.id}
                  style={styles.card}
                >
                  {/* Medicine Icon */}
                  <div style={styles.medicineIcon}>
                    💊
                  </div>

                  {/* Category */}
                  {medicine.category && (
                    <span style={styles.categoryBadge}>
                      {medicine.category}
                    </span>
                  )}

                  {/* Name */}
                  <h3 style={styles.medicineName}>
                    {medicine.name}
                  </h3>

                  {/* Brand */}
                  {medicine.brand && (
                    <p style={styles.brand}>
                      {medicine.brand}
                    </p>
                  )}

                  {/* Description */}
                  {medicine.description && (
                    <p style={styles.description}>
                      {medicine.description}
                    </p>
                  )}

                  {/* Price */}
                  <div style={styles.price}>
                    PKR{" "}
                    {Number(medicine.price || 0).toLocaleString()}
                  </div>

                  {/* Stock */}
                  <div style={styles.stockRow}>
                    <span
                      style={{
                        ...styles.stockDot,
                        backgroundColor: isOutOfStock
                          ? "#ef4444"
                          : isLowStock
                          ? "#f59e0b"
                          : "#22c55e",
                      }}
                    />

                    <span
                      style={{
                        ...styles.stockText,
                        color: isOutOfStock
                          ? "#dc2626"
                          : isLowStock
                          ? "#d97706"
                          : "#16a34a",
                      }}
                    >
                      {isOutOfStock
                        ? "Out of stock"
                        : isLowStock
                        ? `Only ${medicine.stock} left`
                        : `${medicine.stock} available`}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
  disabled={isOutOfStock}
  onClick={() => addToCart(medicine)}
  style={{
    ...styles.addButton,
    ...(isOutOfStock ? styles.addButtonDisabled : {}),
  }}
>
  {isOutOfStock ? (
    "Out of Stock"
  ) : (
    <>
      <FiShoppingCart size={17} />
      <span>Add to Cart</span>
    </>
  )}
</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "32px 20px 60px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "32px",
    fontWeight: "800",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },
cartButton: {
  border: "none",
  backgroundColor: "#2563eb",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: "8px",
},

  searchSection: {
    marginBottom: "24px",
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "700px",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    zIndex: 2,
  },

  searchInput: {
    width: "100%",
    height: "52px",
    padding: "0 48px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },

  clearButton: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "24px",
    cursor: "pointer",
    lineHeight: 1,
  },

  suggestionsBox: {
    position: "absolute",
    top: "58px",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
    zIndex: 50,
  },

  suggestionHeader: {
    padding: "11px 16px",
    borderBottom: "1px solid #f1f5f9",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  suggestionItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },

  suggestionIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  suggestionInfo: {
    flex: 1,
    minWidth: 0,
  },

  suggestionName: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "3px",
  },

  suggestionMeta: {
    color: "#64748b",
    fontSize: "12px",
  },

  arrow: {
    color: "#94a3b8",
    fontSize: "18px",
  },

  noSuggestionBox: {
    position: "absolute",
    top: "58px",
    left: 0,
    right: 0,
    padding: "16px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
    color: "#64748b",
    fontSize: "14px",
    zIndex: 50,
  },

  categoryContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px",
  },

  categoryButton: {
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    color: "#475569",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  categoryButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    color: "#fff",
  },

  resultsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  resultsText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  clearSearchText: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
    transition: "transform 0.2s ease",
  },

  medicineIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    marginBottom: "12px",
  },

  categoryBadge: {
    display: "inline-block",
    backgroundColor: "#ecfeff",
    color: "#0f766e",
    fontSize: "11px",
    fontWeight: "700",
    padding: "5px 9px",
    borderRadius: "20px",
    marginBottom: "10px",
  },

  medicineName: {
    margin: "0 0 5px",
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: "750",
  },

  brand: {
    margin: "0 0 8px",
    color: "#64748b",
    fontSize: "13px",
  },

  description: {
    margin: "0 0 14px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
    minHeight: "36px",
  },

  price: {
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  stockRow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "16px",
  },

  stockDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
  },

  stockText: {
    fontSize: "12px",
    fontWeight: "700",
  },

  addButton: {
    width: "100%",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "11px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  addButtonDisabled: {
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
  },

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  spinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "14px",
    color: "#64748b",
    fontSize: "14px",
  },

  errorBox: {
    maxWidth: "500px",
    margin: "80px auto",
    backgroundColor: "#fff",
    border: "1px solid #fecaca",
    borderRadius: "16px",
    padding: "35px",
    textAlign: "center",
  },

  errorIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  errorTitle: {
    margin: "0 0 8px",
    color: "#0f172a",
  },

  errorText: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "20px",
  },

  retryButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "9px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "60px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#0f172a",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    maxWidth: "450px",
    margin: "0 auto 20px",
    lineHeight: 1.6,
  },
};

export default Medicines;