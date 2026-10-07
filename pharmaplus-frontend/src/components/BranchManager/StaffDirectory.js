import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FiSearch } from "react-icons/fi";

function StaffDirectory() {
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // =========================
  // FETCH BRANCH STAFF
  // =========================
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://pharmaplus-production-7fa8.up.railway.app/api/v1/branch-managers/staff",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch staff");
        }

        const formattedStaff = (data.staff || []).map((member, index) => ({
          id:
            member.employeeId ||
            `STAFF-${String(index + 1).padStart(3, "0")}`,

          name:
            member.fullName?.trim() ||
            member.email?.split("@")[0] ||
            "Unknown Staff",

          role: formatRole(member.role),

          department: getDepartment(member.role),

          phone: member.phone || "—",

          email: member.email || "—",

          shift: "—",

          today: "—",

          attendance: "—",

          status: formatAccountStatus(member.status),

          avatarColor: getAvatarColor(index),
        }));

        setStaffMembers(formattedStaff);
      } catch (error) {
        console.error("Staff fetch error:", error);
        setStaffMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // =========================
  // ROLE FORMATTER
  // =========================
  const formatRole = (role) => {
    if (!role) return "Staff";

    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // =========================
  // DEPARTMENT
  // =========================
  const getDepartment = (role) => {
    switch (role) {
      case "DOCTOR":
        return "Medical";

      case "PHARMACIST":
        return "Pharmacy";

      case "RECEPTIONIST":
        return "Front Desk";

      case "BRANCH_MANAGER":
        return "Management";

      case "DELIVERY_RIDER":
        return "Delivery";

      case "WAREHOUSE_MANAGER":
      case "WAREHOUSE_EMPLOYEE":
        return "Warehouse";

      case "SECURITY_GUARD":
        return "Security";

      default:
        return "General";
    }
  };

  // =========================
  // ACCOUNT STATUS
  // =========================
  const formatAccountStatus = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Active";

      case "INACTIVE":
        return "Inactive";

      case "ON_LEAVE":
        return "On Leave";

      case "SUSPENDED":
        return "Inactive";

      case "PENDING":
        return "Inactive";

      case "REJECTED":
        return "Inactive";

      default:
        return "Inactive";
    }
  };

  // =========================
  // AVATAR COLORS
  // =========================
  const getAvatarColor = (index) => {
    const colors = [
      "#dbeafe",
      "#dcfce7",
      "#fef3c7",
      "#fce7f3",
      "#ede9fe",
      "#cffafe",
    ];

    return colors[index % colors.length];
  };

  // =========================
  // FILTER STAFF
  // =========================
  const filteredStaff = staffMembers.filter((member) => {
    const search = searchFilter.toLowerCase();

    const matchesSearch =
      (member.name || "Unknown Staff").toLowerCase().includes(search) ||
      (member.role || "Staff").toLowerCase().includes(search) ||
      (member.id || "").toLowerCase().includes(search) ||
      (member.email || "").toLowerCase().includes(search);

    if (activeTab === "active") {
      return matchesSearch && member.status === "Active";
    }

    if (activeTab === "inactive") {
      return matchesSearch && member.status === "Inactive";
    }

    if (activeTab === "leave") {
      return matchesSearch && member.status === "On Leave";
    }

    return matchesSearch;
  });

  // =========================
  // COUNTS
  // =========================
  const totalStaff = staffMembers.length;

  const activeStaff = staffMembers.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveStaff = staffMembers.filter(
    (member) => member.status === "Inactive"
  ).length;

  const leaveStaff = staffMembers.filter(
    (member) => member.status === "On Leave"
  ).length;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <Sidebar />

        <div style={{ flex: 1 }}>
          <Navbar />

          <div
            style={{
              padding: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Loading staff directory...
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Navbar />

        <main
          style={{
            padding: "28px 32px",
          }}
        >
          {/* =========================
              HEADER
          ========================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Staff Directory
              </h1>

              <p
                style={{
                  marginTop: "6px",
                  marginBottom: 0,
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Manage and view staff members assigned to your branch.
              </p>
            </div>

            {/* SEARCH */}
            <div
              style={{
                position: "relative",
                width: "280px",
              }}
            >
              <FiSearch
                size={18}
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="text"
                placeholder="Search staff..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: "100%",
                  height: "42px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "0 14px 0 40px",
                  outline: "none",
                  fontSize: "14px",
                  background: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* =========================
              STAT CARDS
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {/* TOTAL */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Total Staff
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: "26px",
                  color: "#0f172a",
                }}
              >
                {totalStaff}
              </h2>
            </div>

            {/* ACTIVE */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Active
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: "26px",
                  color: "#16a34a",
                }}
              >
                {activeStaff}
              </h2>
            </div>

            {/* INACTIVE */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Inactive
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: "26px",
                  color: "#dc2626",
                }}
              >
                {inactiveStaff}
              </h2>
            </div>

            {/* ON LEAVE */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                On Leave
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: "26px",
                  color: "#d97706",
                }}
              >
                {leaveStaff}
              </h2>
            </div>
          </div>

          {/* =========================
              FILTER TABS
          ========================= */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {[
              { key: "all", label: "All Staff" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "leave", label: "On Leave" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "7px",
                  border:
                    activeTab === tab.key
                      ? "1px solid #2563eb"
                      : "1px solid #e2e8f0",
                  background:
                    activeTab === tab.key ? "#2563eb" : "#ffffff",
                  color:
                    activeTab === tab.key ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* =========================
              STAFF TABLE
          ========================= */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            {filteredStaff.length === 0 ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  No staff found
                </div>

                <div style={{ fontSize: "13px" }}>
                  Try changing your search or filter.
                </div>
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <th style={headerStyle}>Employee</th>
                    <th style={headerStyle}>Role / Department</th>
                    <th style={headerStyle}>Contact</th>
                    <th style={headerStyle}>Shift</th>
                    <th style={headerStyle}>Today</th>
                    <th style={headerStyle}>Attendance</th>
                    <th style={headerStyle}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {/* EMPLOYEE */}
                      <td style={cellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: member.avatarColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#334155",
                              fontWeight: "700",
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {(member.name || "Unknown Staff")
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean)
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#0f172a",
                                fontSize: "14px",
                              }}
                            >
                              {member.name || "Unknown Staff"}
                            </div>

                            <div
                              style={{
                                color: "#94a3b8",
                                fontSize: "12px",
                                marginTop: "3px",
                              }}
                            >
                              {member.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td style={cellStyle}>
                        <div
                          style={{
                            fontWeight: "500",
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          {member.role || "Staff"}
                        </div>

                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginTop: "3px",
                          }}
                        >
                          {member.department || "General"}
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td style={cellStyle}>
                        <div
                          style={{
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          {member.phone || "—"}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "3px",
                          }}
                        >
                          {member.email || "—"}
                        </div>
                      </td>

                      {/* SHIFT */}
                      <td style={cellStyle}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          {member.shift || "—"}
                        </span>
                      </td>

                      {/* TODAY */}
                      <td style={cellStyle}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          {member.today || "—"}
                        </span>
                      </td>

                      {/* ATTENDANCE */}
                      <td style={cellStyle}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          {member.attendance || "—"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td style={cellStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "5px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background:
                              member.status === "Active"
                                ? "#dcfce7"
                                : member.status === "On Leave"
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              member.status === "Active"
                                ? "#15803d"
                                : member.status === "On Leave"
                                ? "#b45309"
                                : "#b91c1c",
                          }}
                        >
                          {member.status || "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// =========================
// TABLE STYLES
// =========================

const headerStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "16px",
  textAlign: "left",
  verticalAlign: "middle",
};

export default StaffDirectory;
