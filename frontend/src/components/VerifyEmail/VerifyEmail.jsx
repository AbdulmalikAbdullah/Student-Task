import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login/Login.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = query.get("token");
    const email = query.get("email");

    if (!token || !email) {
      setMessage("Invalid verification link");
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/auth/verify-email`, {
      params: { token, email }
    })
      .then(res => {
        setMessage(res.data.msg);
        setTimeout(() => navigate("/login"), 3000); // Redirect to login
      })
      .catch(err => {
        setMessage(err.response?.data?.msg || "Verification failed");
      });
  }, [query, navigate]);

  return (
    <>
      <div className="container">
        <div className="background-container"></div>

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>{message}</h2>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
