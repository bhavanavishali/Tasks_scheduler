


import { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from "../services/auth_api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();  

  const from = location.state?.from?.pathname || '/dashboard';
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginUser(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating...');
        login(result.data.user);  
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result.message);
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
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