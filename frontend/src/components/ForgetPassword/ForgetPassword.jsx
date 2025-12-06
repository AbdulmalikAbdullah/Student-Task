import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Notification from "../notification/notification";
import "../Login/Login.css";
import "./ForgetPassword.css"
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showNotifErr, setShowNotifErr] = useState(false);
  const [showNotifsuccess, setShowNotifsuccess] = useState(false);
  const icon = "../../../assets/navIcon.svg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}api/auth/forgot-password`, { email });
      setShowNotifsuccess(true);
      setTimeout(() => {
        setShowNotifsuccess(false);
        window.location.href = "/";
      }, 3900);
    } catch (err) {
      setShowNotifErr(true);
      setTimeout(() => setShowNotifErr(false), 3900);
    }
  };

  return (<>
    <div className="container">
      <div className="background-container"></div>

      <div className="login-container">

        <div className="icon-header">
          <img src={icon} className="icon" alt="Nav Icon" />
          <h1 className="welcomeBack-h1"> Student Task</h1>
        </div>
        <div className="greeting">
          <h2 className="welcomeBack-h2">Foregt Password</h2>
          <p className="welcomeBack-p">Enter your email, forget password like will be send</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="forget-box">

            <input
              className="input-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="register-button" type="submit">Send Reset Link</button>

          </div>
        </form>
        <div className="message">
          <p>
            I have remember my password!{" "}
            <Link to="/">Login</Link>
          </p>

          {showNotifErr && Notification({
            message: 'Failed to send reset link! Please try again later.',
            type: 'error'
          })}

          {showNotifsuccess && Notification({
            message: 'Reset link sent! Please check your email inbox.',
            type: 'success'
          })}
        </div>
      </div>
    </div>
  </>
  );
};

export default ForgotPassword;
