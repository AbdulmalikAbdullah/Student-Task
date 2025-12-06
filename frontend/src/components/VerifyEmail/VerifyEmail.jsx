import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../notification/notification";
import axios from "axios";
import "../Login/Login.css";
import icon from "../../../public/assets/navIcon.svg";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [showNotifErr, setShowNotifErr] = useState(false);
  const [showNotifsuccess, setShowNotifsuccess] = useState(false);


  useEffect(() => {
    const status = query.get("status");

    if (status === "success") {

      setShowNotifsuccess(true)
      setTimeout(() => {
        setShowNotifsuccess(false);
      }, 3900);
      setTimeout(() => navigate("/"), 3900);

    } else if (status === "error") {

      setShowNotifErr(true);
      setTimeout(() => setShowNotifErr(false), 3900);
      setTimeout(() => navigate("/"), 3900);
    }
  }, [query, navigate]);


  return (
    <>
      <div className="container">
        <div className="background-container"></div>
        <div className="login-container">

          <div className="icon-header">
            <img src={icon} className="icon" alt="Nav Icon" />
            <h1 className="welcomeBack-h1"> Student Task</h1>
          </div>
          <div className="greeting">
            <h2 className="welcomeBack-h2">Welcome To Student Task</h2>
            <p className="welcomeBack-p">Your account is successfully verified</p>
          </div>

          {showNotifErr && (
            <Notification
              message="Failed to verify email! Please try again. or it's already verified"
              type="error"
            />
          )}

          {showNotifsuccess && (
            <Notification
              message="Email verified successfully! Redirecting..."
              type="success"
            />
          )}

        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
