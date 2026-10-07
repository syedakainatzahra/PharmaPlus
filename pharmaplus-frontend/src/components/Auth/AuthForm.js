import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiHeart,
} from "react-icons/fi";

const AuthForm = ({ onAuthSuccess, initialMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({
    text: "",
    isError: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      text: "",
      isError: false,
    });

    const endpoint = isLogin
      ? "https://pharmaplus-production-7fa8.up.railway.app/api/v1/auth/login"
      : "https://pharmaplus-production-7fa8.up.railway.app/api/v1/auth/signup";

    // Role is NOT sent from frontend.
    // Backend decides signup role = CUSTOMER.
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      // ================================
      // LOGIN SUCCESS
      // ================================
      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage({
          text: "Login successful! Welcome back.",
          isError: false,
        });

        console.log("Logged in user:", data.user);
        console.log("User role:", data.user.role);

        if (onAuthSuccess) {
          onAuthSuccess(data.user.role);
        }
      }

      // ================================
      // SIGNUP SUCCESS
      // ================================
      else {
        setMessage({
          text:
            data.message ||
            "Account created successfully! Please login.",
          isError: false,
        });

        setFormData({
          fullName: "",
          email: "",
          password: "",
        });

        setShowPassword(false);

        // Switch to login
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Authentication Error:", err);

      setMessage({
        text: err.message,
        isError: true,
      });
    }
  };

  const switchMode = (mode) => {
    setIsLogin(mode === "login");

    setMessage({
      text: "",
      isError: false,
    });

    setFormData({
      fullName: "",
      email: "",
      password: "",
    });

    setShowPassword(false);
  };

  return (
    <div style={styles.container}>

      {/* ================= LEFT SIDE ================= */}
      <div style={styles.brandSection}>

        <div style={styles.brandContent}>

          {/* Logo */}
          <div style={styles.logoWrapper}>
            <div style={styles.logo}>
              +
            </div>

            <div>
              <div style={styles.logoText}>
                Pharma<span>Plus</span>
              </div>

              <div style={styles.logoSubtitle}>
                HEALTHCARE NETWORK
              </div>
            </div>
          </div>

          <h1 style={styles.heroTitle}>
            Your Health,
            <br />
            <span>Our Priority.</span>
          </h1>

          <p style={styles.heroText}>
            Access trusted healthcare services, medicines,
            doctors and pharmacy services — all in one place.
          </p>

          <div style={styles.featureList}>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                <FiShield size={18} />
              </div>

              <div>
                <strong style={styles.featureTitle}>
                  Trusted Healthcare
                </strong>

                <p style={styles.featureText}>
                  Safe and reliable healthcare services.
                </p>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                <FiHeart size={18} />
              </div>

              <div>
                <strong style={styles.featureTitle}>
                  Care That Matters
                </strong>

                <p style={styles.featureText}>
                  Healthcare designed around your needs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div style={styles.formSection}>

        <div style={styles.card}>

          {/* Mobile Logo */}
          <div style={styles.mobileBrand}>
            <div style={styles.mobileLogo}>
              +
            </div>

            <div style={styles.mobileBrandText}>
              Pharma<span>Plus</span>
            </div>
          </div>

          {/* Header */}
          <div style={styles.header}>

            <h2 style={styles.title}>
              {isLogin
                ? "Welcome Back!"
                : "Create Your Account"}
            </h2>

            <p style={styles.subtitle}>
              {isLogin
                ? "Sign in to continue to PharmaPlus"
                : "Join PharmaPlus for better healthcare"}
            </p>

          </div>

          {/* ================= ALERT ================= */}
          {message.text && (
            <div
              style={{
                ...styles.alert,
                ...(message.isError
                  ? styles.alertError
                  : styles.alertSuccess),
              }}
            >
              <span style={styles.alertIcon}>
                {message.isError ? "!" : "✓"}
              </span>

              <span>{message.text}</span>
            </div>
          )}

          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            {!isLogin && (
              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Full Name
                </label>

                <div style={styles.inputWrapper}>

                  <FiUser
                    size={18}
                    style={styles.inputIcon}
                  />

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />

                </div>
              </div>
            )}

            {/* EMAIL */}
            <div style={styles.formGroup}>

              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <FiMail
                  size={18}
                  style={styles.inputIcon}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div style={styles.formGroup}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>

                <FiLock
                  size={18}
                  style={styles.inputIcon}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.passwordInput}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* LOGIN EXTRA */}
            {isLogin && (
              <div style={styles.loginOptions}>

                <label style={styles.remember}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                  />

                  <span>Remember me</span>
                </label>

                <span style={styles.forgot}>
                  Forgot password?
                </span>

              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              style={styles.button}
            >
              <span>
                {isLogin
                  ? "Sign In"
                  : "Create Account"}
              </span>

              <FiArrowRight size={19} />
            </button>

          </form>

          {/* ================= DIVIDER ================= */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>

            <span style={styles.dividerText}>
              {isLogin
                ? "New to PharmaPlus?"
                : "Already a member?"}
            </span>

            <div style={styles.dividerLine}></div>
          </div>

          {/* ================= SWITCH ================= */}
          <button
            type="button"
            style={styles.switchButton}
            onClick={() =>
              switchMode(isLogin ? "signup" : "login")
            }
          >
            {isLogin
              ? "Create a new account"
              : "Sign in to your account"}
          </button>

          {/* Footer */}
          <p style={styles.footerText}>
            By continuing, you agree to our
            <span style={styles.footerLink}>
              {" "}Terms & Privacy Policy
            </span>
          </p>

        </div>

      </div>
    </div>
  );
};

const styles = {
  /* ================= MAIN ================= */

  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    background:
      "linear-gradient(135deg, #0f4c81 0%, #2563eb 45%, #0f766e 100%)",
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box",
  },

  /* ================= LEFT BRAND ================= */

  brandSection: {
    width: "48%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px",
    boxSizing: "border-box",
    color: "#ffffff",
  },

  brandContent: {
    maxWidth: "500px",
    width: "100%",
  },

  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "65px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    fontWeight: "700",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.15)",
  },

  logoText: {
    fontSize: "27px",
    fontWeight: "800",
    lineHeight: "28px",
    letterSpacing: "-0.5px",
  },

  logoSubtitle: {
    fontSize: "8px",
    letterSpacing: "3px",
    opacity: 0.75,
    marginTop: "4px",
  },

  heroTitle: {
    fontSize: "50px",
    lineHeight: "1.12",
    margin: "0 0 20px",
    fontWeight: "800",
    letterSpacing: "-1.5px",
  },

  heroTitleSpan: {
    color: "#ffffff",
  },

  heroText: {
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "450px",
    opacity: 0.88,
    marginBottom: "40px",
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  featureIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.15)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  featureTitle: {
    fontSize: "14px",
    display: "block",
    marginBottom: "3px",
  },

  featureText: {
    margin: 0,
    fontSize: "12px",
    opacity: 0.75,
  },

  /* ================= FORM SECTION ================= */

  formSection: {
    width: "52%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "35px",
    boxSizing: "border-box",
    background:
      "rgba(255,255,255,0.10)",
  },

  card: {
    width: "100%",
    maxWidth: "470px",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: "24px",
    padding: "38px 42px",
    boxSizing: "border-box",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.22)",
    border:
      "1px solid rgba(255,255,255,0.7)",
  },

  /* ================= MOBILE BRAND ================= */

  mobileBrand: {
    display: "none",
  },

  mobileLogo: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    fontWeight: "700",
  },

  mobileBrandText: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1e293b",
  },

  /* ================= HEADER ================= */

  header: {
    marginBottom: "26px",
  },

  title: {
    margin: 0,
    color: "#172554",
    fontSize: "28px",
    fontWeight: "750",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  /* ================= ALERT ================= */

  alert: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 13px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "500",
  },

  alertIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "12px",
    fontWeight: "700",
  },

  alertSuccess: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
  },

  alertError: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },

  /* ================= FORM ================= */

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "650",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 14px 0 43px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "11px",
    fontSize: "14px",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    outline: "none",
  },

  passwordInput: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 45px 0 43px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "11px",
    fontSize: "14px",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    outline: "none",
  },

  eyeButton: {
    position: "absolute",
    right: "5px",
    width: "38px",
    height: "38px",
    border: "none",
    backgroundColor: "transparent",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "8px",
  },

  /* ================= LOGIN OPTIONS ================= */

  loginOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "-4px",
    marginBottom: "20px",
    fontSize: "12px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    cursor: "pointer",
  },

  checkbox: {
    accentColor: "#2563eb",
    cursor: "pointer",
  },

  forgot: {
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ================= BUTTON ================= */

  button: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #2563eb, #0f766e)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)",
  },

  /* ================= DIVIDER ================= */

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "27px 0 18px",
  },

  dividerLine: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    flex: 1,
  },

  dividerText: {
    color: "#94a3b8",
    fontSize: "11px",
    whiteSpace: "nowrap",
  },

  /* ================= SWITCH ================= */

  switchButton: {
    width: "100%",
    height: "45px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #bfdbfe",
    color: "#2563eb",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "650",
    cursor: "pointer",
  },

  /* ================= FOOTER ================= */

  footerText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "1.5",
    margin: "20px 0 0",
  },

  footerLink: {
    color: "#64748b",
    fontWeight: "600",
  },
};

export default AuthForm;