import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  const [doctorBranch, setDoctorBranch] = useState(null);
  const [patients, setPatients] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  const [statusMsg, setStatusMsg] = useState({
    type: '',
    text: ''
  });

  // Prescription Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [notes, setNotes] = useState('');

  const [medicines, setMedicines] = useState([
    {
      medicineName: '',
      dosage: '1 Tab Daily',
      duration: '5 Days',
      quantity: 1
    }
  ]);

  // Appointment confirmation date/time state
  const [appointmentDates, setAppointmentDates] = useState({});
  const [confirmingAppointment, setConfirmingAppointment] = useState(null);

  const API_BASE = 'http://localhost:5000/api/v1';

  const PRESCRIPTION_API = `${API_BASE}/prescriptions`;
  const APPOINTMENT_API = `${API_BASE}/appointments`;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================================
  // FETCH PRESCRIPTION DASHBOARD DATA
  // =========================================================

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const user = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      if (user.branch) {
        setDoctorBranch(user.branch);
      }

      const [patientsRes, recentRes] = await Promise.all([
        axios.get(`${PRESCRIPTION_API}/patients`, config),
        axios.get(`${PRESCRIPTION_API}/recent`, config)
      ]);

      if (patientsRes.data?.patients) {
        setPatients(patientsRes.data.patients);
      }

      if (recentRes.data?.prescriptions) {
        setRecentPrescriptions(
          recentRes.data.prescriptions
        );
      }
    } catch (err) {
      console.error(
        'Dashboard Data Fetch Error:',
        err
      );

      setStatusMsg({
        type: 'error',
        text: 'Dashboard data load karne mein masla hua.'
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH DOCTOR APPOINTMENT REQUESTS
  // =========================================================

  const fetchAppointmentRequests = async () => {
    setAppointmentsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${APPOINTMENT_API}/requests`,
        config
      );

      console.log(
        'DOCTOR APPOINTMENT REQUESTS:',
        response.data
      );

      setAppointmentRequests(
        response.data?.requests || []
      );
    } catch (err) {
      console.error(
        'Appointment Requests Error:',
        err
      );

      setStatusMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Appointment requests load nahi ho sakin.'
      });
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // =========================================================
  // WHEN APPOINTMENT TAB OPENS
  // =========================================================

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointmentRequests();
    }
  }, [activeTab]);

  // =========================================================
  // MEDICINE FORM FUNCTIONS
  // =========================================================

  const handleMedicineChange = (
    index,
    field,
    value
  ) => {
    const updated = [...medicines];

    updated[index][field] = value;

    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: '',
        dosage: '1 Tab Daily',
        duration: '5 Days',
        quantity: 1
      }
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) return;

    setMedicines(
      medicines.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // CREATE PRESCRIPTION
  // =========================================================

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();

    if (!selectedPatientId) {
      setStatusMsg({
        type: 'error',
        text: 'Barah-e-karam patient select karein!'
      });

      return;
    }

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const payload = {
        patientId: selectedPatientId,
        notes,
        medicines
      };

      await axios.post(
        `${PRESCRIPTION_API}/create`,
        payload,
        config
      );

      setStatusMsg({
        type: 'success',
        text:
          'Prescription successfully issue ho gayi! 📝'
      });

      setNotes('');
      setSelectedPatientId('');

      setMedicines([
        {
          medicineName: '',
          dosage: '1 Tab Daily',
          duration: '5 Days',
          quantity: 1
        }
      ]);

      fetchDashboardData();
    } catch (err) {
      console.error(
        'Prescription Error:',
        err
      );

      setStatusMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Prescription create karne mein error aaya.'
      });
    }
  };

  // =========================================================
  // DATE/TIME CHANGE FOR APPOINTMENT
  // =========================================================

  const handleAppointmentDateChange = (
    appointmentId,
    value
  ) => {
    setAppointmentDates((prev) => ({
      ...prev,
      [appointmentId]: value
    }));
  };

  // =========================================================
  // CONFIRM APPOINTMENT
  // =========================================================

  const handleConfirmAppointment = async (
    appointmentId
  ) => {
    const scheduledAt =
      appointmentDates[appointmentId];

    if (!scheduledAt) {
      setStatusMsg({
        type: 'error',
        text:
          'Please appointment ki date aur time select karein.'
      });

      return;
    }

    try {
      setConfirmingAppointment(appointmentId);

      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // datetime-local value ko ISO format mein convert
      const isoDate = new Date(
        scheduledAt
      ).toISOString();

      await axios.put(
        `${APPOINTMENT_API}/confirm/${appointmentId}`,
        {
          scheduledAt: isoDate
        },
        config
      );

      setStatusMsg({
        type: 'success',
        text:
          'Appointment successfully confirm ho gayi! 📅'
      });

      // Selected date remove
      setAppointmentDates((prev) => {
        const updated = { ...prev };
        delete updated[appointmentId];
        return updated;
      });

      // Appointment list refresh
      await fetchAppointmentRequests();
    } catch (err) {
      console.error(
        'Confirm Appointment Error:',
        err
      );

      setStatusMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Appointment confirm karne mein error aaya.'
      });
    } finally {
      setConfirmingAppointment(null);
    }
  };

  // =========================================================
  // FORMAT APPOINTMENT TYPE
  // =========================================================

  const formatAppointmentType = (type) => {
    if (!type) return 'Appointment';

    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatRequestDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.dashboardContainer}>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside style={styles.sidebar}>

        <div style={styles.sidebarHeader}>
          <h2 style={styles.brandTitle}>
            PharmaPlus 🩺
          </h2>

          <p style={styles.roleBadge}>
            Doctor Panel
          </p>
        </div>

        {/* Assigned Branch */}

        <div style={styles.statsCard}>
          <p style={styles.statsLabel}>
            Assigned Branch
          </p>

          <h3 style={styles.branchName}>
            {doctorBranch?.name || 'Main Branch'}
          </h3>
        </div>

        {/* Prescription Count */}

        <div style={styles.statsCard}>
          <p style={styles.statsLabel}>
            Prescriptions Issued
          </p>

          <h3 style={styles.statsCount}>
            {recentPrescriptions.length}
          </h3>
        </div>

        {/* Appointment Count */}

        <div style={styles.statsCard}>
          <p style={styles.statsLabel}>
            Pending Appointments
          </p>

          <h3 style={styles.statsCount}>
            {appointmentRequests.length}
          </h3>
        </div>

        {/* Navigation */}

        <nav style={styles.navMenu}>

          <button
            onClick={() => {
              setActiveTab('create');
              setStatusMsg({
                type: '',
                text: ''
              });
            }}
            style={
              activeTab === 'create'
                ? {
                    ...styles.navItem,
                    ...styles.navItemActive
                  }
                : styles.navItem
            }
          >
            📝 Create Prescription
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setStatusMsg({
                type: '',
                text: ''
              });
            }}
            style={
              activeTab === 'history'
                ? {
                    ...styles.navItem,
                    ...styles.navItemActive
                  }
                : styles.navItem
            }
          >
            📊 Prescription History
          </button>

          <button
            onClick={() => {
              setActiveTab('patients');
              setStatusMsg({
                type: '',
                text: ''
              });
            }}
            style={
              activeTab === 'patients'
                ? {
                    ...styles.navItem,
                    ...styles.navItemActive
                  }
                : styles.navItem
            }
          >
            👥 Connected Patients
          </button>

          {/* NEW APPOINTMENT TAB */}

          <button
            onClick={() => {
              setActiveTab('appointments');
              setStatusMsg({
                type: '',
                text: ''
              });
            }}
            style={
              activeTab === 'appointments'
                ? {
                    ...styles.navItem,
                    ...styles.navItemActive
                  }
                : styles.navItem
            }
          >
            📅 Appointment Requests
            {appointmentRequests.length > 0 && (
              <span style={styles.notificationBadge}>
                {appointmentRequests.length}
              </span>
            )}
          </button>

        </nav>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main style={styles.mainContent}>

        {/* Status Message */}

        {statusMsg.text && (
          <div
            style={
              statusMsg.type === 'error'
                ? styles.alertError
                : styles.alertSuccess
            }
          >
            {statusMsg.text}
          </div>
        )}

        {/* ===================================================
            TAB 1 - CREATE PRESCRIPTION
        =================================================== */}

        {activeTab === 'create' && (
          <>
            <section style={styles.card}>

              <h2 style={styles.cardTitle}>
                Issue New Prescription
              </h2>

              <form
                onSubmit={
                  handleSubmitPrescription
                }
              >

                <div style={styles.formGroup}>

                  <label style={styles.label}>
                    Select Registered Patient:
                  </label>

                  <select
                    style={styles.selectInput}
                    value={selectedPatientId}
                    onChange={(e) =>
                      setSelectedPatientId(
                        e.target.value
                      )
                    }
                    required
                  >

                    <option value="">
                      -- Choose Patient --
                    </option>

                    {patients.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                      >
                        {p.fullName} ({p.email})
                      </option>
                    ))}

                  </select>

                </div>

                <div style={styles.medicineSection}>

                  <h4
                    style={{
                      marginBottom: '10px',
                      color: '#1A365D'
                    }}
                  >
                    Prescribed Medicines
                  </h4>

                  {medicines.map(
                    (med, idx) => (
                      <div
                        key={idx}
                        style={
                          styles.medicineRow
                        }
                      >

                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Panadol)"
                          style={{
                            ...styles.input,
                            flex: 2
                          }}
                          value={
                            med.medicineName
                          }
                          onChange={(e) =>
                            handleMedicineChange(
                              idx,
                              'medicineName',
                              e.target.value
                            )
                          }
                          required
                        />

                        <input
                          type="text"
                          placeholder="Dosage (e.g. 1-0-1)"
                          style={{
                            ...styles.input,
                            flex: 1
                          }}
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              idx,
                              'dosage',
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="text"
                          placeholder="Duration"
                          style={{
                            ...styles.input,
                            flex: 1
                          }}
                          value={
                            med.duration
                          }
                          onChange={(e) =>
                            handleMedicineChange(
                              idx,
                              'duration',
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="number"
                          min="1"
                          style={{
                            ...styles.input,
                            width: '70px'
                          }}
                          value={med.quantity}
                          onChange={(e) =>
                            handleMedicineChange(
                              idx,
                              'quantity',
                              e.target.value
                            )
                          }
                        />

                        {medicines.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeMedicineRow(
                                idx
                              )
                            }
                            style={
                              styles.btnRemove
                            }
                          >
                            ✖
                          </button>
                        )}

                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={addMedicineRow}
                    style={styles.btnAddRow}
                  >
                    + Add Another Medicine
                  </button>

                </div>

                <div style={styles.formGroup}>

                  <label style={styles.label}>
                    Doctor Instructions / Notes:
                  </label>

                  <textarea
                    rows="3"
                    placeholder="Take after meals, drink plenty of water..."
                    style={styles.textarea}
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                  />

                </div>

                <button
                  type="submit"
                  style={styles.btnSubmit}
                >
                  Issue Prescription 🚀
                </button>

              </form>

            </section>

            <section style={styles.card}>

              <h3 style={styles.cardTitle}>
                Recent Branch Prescriptions
              </h3>

              {loading ? (
                <p>
                  Loading recent records...
                </p>
              ) : recentPrescriptions.length ===
                0 ? (
                <p
                  style={{
                    color: '#718096'
                  }}
                >
                  Abhi tak koi prescription issue
                  nahi hui.
                </p>
              ) : (
                <table style={styles.table}>

                  <thead>
                    <tr
                      style={
                        styles.tableHeader
                      }
                    >
                      <th style={styles.th}>
                        Patient Name
                      </th>

                      <th style={styles.th}>
                        Date
                      </th>

                      <th style={styles.th}>
                        Items
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentPrescriptions
                      .slice(0, 5)
                      .map((p) => (
                        <tr key={p.id}>

                          <td style={styles.td}>
                            {p.patient?.fullName ||
                              'N/A'}
                          </td>

                          <td style={styles.td}>
                            {new Date(
                              p.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td style={styles.td}>
                            {p.items?.length || 0}{' '}
                            Medicines
                          </td>

                          <td style={styles.td}>

                            <span
                              style={
                                p.status ===
                                'DISPENSED'
                                  ? styles.badgeSuccess
                                  : styles.badgePending
                              }
                            >
                              {p.status}
                            </span>

                          </td>

                        </tr>
                      ))}
                  </tbody>

                </table>
              )}

            </section>
          </>
        )}

        {/* ===================================================
            TAB 2 - PRESCRIPTION HISTORY
        =================================================== */}

        {activeTab === 'history' && (
          <section style={styles.card}>

            <h2 style={styles.cardTitle}>
              📊 All Prescription History
            </h2>

            {recentPrescriptions.length ===
            0 ? (
              <p
                style={{
                  color: '#718096'
                }}
              >
                Koi history maujood nahi hai.
              </p>
            ) : (
              <table style={styles.table}>

                <thead>
                  <tr
                    style={
                      styles.tableHeader
                    }
                  >

                    <th style={styles.th}>
                      Prescription ID
                    </th>

                    <th style={styles.th}>
                      Patient
                    </th>

                    <th style={styles.th}>
                      Medicines
                    </th>

                    <th style={styles.th}>
                      Date Issued
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentPrescriptions.map(
                    (p) => (
                      <tr key={p.id}>

                        <td style={styles.td}>
                          <code>
                            {p.id.slice(0, 8)}
                            ...
                          </code>
                        </td>

                        <td style={styles.td}>
                          {p.patient?.fullName} (
                          {p.patient?.email})
                        </td>

                        <td style={styles.td}>
                          {p.items
                            ?.map(
                              (i) =>
                                `${i.medicineName} (${i.dosage})`
                            )
                            .join(', ')}
                        </td>

                        <td style={styles.td}>
                          {new Date(
                            p.createdAt
                          ).toLocaleString()}
                        </td>

                        <td style={styles.td}>

                          <span
                            style={
                              p.status ===
                              'DISPENSED'
                                ? styles.badgeSuccess
                                : styles.badgePending
                            }
                          >
                            {p.status}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </section>
        )}

        {/* ===================================================
            TAB 3 - CONNECTED PATIENTS
        =================================================== */}

        {activeTab === 'patients' && (
          <section style={styles.card}>

            <h2 style={styles.cardTitle}>
              👥 Connected Branch Patients
            </h2>

            {patients.length === 0 ? (
              <p
                style={{
                  color: '#718096'
                }}
              >
                Is branch se koi patient
                registered nahi hai.
              </p>
            ) : (
              <table style={styles.table}>

                <thead>
                  <tr
                    style={
                      styles.tableHeader
                    }
                  >

                    <th style={styles.th}>
                      Patient ID
                    </th>

                    <th style={styles.th}>
                      Full Name
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                    <th style={styles.th}>
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {patients.map((pt) => (
                    <tr key={pt.id}>

                      <td style={styles.td}>
                        <code>
                          {pt.id.slice(0, 8)}
                          ...
                        </code>
                      </td>

                      <td style={styles.td}>
                        <strong>
                          {pt.fullName}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        {pt.email}
                      </td>

                      <td style={styles.td}>

                        <button
                          onClick={() => {
                            setSelectedPatientId(
                              pt.id
                            );

                            setActiveTab(
                              'create'
                            );
                          }}
                          style={
                            styles.btnAction
                          }
                        >
                          Write Prescription 📝
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </section>
        )}

        {/* ===================================================
            TAB 4 - APPOINTMENT REQUESTS
        =================================================== */}

        {activeTab === 'appointments' && (
          <section style={styles.card}>

            <div
              style={
                styles.appointmentHeader
              }
            >

              <div>
                <h2 style={styles.cardTitle}>
                  📅 Appointment Requests
                </h2>

                <p
                  style={
                    styles.appointmentSubtitle
                  }
                >
                  Patients ki appointment requests
                  review karein aur date/time assign
                  karein.
                </p>
              </div>

              <button
                onClick={
                  fetchAppointmentRequests
                }
                style={
                  styles.refreshButton
                }
              >
                🔄 Refresh
              </button>

            </div>

            {appointmentsLoading ? (
              <div
                style={
                  styles.loadingBox
                }
              >
                <p>
                  Appointment requests load
                  ho rahi hain...
                </p>
              </div>
            ) : appointmentRequests.length ===
              0 ? (
              <div
                style={
                  styles.emptyAppointment
                }
              >

                <div
                  style={
                    styles.emptyIcon
                  }
                >
                  📭
                </div>

                <h3
                  style={{
                    margin: '10px 0',
                    color: '#1E293B'
                  }}
                >
                  No Pending Requests
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#64748B'
                  }}
                >
                  Abhi koi new appointment request
                  pending nahi hai.
                </p>

              </div>
            ) : (
              <div
                style={
                  styles.appointmentList
                }
              >

                {appointmentRequests.map(
                  (appointment) => (

                    <div
                      key={appointment.id}
                      style={
                        styles.appointmentCard
                      }
                    >

                      {/* Patient Information */}

                      <div
                        style={
                          styles.patientInfo
                        }
                      >

                        <div
                          style={
                            styles.patientAvatar
                          }
                        >
                          👤
                        </div>

                        <div>
                          <h3
                            style={
                              styles.patientName
                            }
                          >
                            {appointment.patient
                              ?.fullName ||
                              'Unknown Patient'}
                          </h3>

                          <p
                            style={
                              styles.patientEmail
                            }
                          >
                            {appointment.patient
                              ?.email ||
                              'No email available'}
                          </p>

                          {appointment.patient
                            ?.phone && (
                            <p
                              style={
                                styles.patientPhone
                              }
                            >
                              📞{' '}
                              {
                                appointment
                                  .patient
                                  .phone
                              }
                            </p>
                          )}

                        </div>

                      </div>

                      {/* Appointment Details */}

                      <div
                        style={
                          styles.appointmentDetails
                        }
                      >

                        <div
                          style={
                            styles.detailItem
                          }
                        >
                          <span
                            style={
                              styles.detailLabel
                            }
                          >
                            Appointment Type
                          </span>

                          <strong
                            style={
                              styles.detailValue
                            }
                          >
                            {formatAppointmentType(
                              appointment.type
                            )}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.detailItem
                          }
                        >
                          <span
                            style={
                              styles.detailLabel
                            }
                          >
                            Requested
                          </span>

                          <strong
                            style={
                              styles.detailValue
                            }
                          >
                            {formatRequestDate(
                              appointment.createdAt
                            )}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.detailItem
                          }
                        >
                          <span
                            style={
                              styles.detailLabel
                            }
                          >
                            Branch
                          </span>

                          <strong
                            style={
                              styles.detailValue
                            }
                          >
                            {appointment.branch
                              ?.name ||
                              doctorBranch?.name ||
                              'Main Branch'}
                          </strong>
                        </div>

                      </div>

                      {/* Patient Problem */}

                      <div
                        style={
                          styles.problemBox
                        }
                      >

                        <span
                          style={
                            styles.problemLabel
                          }
                        >
                          Patient Problem
                        </span>

                        <p
                          style={
                            styles.problemText
                          }
                        >
                          {appointment.problem ||
                            'No problem description provided.'}
                        </p>

                      </div>

                      {/* Status */}

                      <div
                        style={
                          styles.statusRow
                        }
                      >

                        <span
                          style={
                            styles.pendingBadge
                          }
                        >
                          {appointment.status ||
                            'PENDING'}
                        </span>

                      </div>

                      {/* Date & Time Assignment */}

                      <div
                        style={
                          styles.confirmSection
                        }
                      >

                        <div>
                          <label
                            style={
                              styles.confirmLabel
                            }
                          >
                            Select Appointment
                            Date & Time
                          </label>

                          <input
                            type="datetime-local"
                            value={
                              appointmentDates[
                                appointment.id
                              ] || ''
                            }
                            min={
                              new Date()
                                .toISOString()
                                .slice(0, 16)
                            }
                            onChange={(e) =>
                              handleAppointmentDateChange(
                                appointment.id,
                                e.target.value
                              )
                            }
                            style={
                              styles.dateTimeInput
                            }
                          />
                        </div>

                        <button
                          onClick={() =>
                            handleConfirmAppointment(
                              appointment.id
                            )
                          }
                          disabled={
                            confirmingAppointment ===
                            appointment.id
                          }
                          style={
                            confirmingAppointment ===
                            appointment.id
                              ? {
                                  ...styles.confirmButton,
                                  ...styles.confirmButtonDisabled
                                }
                              : styles.confirmButton
                          }
                        >
                          {confirmingAppointment ===
                          appointment.id
                            ? 'Confirming...'
                            : '✅ Confirm Appointment'}
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>
        )}

      </main>
    </div>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = {

  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    fontFamily: "'Inter', sans-serif"
  },

  sidebar: {
    width: '280px',
    background:
      'linear-gradient(180deg, #34D399 0%, #0284C7 100%)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },

  sidebarHeader: {
    marginBottom: '4px'
  },

  brandTitle: {
    margin: 0,
    fontSize: '22px',
    color: '#064E3B',
    fontWeight: 'bold'
  },

  roleBadge: {
    margin: 0,
    fontSize: '13px',
    color: '#0F172A',
    fontWeight: '600'
  },

  statsCard: {
    backgroundColor:
      'rgba(255, 255, 255, 0.85)',
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow:
      '0 2px 4px rgba(0,0,0,0.05)'
  },

  statsLabel: {
    margin: 0,
    fontSize: '11px',
    color: '#065F46',
    fontWeight: '700',
    textTransform: 'uppercase'
  },

  branchName: {
    margin: '4px 0 0 0',
    fontSize: '16px',
    color: '#0369A1',
    fontWeight: 'bold'
  },

  statsCount: {
    margin: '4px 0 0 0',
    fontSize: '20px',
    color: '#0F172A',
    fontWeight: 'bold'
  },

  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '10px'
  },

  navItem: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    textAlign: 'left',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
    transition: 'all 0.2s ease',
    position: 'relative'
  },

  navItemActive: {
    backgroundColor: '#FFFFFF',
    color: '#0369A1',
    boxShadow:
      '0 2px 6px rgba(0,0,0,0.1)'
  },

  notificationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px',
    minWidth: '20px',
    height: '20px',
    padding: '0 5px',
    borderRadius: '10px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '700'
  },

  mainContent: {
    flex: 1,
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '12px',
    boxShadow:
      '0 2px 8px rgba(0,0,0,0.04)'
  },

  cardTitle: {
    marginTop: 0,
    color: '#1E293B',
    fontSize: '18px',
    marginBottom: '16px'
  },

  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569'
  },

  selectInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '14px'
  },

  medicineSection: {
    backgroundColor: '#F8FAFC',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px'
  },

  medicineRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  },

  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '14px'
  },

  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    resize: 'vertical'
  },

  btnAddRow: {
    padding: '6px 12px',
    backgroundColor: '#E2E8F0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },

  btnRemove: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '36px'
  },

  btnSubmit: {
    backgroundColor: '#0284C7',
    color: '#FFF',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  },

  btnAction: {
    backgroundColor: '#0284C7',
    color: '#FFF',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },

  alertSuccess: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '12px'
  },

  alertError: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '12px'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  tableHeader: {
    backgroundColor: '#F1F5F9',
    textAlign: 'left'
  },

  th: {
    padding: '10px',
    fontSize: '13px',
    color: '#475569'
  },

  td: {
    padding: '10px',
    fontSize: '14px',
    borderBottom:
      '1px solid #E2E8F0'
  },

  badgeSuccess: {
    backgroundColor: '#DEF7EC',
    color: '#03543F',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },

  badgePending: {
    backgroundColor: '#FEF08A',
    color: '#854D0E',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },

  // =======================================================
  // APPOINTMENT STYLES
  // =======================================================

  notificationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px',
    minWidth: '20px',
    height: '20px',
    padding: '0 5px',
    borderRadius: '10px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '700'
  },

  appointmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px'
  },

  appointmentSubtitle: {
    margin: '-8px 0 0 0',
    color: '#64748B',
    fontSize: '14px'
  },

  refreshButton: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    border: 'none',
    padding: '9px 15px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },

  loadingBox: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748B'
  },

  emptyAppointment: {
    padding: '55px 20px',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    border: '1px dashed #CBD5E1'
  },

  emptyIcon: {
    fontSize: '40px'
  },

  appointmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },

  appointmentCard: {
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#FFFFFF'
  },

  patientInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px'
  },

  patientAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#E0F2FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px'
  },

  patientName: {
    margin: 0,
    color: '#1E293B',
    fontSize: '16px'
  },

  patientEmail: {
    margin: '3px 0 0 0',
    color: '#64748B',
    fontSize: '13px'
  },

  patientPhone: {
    margin: '3px 0 0 0',
    color: '#64748B',
    fontSize: '12px'
  },

  appointmentDetails: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px'
  },

  detailItem: {
    backgroundColor: '#F8FAFC',
    padding: '12px',
    borderRadius: '8px'
  },

  detailLabel: {
    display: 'block',
    color: '#64748B',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '5px'
  },

  detailValue: {
    color: '#1E293B',
    fontSize: '13px'
  },

  problemBox: {
    backgroundColor: '#F8FAFC',
    borderLeft:
      '3px solid #0284C7',
    padding: '12px 14px',
    borderRadius: '6px',
    marginBottom: '14px'
  },

  problemLabel: {
    display: 'block',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '5px'
  },

  problemText: {
    margin: 0,
    color: '#334155',
    fontSize: '14px',
    lineHeight: '1.5'
  },

  statusRow: {
    marginBottom: '16px'
  },

  pendingBadge: {
    display: 'inline-block',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },

  confirmSection: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
    borderTop:
      '1px solid #E2E8F0'
  },

  confirmLabel: {
    display: 'block',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px'
  },

  dateTimeInput: {
    padding: '10px 12px',
    borderRadius: '7px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    minWidth: '230px'
  },

  confirmButton: {
    backgroundColor: '#059669',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700'
  },

  confirmButtonDisabled: {
    backgroundColor: '#94A3B8',
    cursor: 'not-allowed'
  }

};

export default DoctorDashboard;