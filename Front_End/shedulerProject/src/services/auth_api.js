

import api from "./api";

// Consistent wrapper that always returns { success, data?, message? }
const handleResponse = (response) => {
  // Backend returns { status: "success"|"error", message, ...data }
  if (response.data.status === "success") {
    return { success: true, data: response.data };
  } else {
    return { success: false, message: response.data.message };
  }
};

const handleError = (error) => {
  return {
    success: false,
    message: error.response?.data?.detail || error.response?.data?.message || 'Request failed'
  };
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const requestLoginOTP = async (email) => {
  try {
    const response = await api.post('/request-login-otp', { email });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const verifyLoginOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-login-otp', { email, otp });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};