import "../Shared/Modal.css";
import "./ProfileModal.css";
import { useState, useContext } from "react";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";

function ProfileModal({ user, onClose }) {
  const { user: contextUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await api.put("/auth/update-profile", updateData);
      setMessage({ type: "success", text: res.data.msg || "Profile updated successfully" });
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setIsEditing(false);

      // Refresh user data after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal profile-modal modal-light" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><img className='profile-Icon' src="../../../assets/profileIcon.svg" alt="Date Icon" /> Profile</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-item">
              <label>First Name</label>
              <p>{user?.firstName}</p>
            </div>
            <div className="profile-item">
              <label>Last Name</label>
              <p>{user?.lastName}</p>
            </div>
            <div className="profile-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <button className="btn primary edit-btn" onClick={() => setIsEditing(true)}>
               Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password (Optional)</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Leave empty to keep current password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={!formData.password}
              />
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    email: user?.email || "",
                    password: "",
                    confirmPassword: "",
                  });
                  setMessage("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
