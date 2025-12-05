import Register from "../components/Register/Register.jsx"
import Login from "../components/Login/Login.jsx"
import CoursePage from "../components/CoursePage/CoursePage.jsx"
import Dashboard from "../components/Dashboard/Dashboard.jsx"
import VerifyEmail from "../components/VerifyEmail/VerifyEmail.jsx"
import ForgotPassword from "../components/ForgetPassword/ForgetPassword.jsx"
import ResetPassword from "../components/ResetPassword/ResetPassword.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
