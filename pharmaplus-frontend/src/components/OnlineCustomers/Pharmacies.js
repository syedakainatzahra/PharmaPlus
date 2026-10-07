import React, { useEffect, useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiSearch,
  FiMap,
  FiRefreshCw,
  FiAlertCircle,
  FiNavigation
} from "react-icons/fi";

const API_URL = "https://pharmaplus-production-7fa8.up.railway.app";

const Pharmacies = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PUBLIC PHARMACIES
  // ==========================================

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/v1/branches/public`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load pharmacies."
        );
      }

      setBranches(data.branches || []);
      setFilteredBranches(data.branches || []);
    } catch (error) {
      console.error("Pharmacies error:", error);

      setError(
        error.message ||
          "Unable to load pharmacies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  useEffect(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      setFilteredBranches(branches);
      return;
    }

    const filtered = branches.filter((branch) => {
      return (
        branch.name?.toLowerCase().includes(search) ||
        branch.location?.toLowerCase().includes(search) ||
        branch.code?.toLowerCase().includes(search)
      );
    });

    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>

          <h3 style={styles.loadingTitle}>
            Finding Pharmacies...
          </h3>

          <p style={styles.loadingText}>
            Please wait while we load available PharmaPlus branches.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <FiAlertCircle size={30} />
          </div>

          <h2 style={styles.errorTitle}>
            Unable to Load Pharmacies
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            onClick={fetchBranches}
            style={styles.retryButton}
          >
            <FiRefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ==========================================
          HERO
      ========================================== */}

      <section style={styles.hero}>
        <div style={styles.heroContent}>

          <div style={styles.heroIcon}>
            <FiMapPin size={30} />
          </div>

          <p style={styles.eyebrow}>
            PHARMAPLUS NETWORK
          </p>

          <h1 style={styles.heroTitle}>
            Find a Pharmacy Near You
          </h1>

          <p style={styles.heroDescription}>
            Explore our PharmaPlus pharmacy branches and
            find the location that is convenient for you.
          </p>

        </div>
      </section>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <section style={styles.searchSection}>
        <div style={styles.searchWrapper}>

          <FiSearch
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />

          <input
            type="text"
            placeholder="Search by pharmacy name, location or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

        </div>
      </section>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <section style={styles.content}>

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              OUR LOCATIONS
            </p>

            <h2 style={styles.sectionTitle}>
              PharmaPlus Pharmacies
            </h2>
          </div>

          <div style={styles.branchCount}>
            {filteredBranches.length}{" "}
            {filteredBranches.length === 1
              ? "Pharmacy"
              : "Pharmacies"}
          </div>
        </div>

        {/* ========================================
            NO RESULTS
        ======================================== */}

        {filteredBranches.length === 0 ? (
          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              <FiMapPin size={30} />
            </div>

            <h3 style={styles.emptyTitle}>
              No Pharmacies Found
            </h3>

            <p style={styles.emptyText}>
              We couldn't find a pharmacy matching your search.
            </p>

            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearButton}
            >
              Clear Search
            </button>

          </div>
        ) : (

          /* ======================================
             BRANCH CARDS
          ====================================== */

          <div style={styles.grid}>

            {filteredBranches.map((branch) => (

              <div
                key={branch.id}
                style={styles.card}
              >

                {/* CARD HEADER */}

                <div style={styles.cardHeader}>

                  <div style={styles.pharmacyIcon}>
                    <FiMapPin size={23} />
                  </div>

                  <div style={styles.cardHeaderText}>

                    <h3 style={styles.cardTitle}>
                      {branch.name}
                    </h3>

                    {branch.code && (
                      <span style={styles.branchCode}>
                        {branch.code}
                      </span>
                    )}

                  </div>

                  <span style={styles.activeBadge}>
                    Open
                  </span>

                </div>

                {/* LOCATION */}

                <div style={styles.infoRow}>

                  <div style={styles.infoIcon}>
                    <FiMapPin size={17} />
                  </div>

                  <div>
                    <p style={styles.infoLabel}>
                      Location
                    </p>

                    <p style={styles.infoValue}>
                      {branch.location || "Location not available"}
                    </p>
                  </div>

                </div>

                {/* PHONE */}

                {branch.phone && (
                  <div style={styles.infoRow}>

                    <div style={styles.infoIcon}>
                      <FiPhone size={17} />
                    </div>

                    <div>
                      <p style={styles.infoLabel}>
                        Contact
                      </p>

                      <p style={styles.infoValue}>
                        {branch.phone}
                      </p>
                    </div>

                  </div>
                )}

                {/* ACTIONS */}

                <div style={styles.actions}>

                  {branch.phone ? (
  <a
    href={`tel:${branch.phone}`}
    style={styles.callButton}
  >
    📞 Call Pharmacy
  </a>
) : (
  <button
    disabled
    style={styles.disabledCallButton}
  >
    📞 Phone Not Available
  </button>
)}
                  <a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${branch.name}, ${branch.location}`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  style={styles.locationButton}
