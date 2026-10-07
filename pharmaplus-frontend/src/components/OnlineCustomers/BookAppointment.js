import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";

const API_BASE_URL = "https://pharmaplus-production-7fa8.up.railway.app/api/v1";

const BookAppointment = ({ setActiveTab, selectedDoctorId = "" }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(selectedDoctorId);

  const [problem, setProblem] = useState("");
  const [appointmentType, setAppointmentType] =
    useState("PHYSICAL_CHECKUP");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // GET ACTIVE DOCTORS
  // --------------------------------------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
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

        // If doctor was passed from Home, keep it selected
        if (
          selectedDoctorId &&
          data.doctors?.some(
            (doctor) => doctor.id === selectedDoctorId
          )
        ) {
          setSelectedDoctor(selectedDoctorId);
        }
      } catch (err) {
        console.error("Fetch Doctors Error:", err);

        setError(
          err.message ||
            "Unable to load doctors. Please try again."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedDoctorId]);

  // --------------------------------------------------
  // SELECTED DOCTOR
  // --------------------------------------------------
  const selectedDoctorData = doctors.find(
    (doctor) => doctor.id === selectedDoctor
  );

  // --------------------------------------------------
  // SUBMIT APPOINTMENT REQUEST
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login first to book an appointment."
      );

      setTimeout(() => {
        setActiveTab("login");
      }, 1200);

      return;
    }

    // Basic validation
    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!problem.trim()) {
      setError("Please describe your problem.");
      return;
    }

    if (!appointmentType) {
      setError("Please select an appointment type.");
      return;
    }

    try {
      setSubmitting(true);

      // Send appointment request
      // Date/time will be assigned by the doctor later.
      const response = await fetch(
        `${API_BASE_URL}/appointments/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            problem: problem.trim(),
            type: appointmentType,
            doctorId: selectedDoctor,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to book appointment."
        );
      }

      setSuccess(
        "Appointment request submitted successfully! The doctor will assign your appointment date and time."
      );

      // Clear problem only
      setProblem("");

      // Keep selected doctor and appointment type
    } catch (err) {
      console.error("Book Appointment Error:", err);

      setError(
        err.message ||
          "Something went wrong while booking the appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------
  const handleBack = () => {
    if (setActiveTab) {
      setActiveTab("home");
    }
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
          <FiArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1 style={styles.title}>
            Book an Appointment
          </h1>

          <p style={styles.subtitle}>
            Choose a doctor and request your appointment
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div style={styles.card}>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={styles.successBox}>
            <FiCheckCircle size={20} />

            <div>
              <strong>Success!</strong>

              <p style={styles.successText}>
                {success}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Doctor */}
          <div style={styles.formGroup}>

            <label style={styles.label}>
              <FiUser size={16} />
              Select Doctor
            </label>

            {loadingDoctors ? (
              <div style={styles.loadingBox}>
                Loading available doctors...
              </div>
            ) : doctors.length === 0 ? (
              <div style={styles.emptyBox}>
                No active doctors are currently available.
              </div>
            ) : (
              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                style={styles.select}
              >
                <option value="">
                  Select a doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.fullName}

                    {doctor.branch?.name
                      ? ` — ${doctor.branch.name}`
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Doctor Information */}
          {selectedDoctorData && (
            <div style={styles.doctorInfo}>

              <div style={styles.doctorIcon}>
                🩺
              </div>

              <div style={styles.doctorDetails}>

                <h3 style={styles.doctorName}>
                  {selectedDoctorData.fullName}
                </h3>

                <p style={styles.doctorSpecialty}>
                  PharmaPlus Doctor
                </p>

                {selectedDoctorData.branch && (
                  <p style={styles.doctorBranch}>
                    📍 {selectedDoctorData.branch.name}

                    {selectedDoctorData.branch.location
                      ? ` — ${selectedDoctorData.branch.location}`
                      : ""}
                  </p>
                )}

              </div>
            </div>
          )}

          {/* Appointment Type */}
          <div style={styles.formGroup}>

            <label style={styles.label}>
              Appointment Type
            </label>

            <select
              value={appointmentType}
              onChange={(e) =>
                setAppointmentType(e.target.value)
              }
              style={styles.select}
            >
              <option value="PHYSICAL_CHECKUP">
                Physical Checkup
              </option>

              <option value="ONLINE_CONSULT">
                Online Consultation
              </option>

              <option value="XRAY_SCAN">
                X-Ray / Scan
              </option>

              <option value="LAB_TEST">
                Lab Test
              </option>
            </select>

          </div>

          {/* Problem */}
          <div style={styles.formGroup}>

            <label style={styles.label}>
              Describe Your Problem
            </label>

            <textarea
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Briefly describe the reason for your appointment..."
              rows={5}
              style={styles.textarea}
            />

            <p style={styles.helperText}>
              Please provide a short description so the
              doctor can understand your appointment request.
            </p>

          </div>

          {/* Appointment Information */}
          <div style={styles.infoBox}>

            <div style={styles.infoIcon}>
              🗓️
            </div>

            <div>
              <p style={styles.infoTitle}>
                Appointment Date & Time
              </p>

              <p style={styles.infoText}>
                The doctor will review your request and
                assign the appointment date and time.
              </p>
            </div>

          </div>

          {/* Branch */}
          {selectedDoctorData?.branch && (
            <div style={styles.branchBox}>

              <div style={styles.branchIcon}>
                🏥
              </div>

              <div>

                <p style={styles.branchLabel}>
                  Appointment Branch
                </p>

                <p style={styles.branchName}>
                  {selectedDoctorData.branch.name}
                </p>

                {selectedDoctorData.branch.location && (
                  <p style={styles.branchLocation}>
                    {selectedDoctorData.branch.location}
                  </p>
                )}

              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              submitting ||
              loadingDoctors ||
              doctors.length === 0
            }
            style={{
              ...styles.submitButton,

              ...(submitting ||
              loadingDoctors ||
              doctors.length === 0
                ? styles.submitButtonDisabled
                : {}),
            }}
          >
            {submitting
              ? "Submitting Request..."
              : "Request Appointment"}
          </button>

        </form>
      </div>
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
    maxWidth: "900px",
    margin: "0 auto 24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  backButton: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    backgroundColor: "transparent",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
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

  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "28px",
    boxSizing: "border-box",
    boxShadow:
      "0 4px 18px rgba(15, 23, 42, 0.04)",
  },

  formGroup: {
    marginBottom: "22px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "9px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  select: {
    width: "100%",
    height: "46px",
    padding: "0 13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    minHeight: "120px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  helperText: {
    margin: "7px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  doctorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "22px",
  },

  doctorIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  doctorDetails: {
    minWidth: 0,
  },

  doctorName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "800",
  },

  doctorSpecialty: {
    margin: "3px 0",
    color: "#0d9488",
    fontSize: "12px",
    fontWeight: "600",
  },

  doctorBranch: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#eff6ff",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
  },

  infoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  infoTitle: {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "12px",
    fontWeight: "800",
  },

  infoText: {
    margin: "4px 0 0",
    color: "#475569",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  branchBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px",
    marginBottom: "24px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },

  branchIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    backgroundColor: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  branchLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  branchName: {
    margin: "3px 0",
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: "700",
  },

  branchLocation: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  submitButton: {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#0d9488",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
  },

  submitButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  successBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    padding: "13px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  successText: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#166534",
    lineHeight: "1.5",
  },

  loadingBox: {
    padding: "13px",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    fontSize: "13px",
  },

  emptyBox: {
    padding: "13px",
    borderRadius: "8px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    color: "#92400e",
    fontSize: "13px",
  },
};

export default BookAppointment;