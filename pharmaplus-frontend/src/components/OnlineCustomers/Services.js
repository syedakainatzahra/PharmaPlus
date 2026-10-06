import React from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiShoppingBag,
  FiCalendar,
  FiVideo,
  FiTruck,
  FiMapPin,
  FiActivity,
  FiHeart,
} from "react-icons/fi";

const Services = ({ setActiveTab }) => {
  const services = [
    {
      id: "medicine",
      icon: <FiShoppingBag size={28} />,
      title: "Medicine Ordering",
      description:
        "Browse medicines and health products and place your order online.",
      action: "Browse Medicines",
      tab: "medicines",
    },
    {
      id: "prescription",
      icon: <FiFileText size={28} />,
      title: "Prescription Upload",
      description:
        "Upload your prescription securely and get help with your medicine order.",
      action: "Upload Prescription",
      tab: "uploads",
    },
    {
      id: "appointment",
      icon: <FiCalendar size={28} />,
      title: "Doctor Appointments",
      description:
        "Find available doctors and request an appointment at a PharmaPlus branch.",
      action: "Find Doctors",
      tab: "doctors",
    },
    {
      id: "online",
      icon: <FiVideo size={28} />,
      title: "Online Consultation",
      description:
        "Request an online consultation with an available PharmaPlus doctor.",
      action: "Book Consultation",
      tab: "appointments",
    },
    {
      id: "delivery",
      icon: <FiTruck size={28} />,
      title: "Medicine Delivery",
      description:
        "Order medicines online and get them delivered to your selected address.",
      action: "Order Medicines",
      tab: "medicines",
    },
    {
      id: "pharmacy",
      icon: <FiMapPin size={28} />,
      title: "Find a Pharmacy",
      description:
        "Find active PharmaPlus branches and view their locations.",
      action: "Find Pharmacies",
      tab: "pharmacies",
    },
    {
      id: "health",
      icon: <FiActivity size={28} />,
      title: "Health Services",
      description:
        "Explore healthcare services available through the PharmaPlus network.",
      action: "Explore Services",
      tab: "home",
    },
    {
      id: "care",
      icon: <FiHeart size={28} />,
      title: "Healthcare Support",
      description:
        "Connect with PharmaPlus services for your medicine and healthcare needs.",
      action: "Get Started",
      tab: "home",
    },
  ];

  const handleServiceClick = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>

        <button
          type="button"
          onClick={() => setActiveTab("home")}
          style={styles.backButton}
        >
          <FiArrowLeft size={17} />
          Back
        </button>

        <div>
          <h1 style={styles.title}>
            Our Services
          </h1>

          <p style={styles.subtitle}>
            Simple healthcare services designed to make
            your everyday healthcare easier.
          </p>
        </div>

      </div>

      {/* Hero */}
      <div style={styles.hero}>

        <div style={styles.heroIcon}>
          <FiHeart size={30} />
        </div>

        <div>
          <h2 style={styles.heroTitle}>
            Healthcare made easier
          </h2>

          <p style={styles.heroText}>
            From ordering medicines to finding doctors
            and uploading prescriptions, PharmaPlus
            brings essential healthcare services together
            in one place.
          </p>
        </div>

      </div>

      {/* Services */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            What can we help you with?
          </h2>

          <p style={styles.sectionSubtitle}>
            Choose a service to get started.
          </p>
        </div>

        <div style={styles.grid}>

          {services.map((service) => (
            <div
              key={service.id}
              style={styles.card}
            >

              {/* Icon */}
              <div style={styles.iconWrapper}>
                {service.icon}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>

                <h3 style={styles.cardTitle}>
                  {service.title}
                </h3>

                <p style={styles.cardDescription}>
                  {service.description}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleServiceClick(service.tab)
                  }
                  style={styles.actionButton}
                >
                  {service.action}
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Bottom CTA */}
      <div style={styles.cta}>

        <div style={styles.ctaIcon}>
          <FiHeart size={25} />
        </div>

        <div style={styles.ctaContent}>
          <h3 style={styles.ctaTitle}>
            Need healthcare assistance?
          </h3>

          <p style={styles.ctaText}>
            Explore our doctors, medicines and
            healthcare services to get started.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("doctors")}
          style={styles.ctaButton}
        >
          Find a Doctor
        </button>

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
    maxWidth: "1180px",
    margin: "0 auto 26px",
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
    padding: 0,
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

  hero: {
    maxWidth: "1180px",
    margin: "0 auto 35px",
    padding: "24px",
    backgroundColor: "#eff6ff",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxSizing: "border-box",
  },

  heroIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroTitle: {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "20px",
    fontWeight: "800",
  },

  heroText: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.6",
    maxWidth: "800px",
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  sectionHeader: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "18px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxSizing: "border-box",
    boxShadow:
      "0 3px 12px rgba(15, 23, 42, 0.035)",
  },

  iconWrapper: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "800",
  },

  cardDescription: {
    margin: "8px 0 18px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.6",
    flex: 1,
  },

  actionButton: {
    width: "100%",
    height: "40px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  cta: {
    maxWidth: "1180px",
    margin: "35px auto 0",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxSizing: "border-box",
  },

  ctaIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#ecfdf5",
    color: "#059669",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  ctaContent: {
    flex: 1,
  },

  ctaTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "800",
  },

  ctaText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  ctaButton: {
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: "11px 18px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default Services;