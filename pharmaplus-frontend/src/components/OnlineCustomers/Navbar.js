import React, { useState } from "react";
import {
  FiHome,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiCalendar,
  FiMapPin,
  FiHeart,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiLogOut,
   FiFileText,
} from "react-icons/fi";

import pharmaPlusLogo from "../../assets/pharma-plus-logo.png";

const Navbar = ({ cartCount = 0, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Get logged-in user from localStorage
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn = !!localStorage.getItem("token");
  const getProfileImage = () => {
  if (!user?.profileImage) {
    return null;
  }

  if (user.profileImage.startsWith("http")) {
    return user.profileImage;
  }

  return `http://localhost:5000${user.profileImage}`;
};

  // ================================
  // NAVIGATION
  // ================================
  const goTo = (tab) => {
    setActiveTab(tab);

    setMobileMenuOpen(false);
    setProfileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setProfileOpen(false);
    setMobileMenuOpen(false);

    window.location.reload();
  };

  return (
    <>
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav style={styles.navbar}>

        {/* ================= LOGO ================= */}

        <div
          style={styles.logoContainer}
          onClick={() => goTo("home")}
        >
          <img
            src={pharmaPlusLogo}
            alt="Pharma Plus"
            style={styles.logoImage}
          />
        </div>

        {/* ================= DESKTOP NAV ================= */}

        <div style={styles.desktopNav}>

          {/* HOME */}
          <button
            style={styles.navItem}
            onClick={() => goTo("home")}
          >
            <FiHome size={17} />
            <span>Home</span>
          </button>

          {/* DOCTORS */}
          <button
            style={styles.navItem}
            onClick={() => goTo("doctors")}
          >
            <FiUser size={17} />
            <span>Find Doctors</span>
          </button>

          {/* MEDICINES */}
          <button
            style={styles.navItem}
            onClick={() => goTo("medicines")}
          >
            <FiHeart size={17} />
            <span>Medicines</span>
          </button>

          {/* PHARMACIES */}
          <button
            style={styles.navItem}
            onClick={() => goTo("pharmacies")}
          >
            <FiMapPin size={17} />
            <span>Pharmacies</span>
          </button>

          {/* SERVICES */}
          <button
            style={styles.navItem}
            onClick={() => goTo("services")}
          >
            <FiHeart size={17} />
            <span>Services</span>
          </button>

          {/* APPOINTMENTS */}
          <button
            style={styles.navItem}
            onClick={() => goTo("appointments")}
          >
            <FiCalendar size={17} />
            <span>Appointments</span>
          </button>

          {/* ================= CART ================= */}

          <button
            style={styles.cartButton}
            onClick={() => goTo("cart")}
          >
            <FiShoppingCart size={19} />

            {cartCount > 0 && (
              <span style={styles.cartBadge}>
                {cartCount}
              </span>
            )}
          </button>

          {/* ================================================= */}
          {/* AUTH / PROFILE */}
          {/* ================================================= */}

          {!isLoggedIn ? (
            <>
              {/* LOGIN */}

              <button
                style={styles.loginButton}
                onClick={() => goTo("login")}
              >
                <FiLogIn size={17} />
                Login
              </button>

              {/* SIGN UP */}

              <button
                style={styles.signupButton}
                onClick={() => goTo("signup")}
              >
                <FiUserPlus size={17} />
                Sign Up
              </button>
            </>
          ) : (
            /* ================= PROFILE ================= */

            <div style={styles.profileContainer}>

              <button
                style={styles.profileButton}
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <div style={styles.profileIcon}>
  {getProfileImage() ? (
    <img
      src={getProfileImage()}
      alt="Profile"
      style={styles.profileIconImage}
    />
  ) : (
    <FiUser size={18} />
  )}
</div>
                <span style={styles.profileName}>
                  {user?.fullName || "My Account"}
                </span>

                <FiChevronDown
                  size={15}
                  style={{
                    transform: profileOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s ease",
                  }}
                />

              </button>

              {/* ================= PROFILE DROPDOWN ================= */}

              {profileOpen && (
                <div style={styles.profileDropdown}>

                  {/* MY PROFILE */}

                  <button
                    style={styles.dropdownItem}
                    onClick={() => goTo("profile")}
                  >
                    <FiUser size={17} />
                    <span>My Profile</span>
                  </button>

                  {/* MY ORDERS */}

                  <button
                    style={styles.dropdownItem}
                    onClick={() => goTo("ordered")}
                  >
                    <FiShoppingCart size={17} />
                    <span>My Orders</span>
                  </button>

                  {/* MY APPOINTMENTS */}

                  <button
                    style={styles.dropdownItem}
                    onClick={() => goTo("my-appointments")}
                  >
                    <FiCalendar size={17} />
                    <span>My Appointments</span>
                  </button>
<button
  onClick={() => {
    setActiveTab("uploads");
  }}
  style={styles.dropdownItem}
>
  <FiFileText />
  My Prescriptions
</button>
                  {/* DIVIDER */}

                  <div
                    style={styles.dropdownDivider}
                  />

                  {/* LOGOUT */}

                  <button
                    style={styles.logoutItem}
                    onClick={handleLogout}
                  >
                    <FiLogOut size={17} />
                    <span>Logout</span>
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          style={styles.mobileMenuButton}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
        >
          {mobileMenuOpen ? (
            <FiX size={25} />
          ) : (
            <FiMenu size={25} />
          )}
        </button>

      </nav>

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>

          {/* HOME */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("home")}
          >
            <FiHome size={18} />
            <span>Home</span>
          </button>

          {/* DOCTORS */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("doctors")}
          >
            <FiUser size={18} />
            <span>Find Doctors</span>
          </button>

          {/* MEDICINES */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("medicines")}
          >
            <FiHeart size={18} />
            <span>Medicines</span>
          </button>

          {/* PHARMACIES */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("pharmacies")}
          >
            <FiMapPin size={18} />
            <span>Pharmacies</span>
          </button>

          {/* SERVICES */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("services")}
          >
            <FiHeart size={18} />
            <span>Services</span>
          </button>

          {/* APPOINTMENTS */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("appointments")}
          >
            <FiCalendar size={18} />
            <span>Appointments</span>
          </button>

          {/* CART */}

          <button
            style={styles.mobileItem}
            onClick={() => goTo("cart")}
          >
            <FiShoppingCart size={18} />

            <span>Cart</span>

            {cartCount > 0 && (
              <span style={styles.mobileBadge}>
                {cartCount}
              </span>
            )}
          </button>

          {/* ================================================= */}
          {/* MOBILE AUTH */}
          {/* ================================================= */}

          {!isLoggedIn ? (
            <>
              <div
                style={styles.mobileDivider}
              />

              {/* LOGIN */}

              <button
                style={styles.mobileLogin}
                onClick={() => goTo("login")}
              >
                <FiLogIn size={17} />
                Login
              </button>

              {/* SIGNUP */}

              <button
                style={styles.mobileSignup}
                onClick={() => goTo("signup")}
              >
                <FiUserPlus size={17} />
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div
                style={styles.mobileDivider}
              />

              {/* MOBILE PROFILE */}

              <button
                style={styles.mobileProfile}
                onClick={() => goTo("profile")}
              >
                <div style={styles.mobileProfileIcon}>
  {getProfileImage() ? (
    <img
      src={getProfileImage()}
      alt="Profile"
      style={styles.mobileProfileIconImage}
    />
  ) : (
    <FiUser size={17} />
  )}
</div>

                <span>
                  {user?.fullName || "My Profile"}
                </span>
              </button>

              {/* MOBILE ORDERS */}

              <button
                style={styles.mobileItem}
                onClick={() => goTo("ordered")}
              >
                <FiShoppingCart size={18} />
                <span>My Orders</span>
              </button>

              {/* MOBILE APPOINTMENTS */}

              <button
                style={styles.mobileItem}
                onClick={() => goTo("my-appointments")}
              >
                <FiCalendar size={18} />
                <span>My Appointments</span>
              </button>
              <button
  onClick={() => {
    setActiveTab("uploads");
   
  }}
  style={styles.dropdownItem}
>
  <FiFileText />
  My Prescriptions
</button>
              {/* MOBILE LOGOUT */}

              <button
                style={styles.mobileLogout}
                onClick={handleLogout}
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}

        </div>
      )}
    </>
  );
};

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = {

  /* ================= NAVBAR ================= */

  navbar: {
    width: "100%",
    height: "72px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.04)",
  },

  /* ================= LOGO ================= */

  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    flexShrink: 0,
  },

  logoImage: {
    width: "145px",
    height: "58px",
    objectFit: "contain",
    display: "block",
  },

  /* ================= DESKTOP NAV ================= */

  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  navItem: {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 10px",
    borderRadius: "8px",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s ease",
  },

  /* ================= CART ================= */

  cartButton: {
    position: "relative",
    border: "none",
    backgroundColor: "#f1f5f9",
    width: "40px",
    height: "40px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#334155",
    cursor: "pointer",
    marginLeft: "5px",
  },

  cartBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
    boxSizing: "border-box",
  },

  /* ================= LOGIN ================= */

  loginButton: {
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    borderRadius: "8px",
    padding: "9px 14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "8px",
  },

  /* ================= SIGNUP ================= */

  signupButton: {
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "9px 14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ================= PROFILE ================= */

  profileContainer: {
    position: "relative",
    marginLeft: "8px",
  },

  profileButton: {
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "5px 10px 5px 5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#334155",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    minHeight: "42px",
  },

  profileIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #2563eb, #0f766e)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileIconImage: {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
},

  profileName: {
    maxWidth: "105px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  /* ================= PROFILE DROPDOWN ================= */

  profileDropdown: {
    position: "absolute",
    top: "50px",
    right: 0,
    width: "195px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "7px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.12)",
    zIndex: 1100,
  },

  dropdownItem: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    padding: "11px 10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#334155",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
  },

  dropdownDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "5px 0",
  },

  logoutItem: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    padding: "11px 10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },

  /* ================= MOBILE BUTTON ================= */

  mobileMenuButton: {
    display: "none",
    border: "none",
    background: "transparent",
    color: "#334155",
    cursor: "pointer",
  },

  /* ================= MOBILE MENU ================= */

  mobileMenu: {
    position: "fixed",
    top: "72px",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
    padding: "15px",
    zIndex: 999,
    boxSizing: "border-box",
  },

  mobileItem: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 10px",
    color: "#334155",
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
  },

  mobileDivider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "8px 0",
  },

  mobileLogin: {
    width: "100%",
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "8px",
  },

  mobileSignup: {
    width: "100%",
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ================= MOBILE PROFILE ================= */

  mobileProfile: {
    width: "100%",
    border: "none",
    backgroundColor: "#f8fafc",
    borderRadius: "9px",
    padding: "11px 10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },

  mobileProfileIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #2563eb, #0f766e)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
    mobileProfileIconImage: {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
},
  mobileLogout: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 10px",
    color: "#dc2626",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },

  mobileBadge: {
    marginLeft: "auto",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "2px 7px",
    fontSize: "11px",
    fontWeight: "700",
  },
};

export default Navbar;