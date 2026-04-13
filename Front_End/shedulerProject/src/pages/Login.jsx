



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
  
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
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

  // const handleRequestOTP = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setErrors({});

  //   try {
  //     const result = await requestLoginOTP(formData.email);
      
  //     if (result.success) {
  //       setLoginStep('verify-otp');
  //       setErrors({ submit: result.data.message || 'OTP sent to your email' });
  //     } else {
  //       setErrors({ submit: result.message });
  //     }
  //   } catch (error) {
  //     console.error('OTP request error:', error);
  //     setErrors({ submit: 'Failed to send OTP. Please try again.' });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleRequestOTP = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});
 
  try {
    const result = await requestLoginOTP(formData.email);
    
    if (result.success) {
      setLoginStep('verify-otp');
      setErrors({ submit: result.data.message || 'OTP sent to your email' });
      
      // Set 5-minute expiration timer (300 seconds)
      setOtpExpiresIn(300);
      setResendTimer(60); // Resend cooldown
      
      // Start expiration countdown
      const expireTimer = setInterval(() => {
        setOtpExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(expireTimer);
            setErrors({ submit: 'OTP expired. Please request a new one.' });
            setLoginStep('initial');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Start resend cooldown
      const resendCooldown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(resendCooldown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
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
const handleResendOTP = async () => {
  setResendLoading(true);
  setErrors({});
  
  try {
    const result = await requestLoginOTP(formData.email);
    if (result.success) {
      setErrors({ submit: 'OTP resent successfully!' });
      
      // Reset timers
      setOtpExpiresIn(300);
      setResendTimer(60);
      
      // Start new expiration timer
      const expireTimer = setInterval(() => {
        setOtpExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(expireTimer);
            setErrors({ submit: 'OTP expired. Please request a new one.' });
            setLoginStep('initial');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Start new resend cooldown
      const resendCooldown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(resendCooldown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } else {
      setErrors({ submit: result.message || 'Failed to resend OTP' });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    setErrors({ submit: 'Failed to resend OTP. Please try again.' });
  } finally {
    setResendLoading(false);
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

              {/* {loginStep === 'verify-otp' && (
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
              )} */}

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
      className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600 disabled:opacity-50 mb-4 transition-colors"
    >
      {isLoading ? "Verifying..." : "Verify OTP"}
    </button>
    
    {/* Timer Display */}
    {resendTimer > 0 && (
      <div className="text-center mb-4">
        <p className="text-yellow-400 text-sm">
          OTP expires in <span className="font-bold">{resendTimer}</span> seconds
        </p>
      </div>
    )}
    
    {/* Resend OTP Button */}
    <button
      type="button"
      onClick={handleResendOTP}
      disabled={resendLoading || resendTimer > 0}
      className="w-full bg-green-600 p-3 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {resendLoading 
        ? "Sending..." 
        : resendTimer > 0 
          ? `Resend OTP in ${resendTimer}s` 
          : "Resend OTP"
      }
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