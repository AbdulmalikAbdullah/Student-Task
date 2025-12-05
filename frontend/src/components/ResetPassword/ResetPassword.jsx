import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../notification/notification";
import axios from "axios";
import "./ResetPassword.css"
import "../Login/Login.css";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNotifErr, setShowNotifErr] = useState(false);
    const [showNotifsuccess, setShowNotifsuccess] = useState(false);
    const icon = "../../../assets/navIcon.svg";
    const EyeIcon = "../../../assets/EyeIcon.svg";
    const EyeSlashIcon = "../../../assets/EyeSlashIcon.svg";

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = query.get("token");
        const email = query.get("email");

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/reset-password`, {
                token,
                email,
                newPassword
            });
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
                    <h2 className="welcomeBack-h2">Reset Password</h2>
                    <p className="welcomeBack-p">Enter your email, forget password like will be send</p>
                </div>
                <div className="reset-box">
                    <form onSubmit={handleSubmit}>
                        <div className="password-wrapper">

                            <input
                                className="input-pass"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <span
                                className="toggle-pass"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (<img src={EyeIcon} alt="EyeIcon" />) : (<img src={EyeSlashIcon} alt="EyeSlashIcon" />)}
                            </span>


                        </div>
                        <button className="register-button" type="submit">Reset Password</button>
                    </form>



                    {showNotifErr && Notification({
                        message: 'Password reset failed! The link may be invalid or expired.',
                        type: 'error'
                    })}

                    {showNotifsuccess && Notification({
                        message: 'Password reset successful! You can now sign in with your new password.',
                        type: 'success'
                    })}
                </div>
            </div>
        </div >
    </>
    );
};

export default ResetPassword;
