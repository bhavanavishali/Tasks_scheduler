// import api from "./api";

// export const createTask = async (taskData) => {
//   try {
//     const response = await api.post('/api/tasks/', taskData);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to create task',
//     };
//   }
// };

// export const getTasks = async () => {
//   try {
//     const response = await api.get('/api/tasks/');
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to get tasks',
//     };
//   }
// };

// export const updateTask = async (taskId, taskData) => {
//   try {
//     const response = await api.patch(`/api/tasks/${taskId}`, taskData);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to update task',
//     };
//   }
// };

// export const deleteTask = async (taskId) => {
//   try {
//     const response = await api.delete(`/api/tasks/${taskId}`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.detail || 'Failed to delete task',
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

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/api/tasks/', taskData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks/');
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.patch(`/api/tasks/${taskId}`, taskData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};