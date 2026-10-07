import React, { useEffect, useState } from 'react';
import {
  FiUpload,
  FiLogOut,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
} from 'react-icons/fi';

const API_URL = 'https://pharmaplus-production-7fa8.up.railway.app';

// =====================================================
// PROFILE
// =====================================================

export const Profile = ({ onLogout, setActiveTab }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
const [photoMessage, setPhotoMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        setError('Please login to view your profile.');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/api/v1/auth/profile`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load profile.'
          );
        }

        const profileUser = data.user || data.data || data;

        setUser(profileUser);

        setFormData({
          fullName: profileUser.fullName || '',
          phone: profileUser.phone || '',
          address: profileUser.address || '',
        });

        localStorage.setItem(
          'user',
          JSON.stringify(profileUser)
        );
      } catch (error) {
        console.error('Fetch Profile Error:', error);

        // Fallback to localStorage
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);

            setUser(parsedUser);

            setFormData({
              fullName: parsedUser.fullName || '',
              phone: parsedUser.phone || '',
              address: parsedUser.address || '',
            });
          } catch (localError) {
            console.error(
              'Unable to read saved user:',
              localError
            );
          }
        }

        setError(
          error.message || 'Unable to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = () => {
    setSaveMessage('');
    setError('');

    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });

    setSaveMessage('');
    setError('');
    setIsEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login again.');
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSaveMessage('');

      const response = await fetch(
        `${API_URL}/api/v1/auth/profile`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Profile update failed.'
        );
      }

      const updatedUser =
        data.user || data.data || data;

      setUser(updatedUser);

      setFormData({
        fullName: updatedUser.fullName || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
      });

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      setSaveMessage(
        'Profile updated successfully! ✓'
      );
    } catch (error) {
      console.error(
        'Update Profile Error:',
        error
      );

      setError(
        error.message || 'Unable to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SIGN OUT
  // =====================================================

  const handleSignOutClick = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (onLogout) {
      onLogout();
    }
  };

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .trim()
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getProfileImage = () => {
    if (!user?.profileImage) {
      return null;
    }

    if (user.profileImage.startsWith('http')) {
      return user.profileImage;
    }

    return `${API_URL}${user.profileImage}`;
  };
   // =====================================================
// UPLOAD PROFILE IMAGE
// =====================================================

const handleProfileImageChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setPhotoMessage('');
  setError('');

  // Allowed image types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (!allowedTypes.includes(file.type)) {
    setPhotoMessage(
      'Sirf JPG, JPEG, PNG ya WEBP image upload karein.'
    );
    event.target.value = '';
    return;
  }

  // Maximum 5MB
  if (file.size > 5 * 1024 * 1024) {
    setPhotoMessage(
      'Profile picture 5MB se zyada nahi honi chahiye.'
    );
    event.target.value = '';
    return;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    setPhotoMessage('Please login again.');
    event.target.value = '';
    return;
  }

  try {
    setUploadingPhoto(true);

    const imageFormData = new FormData();

    imageFormData.append('profileImage', file);

    const response = await fetch(
      `${API_URL}/api/v1/auth/profile/image`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Profile picture upload failed.'
      );
    }

    const updatedUser =
      data.user || data.data || data;

    setUser(updatedUser);

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );

    setPhotoMessage(
      'Profile picture updated successfully! ✓'
    );

  } catch (error) {
    console.error(
      'Profile Image Upload Error:',
      error
    );

    setPhotoMessage(
      error.message ||
        'Profile picture upload nahi ho saki.'
    );
  } finally {
    setUploadingPhoto(false);

    // Reset file input
    event.target.value = '';
  }
};
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.tabContentCard}>

      {/* ================= HEADER ================= */}

      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.tabTitle}>
            Customer Profile
          </h2>

          <p style={styles.tabSubtitle}>
            Manage your account details and delivery
            address.
          </p>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={handleSignOutClick}
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div style={styles.loadingBox}>
          Loading your profile...
        </div>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* ================= SUCCESS ================= */}

      {!loading && saveMessage && (
        <div style={styles.successBox}>
          {saveMessage}
        </div>
      )}

      {/* ================= PROFILE ================= */}

      {!loading && user && (
        <div style={styles.profileCardFull}>

          {/* Avatar */}

          <div style={styles.avatarSection}>

            <div style={styles.largeAvatar}>
              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  style={styles.avatarImage}
                />
              ) : (
                getInitials(user.fullName)
              )}
            </div>

            {/* Future profile image button */}

            <label
  htmlFor="profile-image-input"
  style={{
    ...styles.cameraButton,
    opacity: uploadingPhoto ? 0.7 : 1,
    cursor: uploadingPhoto
      ? 'not-allowed'
      : 'pointer',
  }}
>
  <FiCamera size={13} />

  {uploadingPhoto ? 'Uploading...' : 'Photo'}

  <input
    id="profile-image-input"
    type="file"
    accept=".jpg,.jpeg,.png,.webp"
    onChange={handleProfileImageChange}
    disabled={uploadingPhoto}
    style={{ display: 'none' }}
  />
</label>
{photoMessage && (
  <div
    style={{
      marginTop: '4px',
      fontSize: '10px',
      fontWeight: '600',
      color: photoMessage.includes('successfully')
        ? '#15803d'
        : '#dc2626',
      textAlign: 'center',
      maxWidth: '150px',
    }}
  >
    {photoMessage}
  </div>
)}

          </div>

          {/* Profile Information */}

          <div style={styles.profileInfo}>

            {/* Top row */}

            <div style={styles.profileTopRow}>

              <div>
                <h3 style={styles.profileName}>
                  {user.fullName || 'User'}
                </h3>

                <span style={styles.roleBadge}>
                  {user.role || 'CUSTOMER'}
                </span>
              </div>

              {!isEditing && (
                <button
                  onClick={handleEdit}
                  style={styles.editBtn}
                >
                  <FiEdit3 size={15} />
                  Edit Profile
                </button>
              )}

            </div>

            {/* ================= EDIT FORM ================= */}

            {isEditing ? (
              <div style={styles.editForm}>

                {/* Full Name */}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={styles.formInput}
                  />
                </div>

                {/* Email */}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Email
                  </label>

                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    style={{
                      ...styles.formInput,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      cursor: 'not-allowed',
                    }}
                  />

                  <small style={styles.helperText}>
                    Email cannot be changed here.
                  </small>
                </div>

                {/* Phone */}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={styles.formInput}
                  />
                </div>

                {/* Address */}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address"
                    rows={3}
                    style={styles.formTextarea}
                  />
                </div>

                {/* Actions */}

                <div style={styles.formActions}>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    style={styles.cancelBtn}
                  >
                    <FiX size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      ...styles.saveBtn,
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    <FiSave size={15} />

                    {saving
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>

                </div>

              </div>
            ) : (
              /* ================= VIEW MODE ================= */

              <div style={styles.profileDetails}>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Email
                  </span>

                  <span style={styles.detailValue}>
                    {user.email ||
                      'Email not available'}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Phone
                  </span>

                  <span
                    style={{
                      ...styles.detailValue,
                      color: user.phone
                        ? '#334155'
                        : '#94a3b8',
                    }}
                  >
                    {user.phone ||
                      'Phone not added yet'}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Delivery Address
                  </span>

                  <span
                    style={{
                      ...styles.detailValue,
                      color: user.address
                        ? '#334155'
                        : '#94a3b8',
                    }}
                  >
                    {user.address ||
                      'Address not added yet'}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setActiveTab('my-appointments')
                  }
                  style={styles.appointmentsBtn}
                >
                  <FiCalendar size={16} />
                  My Appointments
                </button>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};


// =====================================================
// UPLOADS / PRESCRIPTIONS
// =====================================================

export const Uploads = () => {
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const [prescriptions, setPrescriptions] =
    useState([]);

  const [loadingPrescriptions, setLoadingPrescriptions] =
    useState(true);

  // =====================================================
  // FETCH PRESCRIPTIONS
  // =====================================================

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoadingPrescriptions(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/prescriptions/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Prescriptions load nahi ho sakin.'
        );
      }

      setPrescriptions(data.data || []);

    } catch (error) {
      console.error(
        'Fetch Prescriptions Error:',
        error
      );

      setError(
        error.message ||
          'Prescriptions load nahi ho sakin.'
      );

    } finally {
      setLoadingPrescriptions(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // =====================================================
  // SELECT FILE
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setMessage('');
    setError('');

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Sirf JPG, JPEG, PNG ya PDF files upload ki ja sakti hain.'
      );

      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'File size 5MB se zyada nahi honi chahiye.'
      );

      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD FILE
  // =====================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(
        'Please pehle prescription file select karein.'
      );
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError(
        'Please login karein before uploading prescription.'
      );
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setError('');

      const formData = new FormData();

      formData.append(
        'prescription',
        selectedFile
      );

      formData.append(
        'notes',
        'Prescription uploaded by customer'
      );

      const response = await fetch(
        `${API_URL}/api/v1/prescriptions/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Prescription upload failed.'
        );
      }

      setMessage(
        'Prescription successfully upload ho gayi! 📝'
      );

      setSelectedFile(null);

      const fileInput = document.getElementById(
        'prescription-file-input'
      );

      if (fileInput) {
        fileInput.value = '';
      }

      fetchPrescriptions();

    } catch (error) {
      console.error(
        'Prescription Upload Error:',
        error
      );

      setError(
        error.message ||
          'Prescription upload nahi ho saki.'
      );

    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // VIEW PRESCRIPTION
  // =====================================================

  const handleViewPrescription = (fileUrl) => {
    window.open(
      `${API_URL}${fileUrl}`,
      '_blank'
    );
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    return new Date(
      dateString
    ).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.tabContentCard}>

      {/* Upload Section */}

      <h2 style={styles.tabTitle}>
        Upload Prescription
      </h2>

      <p style={styles.tabSubtitle}>
        Upload doctor’s notes or prescription images
        for quick verification.
      </p>

      <div
        style={styles.uploadDropzone}
        onClick={() =>
          document
            .getElementById(
              'prescription-file-input'
            )
            ?.click()
        }
      >
        <FiUpload
          size={36}
          color="#2563eb"
          style={{ marginBottom: '10px' }}
        />

        <p
          style={{
            fontWeight: '700',
            color: '#1e3a8a',
            margin: '0 0 4px 0',
          }}
        >
          Click to browse prescription
        </p>

        <p
          style={{
            fontSize: '12px',
            color: '#64748b',
            margin: 0,
          }}
        >
          Supports: JPG, PNG, PDF
          (Max size: 5MB)
        </p>

        <input
          id="prescription-file-input"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Selected File */}

      {selectedFile && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#1e3a8a',
            }}
          >
            Selected File
          </p>

          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#475569',
            }}
          >
            {selectedFile.name}
          </p>
        </div>
      )}

      {/* Error */}

      {error && (
        <p style={styles.errorBox}>
          {error}
        </p>
      )}

      {/* Success */}

      {message && (
        <p style={styles.successBox}>
          {message}
        </p>
      )}

      {/* Upload Button */}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            marginTop: '16px',
            backgroundColor: uploading
              ? '#94a3b8'
              : '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '11px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: uploading
              ? 'not-allowed'
              : 'pointer',
          }}
        >
          {uploading
            ? 'Uploading...'
            : 'Upload Prescription'}
        </button>
      )}

      {/* My Prescriptions */}

      <div
        style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop:
            '1px solid #e2e8f0',
        }}
      >
        <h3
          style={{
            margin: '0 0 6px 0',
            fontSize: '17px',
            fontWeight: '800',
            color: '#0f172a',
          }}
        >
          My Prescriptions
        </h3>

        <p
          style={{
            margin: '0 0 18px 0',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          View your previously uploaded prescriptions
          and their status.
        </p>

        {loadingPrescriptions && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '13px',
            }}
          >
            Loading prescriptions...
          </div>
        )}

        {!loadingPrescriptions &&
          prescriptions.length === 0 && (
            <div
              style={{
                padding: '25px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                border:
                  '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              You haven't uploaded any
              prescriptions yet.
            </div>
          )}

        {!loadingPrescriptions &&
          prescriptions.length > 0 &&
          prescriptions.map(
            (prescription) => (
              <div
                key={prescription.id}
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor:
                    '#ffffff',
                  border:
                    '1px solid #e2e8f0',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <p
                    style={{
                      margin:
                        '0 0 5px 0',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#0f172a',
                      wordBreak:
                        'break-word',
                    }}
                  >
                    {prescription.fileName ||
                      'Prescription'}
                  </p>

                  <p
                    style={{
                      margin:
                        '0 0 6px 0',
                      fontSize: '12px',
                      color: '#64748b',
                    }}
                  >
                    Uploaded on{' '}
                    {formatDate(
                      prescription.createdAt
                    )}
                  </p>

                  {prescription.notes && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#64748b',
                      }}
                    >
                      {prescription.notes}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection:
                      'column',
                    alignItems:
                      'flex-end',
                    gap: '8px',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      padding:
                        '5px 9px',
                      borderRadius:
                        '999px',
                      backgroundColor:
                        prescription.status ===
                        'PENDING'
                          ? '#fef3c7'
                          : '#dcfce7',
                      color:
                        prescription.status ===
                        'PENDING'
                          ? '#92400e'
                          : '#166534',
                      fontSize: '11px',
                      fontWeight: '800',
                    }}
                  >
                    {prescription.status}
                  </span>

                  {prescription.fileUrl && (
                    <button
                      onClick={() =>
                        handleViewPrescription(
                          prescription.fileUrl
                        )
                      }
                      style={{
                        backgroundColor:
                          '#eff6ff',
                        color:
                          '#2563eb',
                        border:
                          '1px solid #bfdbfe',
                        padding:
                          '7px 11px',
                        borderRadius:
                          '7px',
                        fontSize:
                          '12px',
                        fontWeight:
                          '700',
                        cursor:
                          'pointer',
                      }}
                    >
                      View Prescription
                    </button>
                  )}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};


// =====================================================
// STYLES
// =====================================================

const styles = {
  tabContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    minHeight: '60vh',
  },

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    gap: '15px',
  },

  tabTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },

  tabSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },

  logoutBtn: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  loadingBox: {
    padding: '30px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
  },

  errorBox: {
    padding: '10px 12px',
    marginBottom: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
  },

  successBox: {
    padding: '10px 12px',
    marginBottom: '16px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    color: '#15803d',
    fontSize: '13px',
    fontWeight: '600',
  },

  profileCardFull: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },

  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },

  largeAvatar: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    overflow: 'hidden',
    border: '3px solid #dbeafe',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  cameraButton: {
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    padding: '5px 9px',
    borderRadius: '7px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  profileTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '18px',
  },

  profileName: {
    margin: '0 0 7px 0',
    color: '#0f172a',
    fontSize: '20px',
    fontWeight: '800',
  },

  roleBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontSize: '10px',
    fontWeight: '800',
  },

  editBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '9px 13px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },

  profileDetails: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '14px 16px',
  },

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
  },

  detailLabel: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },

  detailValue: {
    color: '#334155',
    fontSize: '13px',
    textAlign: 'right',
    wordBreak: 'break-word',
  },

  editForm: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '18px',
  },

  formGroup: {
    marginBottom: '15px',
  },

  formLabel: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
  },

  formInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#ffffff',
  },

  formTextarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  helperText: {
    display: 'block',
    marginTop: '5px',
    fontSize: '11px',
    color: '#94a3b8',
  },

  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '9px',
    marginTop: '18px',
  },

  cancelBtn: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    padding: '9px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  saveBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '9px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  appointmentsBtn: {
    marginTop: '15px',
    backgroundColor: '#0d9488',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },

  uploadDropzone: {
    border: '2px dashed #93c5fd',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
  },
};

export default Profile;