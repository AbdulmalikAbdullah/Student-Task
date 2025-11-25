
import Nav from "../components/Nav/Nav.jsx"
import Register from "../components/Register/Register.jsx"
import Login from "../components/Login/Login.jsx"
import CoursePage from "../components/CoursePage/CoursePage.jsx"
import Dashboard from "../components/Dashboard/Dashboard.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      {/* <Nav /> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
