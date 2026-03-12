import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import { verifyOTP } from "../../services/auth_api";

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
 
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Sending:", { email, otp });
      const result = await verifyOTP(email, otp);
      console.log("Response:", result);
      if (result.success) {
        navigate("/login");
        
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <form onSubmit={handleVerify} className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center mb-6">Verify OTP</h2>
          <p className="text-gray-400 text-center mb-6">Enter the OTP sent to {email}</p>
          
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            maxLength={6}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
          
          {message && <p className="text-red-400 text-center mt-4">{message}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
}
export default OtpVerification;

