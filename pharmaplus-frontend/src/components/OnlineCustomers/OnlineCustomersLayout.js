import React, { useState } from "react";

import Navbar from "./Navbar";
import Home from "./Home";
import Orders from "./Orders";
import Recived from "./Recived";
import Cart from "./Cart";
import BookAppointment from "./BookAppointment";
import MyAppointments from "./MyAppointments";
import Products from "./Products";
import { Profile, Uploads } from "./Profile";
import Medicines from "./Medicines";
import Pharmacies from "./Pharmacies";
import Doctors from "./Doctors";
import Services from "./Services";

import AuthForm from "../Auth/AuthForm";

const OnlineCustomersLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  // --------------------------------------------------
  // LOGIN / SIGNUP SUCCESS
  // --------------------------------------------------
  const handleAuthSuccess = (userRole) => {
    localStorage.setItem("role", userRole);

    setActiveTab("home");

    window.location.reload();
  };

  // --------------------------------------------------
  // RENDER ACTIVE PAGE
  // --------------------------------------------------
  const renderContent = () => {
    switch (activeTab) {

      // ------------------------------------------------
      // HOME
      // ------------------------------------------------
      case "home":
        return (
          <Home
            setActiveTab={setActiveTab}
            setCartCount={setCartCount}
          />
        );
case "services":
  return (
    <Services
      setActiveTab={setActiveTab}
    />
  );
      // ------------------------------------------------
      // PRODUCTS
      // ------------------------------------------------
      case "products":
        return (
          <Products
            setActiveTab={setActiveTab}
            setCartCount={setCartCount}
          />
        );

      // ------------------------------------------------
      // FIND DOCTORS
      // ------------------------------------------------
      case "doctors":
        return (
          <Doctors
            setActiveTab={(tab) => {
              if (tab === "appointments") {
                const doctorId =
                  sessionStorage.getItem(
                    "selectedDoctorId"
                  );

                setSelectedDoctorId(
                  doctorId || ""
                );
              }

              setActiveTab(tab);
            }}
          />
        );

      // ------------------------------------------------
      // PHARMACIES
      // ------------------------------------------------
      case "pharmacies":
        return <Pharmacies />;

      // ------------------------------------------------
      // MEDICINES
      // ------------------------------------------------
      case "medicines":
        return (
          <Medicines
            setActiveTab={setActiveTab}
            setCartCount={setCartCount}
          />
        );

      // ------------------------------------------------
      // CART
      // ------------------------------------------------
      case "cart":
        return (
          <Cart
            setActiveTab={setActiveTab}
            setCartCount={setCartCount}
          />
        );

      // ------------------------------------------------
      // ORDERS
      // ------------------------------------------------
      case "ordered":
        return <Orders />;

      // ------------------------------------------------
      // RECEIVED
      // ------------------------------------------------
      case "received":
        return <Recived />;

      // ------------------------------------------------
      // PRESCRIPTION UPLOADS
      // ------------------------------------------------
      case "uploads":
        return <Uploads />;

      // ------------------------------------------------
      // PROFILE
      // ------------------------------------------------
      case "profile":
        return (
          <Profile
            onLogout={onLogout}
            setActiveTab={setActiveTab}
          />
        );

      // ------------------------------------------------
      // LOGIN
      // ------------------------------------------------
      case "login":
        return (
          <AuthForm
            onAuthSuccess={handleAuthSuccess}
            initialMode="login"
          />
        );

      // ------------------------------------------------
      // SIGNUP
      // ------------------------------------------------
      case "signup":
        return (
          <AuthForm
            onAuthSuccess={handleAuthSuccess}
            initialMode="signup"
          />
        );

      // ------------------------------------------------
      // BOOK APPOINTMENT
      // ------------------------------------------------
      case "appointments":
        return (
          <BookAppointment
            setActiveTab={setActiveTab}
            selectedDoctorId={selectedDoctorId}
          />
        );

      // ------------------------------------------------
      // MY APPOINTMENTS
      // ------------------------------------------------
      case "my-appointments":
        return (
          <MyAppointments
            setActiveTab={setActiveTab}
          />
        );

      // ------------------------------------------------
      // DEFAULT
      // ------------------------------------------------
      default:
        return (
          <Home
            setActiveTab={setActiveTab}
            setCartCount={setCartCount}
          />
        );
    }
  };

  return (
    <div style={styles.layout}>

      {/* ================================
          PUBLIC NAVBAR
      ================================= */}
      <Navbar
        cartCount={cartCount}
        setActiveTab={setActiveTab}
      />

      {/* ================================
          PAGE CONTENT
      ================================= */}
      <main style={styles.content}>
        {renderContent()}
      </main>

    </div>
  );
};

// ==================================================
// STYLES
// ==================================================

const styles = {
  layout: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f8fafc",
    margin: 0,
    padding: 0,
  },

  content: {
    width: "100%",
    margin: 0,
    padding: 0,
  },
};

export default OnlineCustomersLayout;