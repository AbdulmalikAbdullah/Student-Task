import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Notification from "../notification/notification";
import "./Login.css";

function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNotifErr, setShowNotifErr] = useState(false);
    const [showNotifsuccess, setShowNotifsuccess] = useState(false);
    const icon = "../../../assets/navIcon.svg"

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            setShowNotifsuccess(true);
            setTimeout(() => {
                setShowNotifsuccess(false);
                window.location.href = "/dashboard";
            }, 1500);

        } catch (err) {
            setShowNotifErr(true);
            setTimeout(() => setShowNotifErr(false), 2500);
            console.error('login error', err);
        }
    };

    const EyeIcon = "../../../assets/EyeIcon.svg";

    const EyeSlashIcon = "../../../assets/EyeSlashIcon.svg";

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
                        <h2 className="welcomeBack-h2">Welcome Back</h2>
                        <p className="welcomeBack-p">Enter your name, email and password to access your account</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="loginBox">

                            <label className="label-email">Email</label>
                            <input
                                className="input-email"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />

                            <label className="label-pass">Password</label>

                            <div className="password-wrapper">
                                <input
                                    className="input-pass"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="toggle-pass"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (<img src={EyeIcon} alt="EyeIcon" />) : (<img src={EyeSlashIcon} alt="EyeSlashIcon" />)}
                                </span>
                            </div>
                            <p>
                                <Link to="/#">Forgot Password</Link>
                            </p>
                            <button className="login-button" type="submit">Login</button>

                            {showNotifErr && Notification({ message: 'Login failed! Please check your credentials.', type: 'error' })}

                            {showNotifsuccess && Notification({ message: 'Login successful! Redirecting...', type: 'success' })}

                        </div>
                    </form>
                    <div className="footer">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Login;
