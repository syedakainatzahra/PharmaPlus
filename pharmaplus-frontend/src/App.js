import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DoctorDashboard from "./components/Doctors/DoctorDashboard";
import PatientDashboard from "./components/Patients/PatientDashboard";
import AuthForm from "./components/Auth/AuthForm";

import BranchManager from "./components/BranchManager/BranchManager";
import StaffDirectory from "./components/BranchManager/StaffDirectory";
import OnlineCustomers from "./components/BranchManager/OnlineCustomers";
import DoctorPage from "./components/BranchManager/DoctorPage";
import InventoryPage from "./components/BranchManager/InventoryPage";
import RevenuePage from "./components/BranchManager/RevenuePage";
import Settings from "./components/BranchManager/Settings";

import WarehouseManager from "./components/WarehouseManager/WarehouseManager";

import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";

import PharmacistDashboard from "./components/Pharmacists/PharmacistDashboard";

import MainDashboard from "./components/Receptionist/MainDashboard";
import Appointments from "./components/Receptionist/Appointments";
import BillingCounter from "./components/Receptionist/BillingCounter";
import PatientQueue from "./components/Receptionist/PatientQueue";

import OnlineCustomersLayout from "./components/OnlineCustomers/OnlineCustomersLayout";

function App() {
  const [role, setRole] = useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setRole("");
  };

  // ==========================================
  // CHECK SAVED LOGIN
  // ==========================================

  useEffect(() => {
    const savedRole = localStorage.getItem("role");

    if (savedRole) {
      setRole(savedRole);
    }

    const handleStorageChange = () => {
      const currentRole = localStorage.getItem("role");

      if (currentRole) {
        setRole(currentRole);
      } else {
        setRole("");
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ==========================================
  // AFTER LOGIN
  // ==========================================

  const handleAuthSuccess = (userRole) => {
    setRole(userRole);
  };

  return (
    <div style={styles.appContainer}>

      {/* ======================================
          TOAST
      ====================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div style={styles.contentContainer}>

        <Routes>

          {/* ==================================================
              PUBLIC WEBSITE
              ==================================================

              Jab user login nahi hai:

              role = ""

              To Login page ke bajaye
              OnlineCustomersLayout open hoga.

              Iske andar:
              Navbar
              Home
              Public healthcare content
          ================================================== */}

          {!role && (
            <Route
              path="*"
              element={
                <OnlineCustomersLayout
                  onLogout={handleLogout}
                />
              }
            />
          )}


          {/* ==================================================
              DOCTOR
          ================================================== */}

          {role === "DOCTOR" && (
            <Route
              path="*"
              element={<DoctorDashboard />}
            />
          )}


          {/* ==================================================
              PHARMACIST
          ================================================== */}

          {(role === "PHARMACIST" ||
            role === "PHARMACY_ADMIN") && (
            <Route
              path="*"
              element={<PharmacistDashboard />}
            />
          )}


          {/* ==================================================
              WAREHOUSE MANAGER
          ================================================== */}

          {role === "WAREHOUSE_MANAGER" && (
            <Route
              path="*"
              element={<WarehouseManager />}
            />
          )}


          {/* ==================================================
              PATIENT
          ================================================== */}

          {role === "PATIENT" && (
            <Route
              path="*"
              element={<PatientDashboard />}
            />
          )}


          {/* ==================================================
              SUPER ADMIN
          ================================================== */}

          {role === "SUPER_ADMIN" && (
            <Route
              path="*"
              element={<SuperAdminDashboard />}
            />
          )}


          {/* ==================================================
              BRANCH MANAGER / ADMIN
          ================================================== */}

          {(role === "ADMIN" ||
            role === "BRANCH_MANAGER") && (

            <Route
              path="/*"
              element={
                <BranchManager
                  onLogout={handleLogout}
                />
              }
            >

              <Route
                path="staff"
                element={<StaffDirectory />}
              />

              <Route
                path="doctor"
                element={<DoctorPage />}
              />

              <Route
                path="inventory"
                element={<InventoryPage />}
              />

              <Route
                path="customers"
                element={<OnlineCustomers />}
              />

              <Route
                path="revenue"
                element={<RevenuePage />}
              />

              <Route
                path="settings"
                element={<Settings />}
              />

            </Route>
          )}


          {/* ==================================================
              RECEPTIONIST
          ================================================== */}

          {(role === "ADMIN" ||
            role === "RECEPTIONIST") && (

            <>
              <Route
                path="/*"
                element={
                  <MainDashboard
                    onLogout={handleLogout}
                  />
                }
              />

              <Route
                path="appointments"
                element={<Appointments />}
              />

              <Route
                path="billing"
                element={<BillingCounter />}
              />

              <Route
                path="settings"
                element={<Settings />}
              />

              <Route
                path="patientQueue"
                element={<PatientQueue />}
              />
            </>
          )}


          {/* ==================================================
              LOGGED-IN CUSTOMER
          ================================================== */}

          {(role === "CUSTOMER" ||
            role === "customer") && (

            <Route
              path="*"
              element={
                <OnlineCustomersLayout
                  onLogout={handleLogout}
                />
              }
            />
          )}

        </Routes>

      </div>
    </div>
  );
}


// ==========================================================
// STYLES
// ==========================================================

const styles = {
  appContainer: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    width: "100%",
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
  },

  contentContainer: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
};

export default App;