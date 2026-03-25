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

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Login failed',
    };
  }
};
 
export const logoutUser = async () => {
  try {
    const response = await api.post('/logout'); 
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Logout failed',
    };
  }
};


export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to get user info',
    };
  }
};


export const requestLoginOTP = async (email) => {
  try {
    const response = await api.post('/request-login-otp', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to send OTP',
    };
  }
};

export const verifyLoginOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-login-otp', { email, otp });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'OTP verification failed',
    };
  }
};