import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiUser,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const API_BASE_URL = "https://pharmaplus-production-7fa8.up.railway.app/api/v1";

const MyAppointments = ({ setActiveTab }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH MY APPOINTMENT REQUESTS
  // --------------------------------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your appointments.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/appointments/my-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("MY APPOINTMENTS API RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load your appointments."
        );
      }

      // Backend response:
      // { success: true, requests: [...] }
      setAppointments(data.requests || []);
    } catch (err) {
      console.error("Fetch Appointments Error:", err);

      setError(
        err.message ||
          "Something went wrong while loading appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------
  const formatDate = (dateValue) => {
    if (!dateValue) return "Not scheduled yet";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not scheduled yet";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------
  const formatTime = (dateValue) => {
    if (!dateValue) return "Not scheduled yet";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not scheduled yet";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // APPOINTMENT TYPE
  // --------------------------------------------------
  const formatAppointmentType = (type) => {
    const types = {
      PHYSICAL_CHECKUP: "Physical Checkup",
      ONLINE_CONSULT: "Online Consultation",
      XRAY_SCAN: "X-Ray / Scan",
      LAB_TEST: "Lab Test",
    };

    return types[type] || type || "Appointment";
  };

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          backgroundColor: "#dcfce7",
          color: "#15803d",
        };

      case "COMPLETED":
        return {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
        };

      case "CANCELLED":
        return {
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
        };

      case "REJECTED":
        return {
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
        };

      case "PENDING":
      default:
        return {
          backgroundColor: "#fef3c7",
          color: "#a16207",
        };
    }
  };

  // --------------------------------------------------
  // STATUS TEXT
  // --------------------------------------------------
  const formatStatus = (status) => {
    const statuses = {
      PENDING: "Waiting for Doctor",
      CONFIRMED: "Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      REJECTED: "Rejected",
    };

    return statuses[status] || "Pending";
  };

  // --------------------------------------------------
  // BACK TO HOME
  // --------------------------------------------------
  const handleBack = () => {
    if (setActiveTab) {
      setActiveTab("home");
    }
  };

  // --------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------
  if (!localStorage.getItem("token") && !loading) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔐</div>

          <h2 style={styles.emptyTitle}>
            Login Required
          </h2>

          <p style={styles.emptyText}>
            Please login to view your appointment history.
          </p>

          <button
            onClick={() => setActiveTab("login")}
            style={styles.primaryButton}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button
          onClick={handleBack}
          style={styles.backButton}
        >
          <FiArrowLeft size={18} />
          Back
        </button>

        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              My Appointments
            </h1>

            <p style={styles.subtitle}>
              View and track your appointment requests
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            style={styles.refreshButton}
            disabled={loading}
          >
            <FiRefreshCw
              size={16}
              style={loading ? styles.spinning : {}}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={styles.errorBox}>
          <span>
            <FiAlertCircle size={16} />
          </span>

          <span>{error}</span>

          <button
            onClick={fetchAppointments}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>

          <p>Loading your appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        /* EMPTY */
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>

          <h2 style={styles.emptyTitle}>
            No Appointment Requests Yet
          </h2>

          <p style={styles.emptyText}>
            You don't have any appointment requests yet.
          </p>

          <button
            onClick={() => setActiveTab("appointments")}
            style={styles.primaryButton}
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        /* APPOINTMENTS */
        <div style={styles.appointmentsContainer}>
          {/* SUMMARY */}
          <div style={styles.summaryBar}>
            <div>
              <span style={styles.summaryLabel}>
                Total Requests
              </span>

              <strong style={styles.summaryNumber}>
                {appointments.length}
              </strong>
            </div>
          </div>

          {/* APPOINTMENT LIST */}
          <div style={styles.appointmentsList}>
            {appointments.map((appointment) => {
              const statusStyle = getStatusStyle(
                appointment.status
              );

              const isPending =
                appointment.status === "PENDING";

              const isConfirmed =
                appointment.status === "CONFIRMED";

              return (
                <div
                  key={appointment.id}
                  style={styles.appointmentCard}
                >
                  {/* CARD TOP */}
                  <div style={styles.cardTop}>
                    <div style={styles.doctorSection}>
                      <div style={styles.doctorIcon}>
                        <FiUser size={22} />
                      </div>

                      <div>
                        <h3 style={styles.doctorName}>
                          {appointment.doctor?.fullName ||
                            "Doctor"}
                        </h3>

                        <p
                          style={
                            styles.doctorSpecialty
                          }
                        >
                          PharmaPlus Doctor
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        ...statusStyle,
                      }}
                    >
                      {formatStatus(
                        appointment.status
                      )}
                    </span>
                  </div>

                  {/* PENDING MESSAGE */}
                  {isPending && (
                    <div style={styles.pendingBox}>
                      <FiClock
                        size={17}
                        style={styles.pendingIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.pendingTitle
                          }
                        >
                          Appointment request sent
                        </p>

                        <p
                          style={
                            styles.pendingText
                          }
                        >
                          Your request has been sent to
                          the doctor. The doctor will
                          review it and assign your
                          appointment date and time.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CONFIRMED MESSAGE */}
                  {isConfirmed && (
                    <div style={styles.confirmedBox}>
                      <FiCheckCircle
                        size={17}
                        style={styles.confirmedIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.confirmedTitle
                          }
                        >
                          Appointment confirmed
                        </p>

                        <p
                          style={
                            styles.confirmedText
                          }
                        >
                          Your doctor has confirmed the
                          appointment and assigned a
                          date and time.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DETAILS */}
                  <div style={styles.detailsGrid}>
                    {/* DATE */}
                    <div style={styles.detailItem}>
                      <FiCalendar
                        size={17}
                        style={styles.detailIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.detailLabel
                          }
                        >
                          Appointment Date
                        </p>

                        <p
                          style={{
                            ...styles.detailValue,
                            ...(isPending
                              ? styles.pendingValue
                              : {}),
                          }}
                        >
                          {formatDate(
                            appointment.scheduledAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* TIME */}
                    <div style={styles.detailItem}>
                      <FiClock
                        size={17}
                        style={styles.detailIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.detailLabel
                          }
                        >
                          Appointment Time
                        </p>

                        <p
                          style={{
                            ...styles.detailValue,
                            ...(isPending
                              ? styles.pendingValue
                              : {}),
                          }}
                        >
                          {formatTime(
                            appointment.scheduledAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* TYPE */}
                    <div style={styles.detailItem}>
                      <FiFileText
                        size={17}
                        style={styles.detailIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.detailLabel
                          }
                        >
                          Type
                        </p>

                        <p
                          style={
                            styles.detailValue
                          }
                        >
                          {formatAppointmentType(
                            appointment.type
                          )}
                        </p>
                      </div>
                    </div>

                    {/* BRANCH */}
                    <div style={styles.detailItem}>
                      <FiMapPin
                        size={17}
                        style={styles.detailIcon}
                      />

                      <div>
                        <p
                          style={
                            styles.detailLabel
                          }
                        >
                          Branch
                        </p>

                        <p
                          style={
                            styles.detailValue
                          }
                        >
                          {appointment.branch?.name ||
                            "Branch not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PROBLEM */}
                  {appointment.problem && (
                    <div style={styles.problemBox}>
                      <p
                        style={
                          styles.problemLabel
                        }
                      >
                        Problem / Reason
                      </p>

                      <p
                        style={
                          styles.problemText
                        }
                      >
                        {appointment.problem}
                      </p>
                    </div>
                  )}

                  {/* BRANCH LOCATION */}
                  {appointment.branch?.location && (
                    <div style={styles.locationText}>
                      <FiMapPin size={14} />

                      {appointment.branch.location}
                    </div>
                  )}

                  {/* REQUEST DATE */}
                  {appointment.createdAt && (
                    <div style={styles.createdDate}>
                      Request submitted on{" "}
                      {formatDate(
                        appointment.createdAt
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
    maxWidth: "1000px",
    margin: "0 auto 25px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    backgroundColor: "transparent",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
    marginBottom: "18px",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: "800",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
    padding: "9px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  spinning: {
    animation: "spin 1s linear infinite",
  },

  errorBox: {
    maxWidth: "1000px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: "600",
  },

  retryButton: {
    marginLeft: "auto",
    border: "none",
    backgroundColor: "transparent",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "underline",
  },

  loadingState: {
    maxWidth: "1000px",
    minHeight: "300px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "13px",
  },

  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #0d9488",
    borderRadius: "50%",
    marginBottom: "12px",
  },

  appointmentsContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  summaryBar: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "16px",
  },

  summaryLabel: {
    color: "#64748b",
    fontSize: "12px",
    marginRight: "10px",
  },

  summaryNumber: {
    color: "#0f172a",
    fontSize: "16px",
  },

  appointmentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  appointmentCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
    boxSizing: "border-box",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9",
  },

  doctorSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  doctorIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  doctorName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "800",
  },

  doctorSpecialty: {
    margin: "3px 0 0",
    color: "#0d9488",
    fontSize: "11px",
    fontWeight: "600",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  // --------------------------------------------------
  // PENDING / CONFIRMED MESSAGE BOXES
  // --------------------------------------------------

  pendingBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "9px",
    padding: "12px",
    marginTop: "16px",
  },

  pendingIcon: {
    color: "#d97706",
    flexShrink: 0,
    marginTop: "2px",
  },

  pendingTitle: {
    margin: 0,
    color: "#92400e",
    fontSize: "12px",
    fontWeight: "800",
  },

  pendingText: {
    margin: "4px 0 0",
    color: "#a16207",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  confirmedBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "9px",
    padding: "12px",
    marginTop: "16px",
  },

  confirmedIcon: {
    color: "#16a34a",
    flexShrink: 0,
    marginTop: "2px",
  },

  confirmedTitle: {
    margin: 0,
    color: "#166534",
    fontSize: "12px",
    fontWeight: "800",
  },

  confirmedText: {
    margin: "4px 0 0",
    color: "#15803d",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    padding: "18px 0",
  },

  detailItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
  },

  detailIcon: {
    color: "#0d9488",
    flexShrink: 0,
    marginTop: "2px",
  },

  detailLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  detailValue: {
    margin: "4px 0 0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "1.4",
  },

  pendingValue: {
    color: "#a16207",
    fontStyle: "italic",
  },

  problemBox: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
  },

  problemLabel: {
    margin: "0 0 5px",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  problemText: {
    margin: 0,
    color: "#334155",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  locationText: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#64748b",
    fontSize: "11px",
    marginTop: "4px",
  },

  createdDate: {
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "12px",
  },

  emptyState: {
    maxWidth: "600px",
    minHeight: "350px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
    boxSizing: "border-box",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "16px",
  },

  emptyTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: "800",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "13px",
    margin: "8px 0 20px",
  },

  primaryButton: {
    border: "none",
    backgroundColor: "#0d9488",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default MyAppointments;