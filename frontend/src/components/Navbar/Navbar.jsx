import "./Navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../Profile/ProfileModal";
import Notifications from "../notification/Notifications.jsx";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isModalOpen = showProfileModal;

  return (
    <>
      <nav className={`navbar ${isModalOpen ? "transparent" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>Student Task</h1>
          </div>

          <div className="navbar-buttons">
            <Notifications />
            
            <button
              className="nav-btn profile-btn"
              onClick={() => setShowProfileModal(true)}
              title="View and edit profile"
            >
              👤 Profile
            </button>

            <button
              className="nav-btn logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

export default Navbar;
