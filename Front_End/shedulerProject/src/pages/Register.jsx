import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { registerUser } from "../services/auth_api";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await registerUser({
  first_name: formData.firstName,
  last_name: formData.lastName,
  email: formData.email,
  password: formData.password,
  confirm_password: formData.confirmPassword 
});
console.log("FULL RESULT:", result);
console.log("STATUS:", result.status);
console.log("MESSAGE:", result.message);

       if (result.success){
        console.log("REGISTER RESULT:", result.data);
        navigate("/otp-verification", { state: { email: formData.email } });
      } else {
        setErrors({ submit: result.message });
      }   
    } catch (error) {
      console.log(error.response);
      setErrors({ submit: error.response?.data?.detail || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h2>

          {errors.submit && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {errors.submit}
            </div>
          )}

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded bg-gray-700 border focus:outline-none ${
              errors.firstName ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.firstName && <p className="text-red-400 text-sm mb-2">{errors.firstName}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded bg-gray-700 border focus:outline-none ${
              errors.lastName ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.lastName && <p className="text-red-400 text-sm mb-2">{errors.lastName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded bg-gray-700 border focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded bg-gray-700 border focus:outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.password && <p className="text-red-400 text-sm mb-2">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded bg-gray-700 border focus:outline-none ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm mb-2">{errors.confirmPassword}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
      
    </div>
  );
}

export default Register;