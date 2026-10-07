import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

const API_BASE_URL = "https://pharmaplus-production-7fa8.up.railway.app/api/v1";

const Doctors = ({ setActiveTab }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/appointments/doctors`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load doctors."
          );
        }

        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      } catch (err) {
        console.error("Fetch Doctors Error:", err);

        setError(
          err.message ||
            "Unable to load doctors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search doctors
  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFilteredDoctors(doctors);
      return;
    }

    const results = doctors.filter((doctor) => {
      const name = doctor.fullName?.toLowerCase() || "";

      const branchName =
        doctor.branch?.name?.toLowerCase() || "";

      const branchLocation =
        doctor.branch?.location?.toLowerCase() || "";

      return (
        name.includes(query) ||
        branchName.includes(query) ||
        branchLocation.includes(query)
      );
    });

    setFilteredDoctors(results);
  }, [search, doctors]);

 const handleBookAppointment = (doctorId) => {
  setActiveTab("appointments");

  // Selected doctor temporarily store
  sessionStorage.setItem("selectedDoctorId", doctorId);
};

  const handleBack = () => {
    setActiveTab("home");
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>

        <button
          type="button"
          onClick={handleBack}
          style={styles.backButton}
        >
          <FiArrowLeft size={17} />
          Back
        </button>

        <div>
          <h1 style={styles.title}>
            Find Doctors
          </h1>

          <p style={styles.subtitle}>
            Find a doctor and request an appointment
            with PharmaPlus.
          </p>
        </div>

      </div>

      {/* Search */}
      <div style={styles.searchWrapper}>
        <FiSearch
          size={19}
          color="#64748b"
          style={styles.searchIcon}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor, branch or location..."
          style={styles.searchInput}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={styles.stateBox}>
          <div style={styles.spinner}>⏳</div>
          <p>Loading available doctors...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={styles.errorBox}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredDoctors.length === 0 && (
          <div style={styles.stateBox}>
            <div style={styles.emptyIcon}>
              👨‍⚕️
            </div>

            <h3 style={styles.emptyTitle}>
              No doctors found
            </h3>

            <p style={styles.emptyText}>
              Try searching with another doctor name,
              branch or location.
            </p>
          </div>
        )}

      {/* Doctors */}
      {!loading &&
        !error &&
        filteredDoctors.length > 0 && (
          <>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>
                Available Doctors
              </h2>

              <span style={styles.resultCount}>
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>

            <div style={styles.grid}>
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={styles.doctorCard}
                >

                  {/* Doctor Avatar */}
                  <div style={styles.avatar}>
                    <FiUser size={30} />
                  </div>

                  {/* Doctor Info */}
                  <div style={styles.doctorContent}>

                    <div style={styles.nameRow}>
                      <h3 style={styles.doctorName}>
                        {doctor.fullName}
                      </h3>

                      <span style={styles.activeBadge}>
                        Available
                      </span>
                    </div>

                    <p style={styles.specialty}>
                      PharmaPlus Doctor
                    </p>

                    {doctor.branch && (
                      <div style={styles.locationRow}>
                        <FiMapPin size={15} />

                        <span>
                          {doctor.branch.name}

                          {doctor.branch.location
                            ? ` — ${doctor.branch.location}`
                            : ""}
                        </span>
                      </div>
                    )}

                    <div style={styles.divider} />

                    <button
                      type="button"
                      onClick={() =>
                        handleBookAppointment(
                          doctor.id
                        )
                      }
                      style={styles.bookButton}
                    >
                      <FiCalendar size={17} />
                      Book Appointment
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}

    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f8fafc",
    padding: "32px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    maxWidth: "1180px",
    margin: "0 auto 25px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
    marginBottom: "18px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "30px",
    fontWeight: "800",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  searchWrapper: {
    maxWidth: "1180px",
    height: "50px",
    margin: "0 auto 30px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    position: "relative",
    boxSizing: "border-box",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
  },

  searchInput: {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "0 16px 0 46px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  resultHeader: {
    maxWidth: "1180px",
    margin: "0 auto 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
  },

  resultCount: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  grid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "18px",
  },

  doctorCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    gap: "15px",
    boxSizing: "border-box",
    boxShadow:
      "0 3px 12px rgba(15, 23, 42, 0.035)",
  },

  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  doctorContent: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
  },

  doctorName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "800",
  },

  activeBadge: {
    padding: "4px 7px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "9px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  specialty: {
    margin: "4px 0 9px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "600",
  },

  locationRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "15px 0",
  },

  bookButton: {
    width: "100%",
    height: "40px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  stateBox: {
    maxWidth: "600px",
    margin: "60px auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "45px 25px",
    textAlign: "center",
    color: "#64748b",
  },

  spinner: {
    fontSize: "28px",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },

  emptyText: {
    margin: "7px 0 0",
    fontSize: "13px",
  },

  errorBox: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "14px",
    borderRadius: "9px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default Doctors;