>
  View Location
</a>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>
    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },

  hero: {
    background:
      "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
    borderBottom: "1px solid #e2e8f0",
    padding: "65px 20px 60px",
  },

  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
  },

  heroIcon: {
    width: "62px",
    height: "62px",
    margin: "0 auto 18px",
    borderRadius: "18px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.20)",
  },

  eyebrow: {
    margin: 0,
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  heroTitle: {
    margin: "10px 0 12px",
    fontSize: "38px",
    lineHeight: "1.15",
    fontWeight: "800",
    color: "#0f172a",
  },

  heroDescription: {
    maxWidth: "650px",
    margin: "0 auto",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  searchSection: {
    padding: "28px 20px 10px",
    backgroundColor: "#f8fafc",
  },

  searchWrapper: {
    maxWidth: "720px",
    margin: "0 auto",
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
  },

  searchInput: {
    width: "100%",
    height: "52px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    padding: "0 18px 0 50px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
  },

  content: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "35px 20px 70px",
    boxSizing: "border-box",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
  },

  sectionEyebrow: {
    margin: "0 0 5px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
  },

  branchCount: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "20px",
    padding: "7px 13px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "22px",
  },

  pharmacyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "750",
    color: "#0f172a",
  },

  branchCode: {
    display: "inline-block",
    marginTop: "4px",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600",
  },

  activeBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    borderRadius: "20px",
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: "700",
  },

  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    padding: "12px 0",
    borderTop: "1px solid #f1f5f9",
  },

  infoIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoLabel: {
    margin: "0 0 3px",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  infoValue: {
    margin: 0,
    color: "#334155",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  actions: {
    display: "flex",
    gap: "9px",
    marginTop: "18px",
  },

  callButton: {
  flex: 1,
  textDecoration: "none",
  textAlign: "center",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  fontSize: "14px",
},

disabledCallButton: {
  flex: 1,
  padding: "12px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#e5e7eb",
  color: "#9ca3af",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "not-allowed",
},

locationButton: {
  flex: 1,
  textDecoration: "none",
  textAlign: "center",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#ecfdf5",
  color: "#059669",
  fontWeight: "600",
  fontSize: "14px",
  border: "1px solid #a7f3d0",
},

  emptyState: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "60px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    margin: "0 0 7px",
    fontSize: "19px",
    fontWeight: "750",
  },

  emptyText: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "13px",
  },

  clearButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 17px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingContainer: {
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    textAlign: "center",
  },

  loader: {
    width: "38px",
    height: "38px",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },

  loadingTitle: {
    margin: "0 0 7px",
    fontSize: "20px",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  errorContainer: {
    maxWidth: "500px",
    margin: "80px auto",
    backgroundColor: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "16px",
    padding: "40px 25px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  errorIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
    color: "#0f172a",
  },

  errorText: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  retryButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "9px",
    padding: "11px 18px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Pharmacies;