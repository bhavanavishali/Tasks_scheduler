import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { loginUser } from "../services/auth_api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await loginUser(formData);
      if (result.success) {
        navigate("/dashboard"); // Redirect to dashboard or home
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: "Login failed. Please try again" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
      <div className="flex flex-1 items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          
          {errors.submit && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {errors.submit}
            </div>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            required
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          
          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
      
    </div>
  );
}

export default Login;