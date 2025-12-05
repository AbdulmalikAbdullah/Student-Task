import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../notification/notification";
import axios from "axios";
import "../Login/Login.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [showNotifErr, setShowNotifErr] = useState(false);
  const [showNotifsuccess, setShowNotifsuccess] = useState(false);
  const icon = "../../../assets/navIcon.svg";

  // useEffect(() => {
  //   const token = query.get("token");
  //   const email = query.get("email");

  //   if (!token || !email) {
  //     return; // stop the effect
  //   }

  //   axios.get(`http://localhost:5000/api/auth/verify-email`, {
  //     params: { token, email }
  //   })
  //     .then(res => {
  //       setShowNotifsuccess(true)
  //       setTimeout(() => {
  //         setShowNotifsuccess(false);
  //       }, 3500);
  //       setTimeout(() => navigate("/"), 3500);
  //     })
  //     .catch(err => {
  //       setShowNotifErr(true);
  //       setTimeout(() => setShowNotifErr(false), 3500);
  //       setTimeout(() => navigate("/"), 3500);
  //     });
  // }, [query, navigate]);

  
  useEffect(() => {
    const status = query.get("status");
    
    if (status === "success") {

      setShowNotifsuccess(true)
      setTimeout(() => {
        setShowNotifsuccess(false);
      }, 3500);
      setTimeout(() => navigate("/"), 3500);

    } else if (status === "error") {

      setShowNotifErr(true);
      setTimeout(() => setShowNotifErr(false), 3500);
      setTimeout(() => navigate("/"), 3500);
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
