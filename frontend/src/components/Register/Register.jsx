import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Notification from "../notification/notification";
import "./Register.css";

function Register() {
    const { register } = useContext(AuthContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNotifErr, setShowNotifErr] = useState(false);
    const [showNotifsuccess, setShowNotifsuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        const fullName = `${firstName} ${lastName}`;

        try {
            await register({ displayName: fullName, email, password });
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

    const EyeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" style={{ marginTop: "5px" }}>
            <path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5zM286 196.6C296.8 193.6 308.2 192.1 319.9 192.1C328.7 192.1 337.4 193 345.7 194.7C346 194.8 346.2 194.8 346.5 194.9C404.4 207.1 447.9 258.6 447.9 320.1C447.9 390.8 390.6 448.1 319.9 448.1C258.3 448.1 206.9 404.6 194.7 346.7C192.9 338.1 191.9 329.2 191.9 320.1C191.9 309.1 193.3 298.3 195.9 288.1C196.1 287.4 196.2 286.8 196.4 286.2C208.3 242.8 242.5 208.6 285.9 196.7z" fill="#ffffffff" />
        </svg>
    );

    const EyeSlashIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" style={{ marginTop: "5px" }}>
            <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM120 221.9C110.6 212.5 95.4 212.5 86.1 221.9C76.8 231.3 76.7 246.5 86.1 255.8L360.2 530C369.6 539.4 384.8 539.4 394.1 530C403.4 520.6 403.5 505.4 394.1 496.1L120 221.9zM77.7 315.3C68.3 305.9 53.1 305.9 43.8 315.3C34.5 324.7 34.4 339.9 43.8 349.2L213.9 519.5C223.3 528.9 238.5 528.9 247.8 519.5C257.1 510.1 257.2 494.9 247.8 485.6L77.7 315.3z" fill="#ffffffff" />
        </svg>
    );

    return (
        <>
            <h2 className="welcome-h2">Welcome to Tasky</h2>

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
                            {showPassword ? EyeSlashIcon : EyeIcon}
                        </span>
                    </div>

                    <p>
                        Already a member?{" "}
                        <Link to="/">Login</Link>
                    </p>

                    <button className="register-button" type="submit">
                        Register
                    </button>


                    {showNotifErr && Notification({ message: 'Registration failed! Please try again.', type: 'error' })}

                    {showNotifsuccess && Notification({ message: 'Registration successful! Redirecting...', type: 'success' })}

                </div>
            </form>
        </>
    );
}

export default Register;
