


// import { useState } from "react";
// import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext';
// import { loginUser } from "../services/auth_api";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, login } = useAuth();  
//   console.log('Current user state:', user);  
//   const from = location.state?.from?.pathname || '/dashboard';
  
//   if (user) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Form submitted with:', formData);
    
//     setIsLoading(true);
//     setErrors({});

//     try {
//           console.log('Before login - user:', user);
    
//     console.log('After login - user:', user); 
//       const result = await loginUser(formData);
//       console.log('Login result:', result);
      
//       if (result.success) {
//         console.log('Login successful, navigating...');
//         login(result.data.user);  
//         navigate('/dashboard');
//       } else {
//         console.log('Login failed:', result.message);
//         setErrors({ submit: result.message });
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setErrors({ submit: 'Login failed. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
//       <div className="flex flex-1 items-center justify-center">
//         <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
//           <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          
//           {errors.submit && (
//             <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
//               {errors.submit}
//             </div>
//           )}
          
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
//             required
//           />
          
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
//             required
//           />
          
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
          
//           <p className="text-gray-400 text-center mt-4">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-blue-400 hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
      
//     </div>
//   );
// }

// export default Login;



import { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { loginUser, requestLoginOTP, verifyLoginOTP } from "../services/auth_api";

function Login() {
  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'otp'
  const [loginStep, setLoginStep] = useState('initial'); // 'initial' or 'verify-otp'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: ""
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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginUser({ email: formData.email, password: formData.password });
      
      if (result.success) {
        login(result.data.user);
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await requestLoginOTP(formData.email);
      
      if (result.success) {
        setLoginStep('verify-otp');
        setErrors({ submit: result.data.message || 'OTP sent to your email' });
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('OTP request error:', error);
      setErrors({ submit: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await verifyLoginOTP(formData.email, formData.otp);
      
      if (result.success) {
        login(result.data.user);
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ submit: 'OTP verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method);
    setLoginStep('initial');
    setFormData({ email: "", password: "", otp: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          
          {/* Auth Method Toggle */}
          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => switchAuthMethod('password')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                authMethod === 'password' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => switchAuthMethod('otp')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                authMethod === 'otp' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              OTP
            </button>
          </div>

          {errors.submit && (
            <div className={`${
              errors.submit.includes('sent') ? 'bg-green-500' : 'bg-red-500'
            } text-white p-3 rounded mb-4 text-center text-sm`}>
              {errors.submit}
            </div>
          )}

          {/* Password Login Form */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
              
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Logging in..." : "Login with Password"}
              </button>
            </form>
          )}

          {/* OTP Login Form */}
          {authMethod === 'otp' && (
            <>
              {loginStep === 'initial' && (
                <form onSubmit={handleRequestOTP}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {loginStep === 'verify-otp' && (
                <form onSubmit={handleVerifyOTP}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                    disabled
                  />
                  
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    maxLength="6"
                    required
                    autoFocus
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50 mb-2 transition-colors"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setLoginStep('initial')}
                    className="w-full bg-gray-600 p-3 rounded hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                </form>
              )}
            </>
          )}
          
          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;