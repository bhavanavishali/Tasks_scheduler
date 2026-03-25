import api from "./api";

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/api/tasks/', taskData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to create task',
    };
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to get tasks',
    };
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.patch(`/api/tasks/${taskId}`, taskData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to update task',
    };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to delete task',
    };
  }
};