import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Notification from "../notification/notification";
import "./Register.css";
import "../Login/Login.css";

function Register() {
    const { register } = useContext(AuthContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNotifErr, setShowNotifErr] = useState(false);
    const [showNotifsuccess, setShowNotifsuccess] = useState(false);
    const icon = "../../../assets/navIcon.svg"

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register({ firstName, lastName, email, password });
            setShowNotifsuccess(true);
            setTimeout(() => {
                setShowNotifsuccess(false);
                window.location.href = "/dashboard";
            }, 1500);
        } catch (err) {
            setShowNotifErr(true);
            setTimeout(() => setShowNotifErr(false), 2500);
            console.error('register error', err);

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
                        <h2 className="welcomeBack-h2">Welcome To Student Task</h2>
                        <p className="welcomeBack-p">Enter your email and password to access your account</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="registerBox">

                            <label className="label-Name">Name</label>
                            <div className="nameBox">
                                <input
                                    className="input-fname"
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value); }}
                                    required
                                />
                                <input
                                    className="input-lname"
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value); }}
                                    required
                                />
                            </div>

                            <label className="label-email">Email</label>
                            <input
                                className="input-email"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); }}
                                required
                            />

                            <label className="label-pass">Password</label>
                            <div className="password-wrapper">
                                <input
                                    className="input-pass"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); }}
                                    required
                                />

                                <span
                                    className="toggle-pass"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (<img src={EyeIcon} alt="EyeIcon" />) : (<img src={EyeSlashIcon} alt="EyeSlashIcon" />)}
                                </span>
                            </div>


                            <button className="register-button" type="submit">
                                Register
                            </button>


                            {showNotifErr && Notification({ message: 'Registration failed! Please try again.', type: 'error' })}

                            {showNotifsuccess && Notification({ message: 'Registration successful! Redirecting...', type: 'success' })}

                        </div>
                    </form>
                    <div className="footer">
                        <p>
                            Already a member?{" "}
                            <Link to="/">Login</Link>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Register;
