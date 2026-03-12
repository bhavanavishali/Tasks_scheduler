import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">

      <Navbar />

      <div className="flex flex-1 items-center justify-center">

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
        >

          <h2 className="text-3xl font-bold text-center mb-6">
            Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <button
            className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>

        </form>

      </div>

      <Footer />

    </div>
  );
}

export default Login;