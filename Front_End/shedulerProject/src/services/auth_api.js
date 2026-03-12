import api from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
};
 
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'OTP verification failed',
    };
  }
};