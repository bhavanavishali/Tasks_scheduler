import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Register from "../pages/Register";
import Login from "../pages/Login"
import Otpverification from "../components/Comman/Otpverification"
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-verification" element={<Otpverification />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};
 
export default AppRoutes;