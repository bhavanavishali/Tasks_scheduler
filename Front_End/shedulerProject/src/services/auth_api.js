// import api from "./api";

// export const registerUser = async (userData) => {
//   try {
//     const response = await api.post("/register", userData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const verifyOTP = async (email, otp) => {
//   try {
//     const response = await api.post('/verify-otp', { email, otp });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.message || 'OTP verification failed',
//     };
//   }
// };

// export const loginUser = async (credentials) => {
//   try {
//     const response = await api.post('/login', credentials);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Login failed',
//     };
//   }
// };
 
// export const logoutUser = async () => {
//   try {
//     const response = await api.post('/logout'); 
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Logout failed',
//     };
//   }
// };


// export const getCurrentUser = async () => {
//   try {
//     const response = await api.get('/me');
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to get user info',
//     };
//   }
// };


// export const requestLoginOTP = async (email) => {
//   try {
//     const response = await api.post('/request-login-otp', { email });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to send OTP',
//     };
//   }
// };

// export const verifyLoginOTP = async (email, otp) => {
//   try {
//     const response = await api.post('/verify-login-otp', { email, otp });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'OTP verification failed',
//     };
//   }
// };


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