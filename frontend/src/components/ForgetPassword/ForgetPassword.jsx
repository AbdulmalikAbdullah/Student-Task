import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Login/Login.css";
import "./ForgetPassword.css"
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const icon = "../../../assets/navIcon.svg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/forgot-password`, { email });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error sending reset link");
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
        <div className="forget-box">
          <form onSubmit={handleSubmit}>
            <input
              className="input-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="register-button" type="submit">Send Reset Link</button>
          </form>
        </div>
        <div className="message">
          <p>
            I have remember my password!{" "}
            <Link to="/">Login</Link>
          </p>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  </>
  );
};

export default ForgotPassword;
