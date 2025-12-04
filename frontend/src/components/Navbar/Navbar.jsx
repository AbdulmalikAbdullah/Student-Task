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
  const icon = <svg className="icon"
    width="32px"
    height="32px"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeMiterlimit="10"
      x1="3"
      y1="13"
      x2="3"
      y2="24"
    />
    <circle fill="#ffffff" cx="3" cy="24" r="2" />
    <polygon
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeMiterlimit="10"
      points="16,8.833 3.5,13 16,17.167 28.5,13"
    />
    <path
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeMiterlimit="10"
      d="M7,14.451V20c0,1.657,4.029,3,9,3s9-1.343,9-3v-5.549"
    />
  </svg>


  return (
    <>
      <nav className={`navbar ${isModalOpen ? "transparent" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <span>{icon}</span><h1> Student Task</h1>
          </div>

          <div className="navbar-buttons">
            <Notifications />
            
            <button
              className="nav-btn profile-btn"
              onClick={() => navigate('/dashboard')}
              title="View and edit profile"
            >
              <svg fill="#000000" width="24px" height="24px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z" fillRule="evenodd" />
              </svg>
            </button>

            <button
              className="nav-btn profile-btn"
              onClick={() => setShowProfileModal(true)}
              title="View and edit profile"
            >
              <svg width="24px" height="24px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 7.5C9.433 7.5 11 5.933 11 4C11 2.067 9.433 0.5 7.5 0.5C5.567 0.5 4 2.067 4 4C4 5.933 5.567 7.5 7.5 7.5ZM7.5 8.5C5.015 8.5 0.5 9.675 0.5 12.165V14.5H14.5V12.165C14.5 9.675 9.985 8.5 7.5 8.5Z" stroke="#000000" />
              </svg>
            </button>

            <button
              className="nav-btn logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <svg width="24px" height="24px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.5M13.5 7.5L4 7.5M8 13.5H1.5L1.5 1.5L8 1.5" stroke="#000000" />
              </svg>
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
