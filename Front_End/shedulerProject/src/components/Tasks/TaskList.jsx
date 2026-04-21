
import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { updateTask, deleteTask } from '../../services/task_api';
import Swal from 'sweetalert2';  

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // const handleDelete = async (taskId) => {
  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel'
  //   });

  //   if (result.isConfirmed) {
  //     const deleteResult = await deleteTask(taskId);
  //     if (deleteResult.success) {
      
  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Deleted!',
  //         text: 'Task has been deleted.',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
        
  //       onTaskDelete(taskId);
  //     } else {
  //       // Show error message
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Error!',
  //         text: deleteResult.message || 'Failed to delete task',
  //         confirmButtonText: 'OK'
  //       });
  //     }
  //   }
  // };
const handleDelete = async (taskId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    // 🔥 call parent
    await onTaskDelete(taskId);

    await Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Task has been deleted.',
      timer: 1500,
      showConfirmButton: false
    });
  }
};
  const handleToggleComplete = async (task) => {
    const result = await updateTask(task.id, { is_completed: !task.is_completed });
    
    if (result.success) {
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: task.is_completed ? 'Task marked as pending' : 'Task marked as completed!',
        showConfirmButton: false,
        timer: 1500
      });
      
      onTaskUpdate();
    } else {
      // Show error message
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: result.message || 'Failed to update task',
        confirmButtonText: 'OK'
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.due_date === dueDate)?.is_completed;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Create your first task!
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-lg shadow-sm border ${
                task.is_completed ? 'border-green-200 bg-green-50' : 
                isOverdue(task.due_date) ? 'border-red-200 bg-red-50' : 
                'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => handleToggleComplete(task)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                    />
                    <h3 className={`font-medium ${
                      task.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                  </div>
                  
                  <p className={`mt-2 text-sm ${
                    task.is_completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap items-center space-x-4 text-xs text-gray-500">
                    <span>Created: {formatDate(task.creation_datetime)}</span>
                    <span className={`${
                      isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''
                    }`}>
                      Due: {formatDate(task.due_date)}
                    </span>
                    {task.is_completed && (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <TaskForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={onTaskUpdate}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={onTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskList;

