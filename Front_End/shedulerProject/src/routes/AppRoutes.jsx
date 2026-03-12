import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Register from "../pages/Register";
import Login from "../pages/Login"
import Otpverification from "../components/Comman/Otpverification"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path ="otp-verification" element={<Otpverification/>}/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;