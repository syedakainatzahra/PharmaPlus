import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiArrowRight,
  FiCalendar,
  FiShoppingCart,
  FiMapPin,
  FiUpload,
  FiShield,
  FiTruck,
  FiHeart,
  FiUserPlus,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";

import pharmaPlusLogo from "../../assets/pharma-plus-logo.png";
import homepic from "../../assets/homepic.PNG";

import onlineConsultationImg from "../../assets/services/online-consultation.png";
import prescriptionUploadImg from "../../assets/services/prescription-upload.png";
import pharmacyImg from "../../assets/services/pharmacy.png";
import homeDeliveryImg from "../../assets/services/home-delivery.png";
import diagnosticServicesImg from "../../assets/services/diagnostic-services.png";
import healthWellnessImg from "../../assets/services/health-wellness.png";

const API_URL = "https://pharmaplus-production-7fa8.up.railway.app";

const Home = ({ setActiveTab, setCartCount }) => {
  // =========================================================
  // STATE
  // =========================================================

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // =========================================================
  // FETCH DOCTORS
  // =========================================================

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/appointments/doctors`
        );

        if (!response.ok) {
          throw new Error(
            `Doctors API failed with status ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          setDoctors(data.doctors || []);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // =========================================================
  // FETCH PHARMACY BRANCHES
  // =========================================================

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/branches/public`
        );

        if (!response.ok) {
          throw new Error(
            `Branches API failed with status ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          setBranches(data.branches || []);
        } else {
          setBranches([]);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        setBranches([]);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // =========================================================
  // SPECIALTIES
  // =========================================================

  const specialties = [
    {
      icon: "🩺",
      name: "General Physician",
    },
    {
      icon: "🧴",
      name: "Dermatologist",
    },
    {
      icon: "🦷",
      name: "Dentist",
    },
    {
      icon: "❤️",
      name: "Cardiologist",
    },
    {
      icon: "👩‍⚕️",
      name: "Gynecologist",
    },
    {
      icon: "👶",
      name: "Pediatrician",
    },
  ];

  // =========================================================
  // MEDICINES
  // =========================================================
  // Temporary placeholders.
  // We will add real medicine images later.

  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      description: "Pain & fever relief",
      price: "Rs. 120",
      icon: "💊",
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      description: "Daily vitamin supplement",
      price: "Rs. 320",
      icon: "🍊",
    },
    {
      id: 3,
      name: "ORS",
      description: "Oral rehydration solution",
      price: "Rs. 150",
      icon: "💧",
    },
    {
      id: 4,
      name: "Cetirizine 10mg",
      description: "Allergy relief",
      price: "Rs. 180",
      icon: "💊",
    },
  ];

  // =========================================================
  // SERVICES
  // =========================================================

  const services = [
    {
      type: "placeholder",
      icon: "👨‍⚕️",
      title: "Find a Doctor",
      description:
        "Find qualified doctors and healthcare specialists.",
      tab: "doctors",
    },
    {
      type: "placeholder",
      icon: "💊",
      title: "Order Medicines",
      description:
        "Order genuine medicines from PharmaPlus pharmacies.",
      tab: "medicines",
    },
    {
      type: "image",
      image: onlineConsultationImg,
      title: "Book Appointment",
      description:
        "Book physical or online consultations.",
      tab: "appointments",
    },
    {
      type: "image",
      image: pharmacyImg,
      title: "Find Pharmacy",
      description:
        "Explore PharmaPlus branches near you.",
      tab: "pharmacies",
    },
    {
      type: "image",
      image: prescriptionUploadImg,
      title: "Upload Prescription",
      description:
        "Upload your prescription and let our pharmacy team review it.",
      tab: "uploads",
    },
    {
      type: "image",
      image: homeDeliveryImg,
      title: "Home Delivery",
      description:
        "Get your medicines delivered conveniently to your doorstep.",
      tab: "medicines",
    },
    {
      type: "image",
      image: diagnosticServicesImg,
      title: "Diagnostic Services",
      description:
        "Access laboratory tests, X-rays and other diagnostic services.",
      tab: "appointments",
    },
    {
      type: "image",
      image: healthWellnessImg,
      title: "Health & Wellness",
      description:
        "Explore healthcare services designed for your overall wellbeing.",
      tab: "services",
    },
  ];

  // =========================================================
  // FUNCTIONS
  // =========================================================

  const navigate = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const addToCart = () => {
    if (setCartCount) {
      setCartCount((count) => count + 1);
    }
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <div style={styles.page}>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section style={styles.heroSection}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            <FiCheckCircle size={15} />
            Trusted Healthcare Platform
          </div>

          <h1 style={styles.heroTitle}>
            Your Health,
            <br />
            <span style={styles.heroTitleBlue}>
              Our Priority.
            </span>
          </h1>

          <p style={styles.heroDescription}>
            Find trusted doctors, order genuine medicines,
            book appointments, and access healthcare services
            — all in one place.
          </p>

          {/* SEARCH */}

          <div style={styles.heroSearch}>
            <FiSearch
              size={21}
              color="#64748b"
              style={{ flexShrink: 0 }}
            />

            <input
              type="text"
              placeholder="Search doctors, medicines, specialties..."
              style={styles.heroSearchInput}
            />

            <button
              style={styles.searchButton}
              onClick={() => navigate("doctors")}
            >
              Search
            </button>
          </div>

          {/* ACTION BUTTONS */}

          <div style={styles.heroActions}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("doctors")}
            >
              <FiUserPlus size={18} />
              Find a Doctor
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("medicines")}
            >
              <FiShoppingCart size={18} />
              Order Medicines
            </button>
          </div>

          {/* TRUST */}

          <div style={styles.heroTrust}>
            <span style={styles.heroTrustItem}>
              <FiCheckCircle color="#10b981" />
              Licensed Healthcare
            </span>

            <span style={styles.heroTrustItem}>
              <FiShield color="#10b981" />
              Secure & Safe
            </span>

            <span style={styles.heroTrustItem}>
              <FiTruck color="#10b981" />
              Home Delivery
            </span>
          </div>
        </div>

        {/* HERO RIGHT */}

        <div style={styles.heroRight}>
          <div style={styles.heroCircle}>
            <div style={styles.doctorIllustration}>
              <img
                src={homepic}
                alt="PharmaPlus Healthcare"
                style={styles.doctorImage}
              />
            </div>
          </div>

          {/* FLOATING CARD */}

          <div
            style={{
              ...styles.floatingCard,
              ...styles.floatingCardOne,
            }}
          >
            <div style={styles.floatingIcon}>
              <FiHeart size={20} />
            </div>

            <div>
              <strong style={styles.floatingTitle}>
                Trusted Care
              </strong>

              <span style={styles.floatingText}>
                For your family
              </span>
            </div>
          </div>

          <div
            style={{
              ...styles.floatingCard,
              ...styles.floatingCardTwo,
            }}
          >
            <div style={styles.floatingIcon}>
              <FiCheckCircle size={20} />
            </div>

            <div>
              <strong style={styles.floatingTitle}>
                Easy Booking
              </strong>

              <span style={styles.floatingText}>
                Book in minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionLabel}>
              Healthcare Services
            </span>

            <h2 style={styles.sectionTitle}>
              Everything you need for your health
            </h2>
          </div>

          <button
            style={styles.viewAllButton}
            onClick={() => navigate("services")}
          >
            View All
            <FiArrowRight size={16} />
          </button>
        </div>

        <div style={styles.serviceGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              style={styles.serviceCard}
              onClick={() => navigate(service.tab)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(15,23,42,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={styles.serviceIcon}>
                {service.type === "image" ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    style={styles.serviceImage}
                  />
                ) : (
                  service.icon
                )}
              </div>

              <h3 style={styles.serviceTitle}>
                {service.title}
              </h3>

              <p style={styles.serviceDescription}>
                {service.description}
              </p>

              <span style={styles.exploreText}>
                Explore
                <FiArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          SPECIALTIES
      ===================================================== */}

      <section
        style={{
          ...styles.section,
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={styles.centerHeading}>
          <span style={styles.sectionLabel}>
            Find the right specialist
          </span>

          <h2 style={styles.sectionTitle}>
            Popular Specialties
          </h2>

          <p style={styles.centerDescription}>
            Connect with healthcare professionals according
            to your healthcare needs.
          </p>
        </div>

        <div style={styles.specialtyGrid}>
          {specialties.map((specialty, index) => (
            <button
              key={index}
              style={styles.specialtyCard}
              onClick={() => navigate("doctors")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#93c5fd";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(15,23,42,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={styles.specialtyIcon}>
                {specialty.icon}
              </div>

              <span style={styles.specialtyName}>
                {specialty.name}
              </span>

              <FiArrowRight
                size={16}
                color="#94a3b8"
              />
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          MEDICINES
      ===================================================== */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionLabel}>
              Online Pharmacy
            </span>

            <h2 style={styles.sectionTitle}>
              Popular Medicines & Essentials
            </h2>
          </div>

          <button
            style={styles.viewAllButton}
            onClick={() => navigate("medicines")}
          >
            View All
            <FiArrowRight size={16} />
          </button>
        </div>

        <div style={styles.medicineGrid}>
          {medicines.map((medicine) => (
            <div
              key={medicine.id}
              style={styles.medicineCard}
            >
              <button
                style={styles.favoriteButton}
                title="Add to favourites"
              >
                <FiHeart size={17} />
              </button>

              <div style={styles.medicineImage}>
                {medicine.icon}
              </div>

              <div style={styles.medicineInfo}>
                <h3 style={styles.medicineName}>
                  {medicine.name}
                </h3>

                <p style={styles.medicineDescription}>
                  {medicine.description}
                </p>

                <div style={styles.ratingRow}>
                  <span>⭐</span>
                  <span>4.8</span>

                  <span style={styles.ratingReviews}>
                    (120 reviews)
                  </span>
                </div>

                <div style={styles.medicineBottom}>
                  <strong style={styles.medicinePrice}>
                    {medicine.price}
                  </strong>

                  <button
                    style={styles.addButton}
                    onClick={addToCart}
                  >
                    <FiShoppingCart size={14} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PRESCRIPTION
      ===================================================== */}

      <section style={styles.prescriptionSection}>
        <div style={styles.prescriptionIcon}>
          <FiUpload size={29} />
        </div>

        <div style={styles.prescriptionContent}>
          <span style={styles.sectionLabel}>
            Easy Medicine Ordering
          </span>

          <h2 style={styles.prescriptionTitle}>
            Have a prescription?
            <br />
            Let us handle the rest.
          </h2>

          <p style={styles.prescriptionDescription}>
            Upload your prescription and our pharmacy team
            can review it and help you get the required medicines.
          </p>

          <div style={styles.prescriptionPoints}>
            <span>
              <FiCheckCircle color="#10b981" />
              Fast Review
            </span>

            <span>
              <FiCheckCircle color="#10b981" />
              Safe & Secure
            </span>

            <span>
              <FiCheckCircle color="#10b981" />
              Home Delivery
            </span>
          </div>
        </div>

        <button
          style={styles.prescriptionButton}
          onClick={() => navigate("uploads")}
        >
          Upload Prescription
          <FiArrowRight size={16} />
        </button>
      </section>

      {/* =====================================================
          FEATURED DOCTORS
      ===================================================== */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionLabel}>
              Meet Our Doctors
            </span>

            <h2 style={styles.sectionTitle}>
              Featured Healthcare Professionals
            </h2>
          </div>

          <button
            style={styles.viewAllButton}
            onClick={() => navigate("doctors")}
          >
            View All
            <FiArrowRight size={16} />
          </button>
        </div>

        <div style={styles.doctorGrid}>
          {doctorsLoading ? (
            <p style={styles.doctorMessage}>
              Loading doctors...
            </p>
          ) : doctors.length === 0 ? (
            <p style={styles.doctorMessage}>
              No doctors available at the moment.
            </p>
          ) : (
            doctors.map((doctor, index) => (
              <div
                key={doctor.id || index}
                style={styles.doctorCard}
              >
                <div style={styles.doctorTop}>
                  <div style={styles.doctorAvatar}>
                    👨‍⚕️
                  </div>

                  <span style={styles.verifiedBadge}>
                    <FiCheckCircle size={12} />
                    Verified
                  </span>
                </div>

                <h3 style={styles.doctorName}>
                  {doctor.fullName || "Doctor"}
                </h3>

                <p style={styles.doctorSpecialty}>
                  {doctor.specialty ||
                    "Healthcare Specialist"}
                </p>

                <p style={styles.doctorExperience}>
                  {doctor.experience ||
                    "Experienced Healthcare Professional"}
                </p>

                <div style={styles.doctorRating}>
                  <FiStar
                    size={14}
                    fill="#f59e0b"
                    color="#f59e0b"
                  />

                  <strong>
                    {doctor.rating || "4.8"}
                  </strong>

                  <span style={styles.doctorRatingText}>
                    Excellent
                  </span>
                </div>

                <div style={styles.doctorFooter}>
                  <div style={styles.consultationFee}>
                    <small>
                      Consultation
                    </small>

                    <strong>
                      {doctor.fee || "Contact for fee"}
                    </strong>
                  </div>

                  <button
                    style={styles.bookButton}
                    onClick={() => {
                      if (doctor.id) {
                        sessionStorage.setItem(
                          "selectedDoctorId",
                          doctor.id
                        );
                      }

                      navigate("appointments");
                    }}
                  >
                    <FiCalendar size={14} />
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* =====================================================
          PHARMACY BRANCHES
      ===================================================== */}

      <section
        style={{
          ...styles.section,
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={styles.centerHeading}>
          <span style={styles.sectionLabel}>
            PharmaPlus Network
          </span>

          <h2 style={styles.sectionTitle}>
            Our Pharmacy Branches
          </h2>

          <p style={styles.centerDescription}>
            Access medicines and healthcare services
            through our trusted pharmacy network.
          </p>
        </div>

        <div style={styles.branchGrid}>
          {branchesLoading ? (
            <p style={styles.doctorMessage}>
              Loading pharmacy branches...
            </p>
          ) : branches.length === 0 ? (
            <p style={styles.doctorMessage}>
              No pharmacy branches available at the moment.
            </p>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.id}
                style={styles.branchCard}
                onClick={() => navigate("pharmacies")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(15,23,42,0.07)";
                  e.currentTarget.style.borderColor =
                    "#bfdbfe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor =
                    "#e2e8f0";
                }}
              >
                <div style={styles.branchIcon}>
                  🏥
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={styles.branchName}>
                    {branch.name || "PharmaPlus Branch"}
                  </h3>

                  <p style={styles.branchLocation}>
                    <FiMapPin size={13} />
                    {branch.location ||
                      "Location not available"}
                  </p>

                  {branch.code && (
                    <span style={styles.branchCode}>
                      Branch Code: {branch.code}
                    </span>
                  )}
                </div>

                <FiArrowRight
                  size={17}
                  color="#94a3b8"
                  style={{ flexShrink: 0 }}
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section style={styles.section}>
        <div style={styles.centerHeading}>
          <span style={styles.sectionLabel}>
            Simple & Convenient
          </span>

          <h2 style={styles.sectionTitle}>
            How PharmaPlus Works
          </h2>
        </div>

        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <span style={styles.stepNumber}>
              01
            </span>

            <div style={styles.stepIcon}>
              <FiSearch size={21} />
            </div>

            <h3 style={styles.stepTitle}>
              Find what you need
            </h3>

            <p style={styles.stepDescription}>
              Search for doctors, medicines,
              specialties, or healthcare services.
            </p>
          </div>

          <div style={styles.stepCard}>
            <span style={styles.stepNumber}>
              02
            </span>

            <div style={styles.stepIcon}>
              <FiUserPlus size={21} />
            </div>

            <h3 style={styles.stepTitle}>
              Choose your service
            </h3>

            <p style={styles.stepDescription}>
              Select a doctor, medicine, pharmacy,
              or appointment according to your needs.
            </p>
          </div>

          <div style={styles.stepCard}>
            <span style={styles.stepNumber}>
              03
            </span>

            <div style={styles.stepIcon}>
              <FiCalendar size={21} />
            </div>

            <h3 style={styles.stepTitle}>
              Book or order
            </h3>

            <p style={styles.stepDescription}>
              Book your appointment or place
              your medicine order easily.
            </p>
          </div>

          <div style={styles.stepCard}>
            <span style={styles.stepNumber}>
              04
            </span>

            <div style={styles.stepIcon}>
              <FiTruck size={21} />
            </div>

            <h3 style={styles.stepTitle}>
              Get your care
            </h3>

            <p style={styles.stepDescription}>
              Receive healthcare services or
              medicines through PharmaPlus.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST SECTION
      ===================================================== */}

      <section style={styles.trustSection}>
        <div style={styles.trustItem}>
          <FiShield
            size={24}
            color="#60a5fa"
          />

          <div>
            <strong style={styles.trustTitle}>
              Secure & Private
            </strong>

            <span style={styles.trustText}>
              Your information stays protected.
            </span>
          </div>
        </div>

        <div style={styles.trustItem}>
          <FiCheckCircle
            size={24}
            color="#60a5fa"
          />

          <div>
            <strong style={styles.trustTitle}>
              Trusted Healthcare
            </strong>

            <span style={styles.trustText}>
              Connect with verified professionals.
            </span>
          </div>
        </div>

        <div style={styles.trustItem}>
          <FiTruck
            size={24}
            color="#60a5fa"
          />

          <div>
            <strong style={styles.trustTitle}>
              Reliable Delivery
            </strong>

            <span style={styles.trustText}>
              Get medicines delivered to your door.
            </span>
          </div>
        </div>

        <div style={styles.trustItem}>
          <FiHeart
            size={24}
            color="#60a5fa"
          />

          <div>
            <strong style={styles.trustTitle}>
              Patient First
            </strong>

            <span style={styles.trustText}>
              Healthcare designed around you.
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <img
              src={pharmaPlusLogo}
              alt="PharmaPlus Logo"
              style={styles.footerLogo}
            />

            <div>
              <h3 style={styles.footerBrandName}>
                PharmaPlus
              </h3>

              <p style={styles.footerBrandText}>
                Your trusted healthcare partner.
              </p>
            </div>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>
              Healthcare
            </h4>

            <button
              style={styles.footerLink}
              onClick={() => navigate("doctors")}
            >
              Find Doctors
            </button>

            <button
              style={styles.footerLink}
              onClick={() => navigate("my-appointments")}
            >
              Appointments
            </button>

            <button
              style={styles.footerLink}
              onClick={() => navigate("services")}
            >
              Services
            </button>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>
              Pharmacy
            </h4>

            <button
              style={styles.footerLink}
              onClick={() => navigate("medicines")}
            >
              Medicines
            </button>

            <button
              style={styles.footerLink}
              onClick={() => navigate("pharmacies")}
            >
              Pharmacies
            </button>

            <button
              style={styles.footerLink}
              onClick={() => navigate("uploads")}
            >
              Upload Prescription
            </button>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>
              Support
            </h4>

            <span style={styles.footerStaticText}>
              Help Center
            </span>

            <span style={styles.footerStaticText}>
              Contact Us
            </span>

            <span style={styles.footerStaticText}>
              Privacy Policy
            </span>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>
            © 2026 PharmaPlus. All rights reserved.
          </span>

          <span>
            Healthcare Network
          </span>
        </div>
      </footer>
    </div>
  );
};

// =========================================================
// INLINE STYLES
// =========================================================

const styles = {
  // ================= PAGE =================

  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflowX: "hidden",
  },

  // ================= HERO =================

  heroSection: {
    minHeight: "560px",
    padding: "70px 7%",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    alignItems: "center",
    gap: "50px",
    background:
      "linear-gradient(135deg, #f8fbff 0%, #ffffff 55%, #f0fdfa 100%)",
    boxSizing: "border-box",
  },

  heroLeft: {
    maxWidth: "700px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 14px",
    borderRadius: "30px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(42px, 5vw, 64px)",
    lineHeight: 1.08,
    fontWeight: "800",
    letterSpacing: "-2px",
    color: "#0f172a",
  },

  heroTitleBlue: {
    color: "#2563eb",
  },

  heroDescription: {
    maxWidth: "600px",
    margin: "22px 0 28px",
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#64748b",
  },

  heroSearch: {
    maxWidth: "650px",
    minHeight: "58px",
    padding: "7px 7px 7px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3ed",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
    boxSizing: "border-box",
  },

  heroSearchInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "transparent",
  },

  searchButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 23px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "18px",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "13px 20px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "13px 20px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  heroTrust: {
    display: "flex",
    flexWrap: "wrap",
    gap: "22px",
    marginTop: "25px",
  },

  heroTrustItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  heroRight: {
    minHeight: "430px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCircle: {
    width: "350px",
    height: "350px",
    maxWidth: "80vw",
    maxHeight: "80vw",
    borderRadius: "50%",
    background:
      "linear-gradient(145deg, #dbeafe, #ccfbf1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 30px 70px rgba(37,99,235,0.12)",
  },

  doctorIllustration: {
    width: "245px",
    height: "245px",
    maxWidth: "70%",
    maxHeight: "70%",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.1)",
  },

  doctorImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "70% center",
    borderRadius: "50%",
    display: "block",
  },

  floatingCard: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 16px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow:
      "0 12px 30px rgba(15,23,42,0.1)",
    zIndex: 2,
  },

  floatingCardOne: {
    top: "70px",
    left: "3%",
  },

  floatingCardTwo: {
    right: "0",
    bottom: "70px",
  },

  floatingIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  floatingTitle: {
    display: "block",
    fontSize: "12px",
    color: "#0f172a",
  },

  floatingText: {
    display: "block",
    marginTop: "2px",
    color: "#64748b",
    fontSize: "10px",
  },

  // ================= COMMON =================

  section: {
    padding: "75px 7%",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "32px",
  },

  sectionLabel: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  sectionTitle: {
    margin: "7px 0 0",
    fontSize: "30px",
    lineHeight: 1.2,
    color: "#0f172a",
    fontWeight: "800",
  },

  centerHeading: {
    textAlign: "center",
    maxWidth: "750px",
    margin: "0 auto 35px",
  },

  centerDescription: {
    color: "#64748b",
    margin: "10px auto 0",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  viewAllButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ================= SERVICES =================

  serviceGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  serviceCard: {
    padding: "25px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  serviceIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "13px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    marginBottom: "18px",
    overflow: "hidden",
  },

  serviceImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "13px",
    display: "block",
  },

  serviceTitle: {
    margin: "0 0 7px",
    fontSize: "16px",
    fontWeight: "700",
  },

  serviceDescription: {
    margin: "0 0 18px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  exploreText: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "700",
  },

  // ================= SPECIALTIES =================

  specialtyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
    maxWidth: "950px",
    margin: "0 auto",
  },

  specialtyCard: {
    minHeight: "75px",
    padding: "15px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  specialtyIcon: {
    width: "43px",
    height: "43px",
    backgroundColor: "#eff6ff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  specialtyName: {
    flex: 1,
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
  },

  // ================= MEDICINES =================

  medicineGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  medicineCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },

  favoriteButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 2,
  },

  medicineImage: {
    height: "170px",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "70px",
  },

  medicineInfo: {
    padding: "16px",
  },

  medicineName: {
    margin: "0 0 5px",
    fontSize: "14px",
    fontWeight: "700",
  },

  medicineDescription: {
    margin: "0 0 8px",
    color: "#64748b",
    fontSize: "11px",
  },

  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "#475569",
    marginBottom: "12px",
  },

  ratingReviews: {
    color: "#94a3b8",
  },

  medicineBottom: {
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  medicinePrice: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#0f172a",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "none",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ================= PRESCRIPTION =================

  prescriptionSection: {
    margin: "0 7% 75px",
    borderRadius: "18px",
    padding: "45px 50px",
    background:
      "linear-gradient(120deg, #eff6ff, #ecfeff)",
    border: "1px solid #dbeafe",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "25px",
    boxSizing: "border-box",
  },

  prescriptionIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  prescriptionContent: {
    minWidth: 0,
  },

  prescriptionTitle: {
    margin: "7px 0 10px",
    fontSize: "27px",
    lineHeight: 1.2,
    fontWeight: "800",
  },

  prescriptionDescription: {
    maxWidth: "620px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
    margin: 0,
  },

  prescriptionPoints: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "15px",
  },

  prescriptionButton: {
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "13px 18px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ================= DOCTORS =================

  doctorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  doctorMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    padding: "30px 0",
    margin: 0,
  },

  doctorCard: {
    padding: "22px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
  },

  doctorTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  doctorAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
  },

  verifiedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "5px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  doctorName: {
    margin: "17px 0 5px",
    fontSize: "16px",
    fontWeight: "700",
  },

  doctorSpecialty: {
    margin: "0 0 5px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "700",
  },

  doctorExperience: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  doctorRating: {
    marginTop: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
  },

  doctorRatingText: {
    color: "#64748b",
  },

  doctorFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTop: "1px solid #f1f5f9",
    marginTop: "18px",
    paddingTop: "15px",
  },

  consultationFee: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  bookButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "8px 11px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ================= BRANCHES =================

  branchGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
  },

  branchCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    borderRadius: "13px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  branchIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "11px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  branchName: {
    margin: "0 0 5px",
    fontSize: "14px",
    fontWeight: "700",
  },

  branchLocation: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#64748b",
    fontSize: "11px",
  },

  branchCode: {
    display: "block",
    marginTop: "5px",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "700",
  },

  // ================= STEPS =================

  stepsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  stepCard: {
    position: "relative",
    padding: "24px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
  },

  stepNumber: {
    position: "absolute",
    top: "15px",
    right: "17px",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "800",
  },

  stepIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "17px",
  },

  stepTitle: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: "700",
  },

  stepDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    lineHeight: 1.6,
  },

  // ================= TRUST =================

  trustSection: {
    margin: "0 7% 60px",
    padding: "25px",
    borderRadius: "14px",
    backgroundColor: "#0f172a",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "20px",
    boxSizing: "border-box",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  trustTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
  },

  trustText: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "3px",
  },

  // ================= FOOTER =================

  footer: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "50px 7% 20px",
    boxSizing: "border-box",
  },

  footerTop: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr",
    gap: "40px",
    paddingBottom: "40px",
    borderBottom: "1px solid #1e293b",
  },

  footerBrand: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },

  footerLogo: {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    flexShrink: 0,
  },

  footerBrandName: {
    margin: 0,
    fontSize: "18px",
  },

  footerBrandText: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  footerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    alignItems: "flex-start",
  },

  footerHeading: {
    margin: "0 0 7px",
    fontSize: "13px",
    color: "#ffffff",
  },

  footerLink: {
    border: "none",
    background: "transparent",
    padding: 0,
    color: "#94a3b8",
    fontSize: "11px",
    cursor: "pointer",
  },

  footerStaticText: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  footerBottom: {
    paddingTop: "18px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    color: "#64748b",
    fontSize: "10px",
    flexWrap: "wrap",
  },
};

export default Home;