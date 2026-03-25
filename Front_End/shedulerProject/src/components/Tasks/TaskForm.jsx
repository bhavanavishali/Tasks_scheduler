// import React, { useState } from 'react';
// import { createTask, updateTask } from '../../services/task_api';
// import Swal from 'sweetalert2'
// import { useNavigate } from 'react-router-dom';

// const TaskForm = ({ task, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     title: task?.title || '',
//     description: task?.description || '',
    
//     due_date: task?.due_date || '',
//     is_completed: task?.is_completed || false
//   });
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.description || !formData.due_date) {
//       setErrors({ submit: 'Please fill all required fields' });
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       const taskData = {
//         ...formData,
//         creation_datetime: new Date(formData.creation_datetime).toISOString(),
//         due_date: new Date(formData.due_date).toISOString()
//       };

//       let result;
//       if (task) {
//         result = await updateTask(task.id, taskData);
//       } else {
//         result = await createTask(taskData);
//       }

//       if (result.success) {

//         await Swal.fire({
//           icon: 'success',
//           title: task ? 'Task Updated!' : 'Task Created!',
//           text: task ? 'Task has been updated successfully.' : 'Task has been created successfully.',
//           showConfirmButton: false,
//           timer: 1500
//         });
        
//         onSuccess();
//          onClose();
//         if (!task) {
//           navigate('/dashboard');
//         } else {
          
         
//         }
//       } else {
//         setErrors({ submit: result.message });
//       }
//     } catch (error) {
//       setErrors({ submit: 'An error occurred' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">
//           {task ? 'Edit Task' : 'Create New Task'}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter task title"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter task description"
//             />
//           </div>

   

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
//             <input
//               type="datetime-local"
//               name="due_date"
//               value={formData.due_date}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="is_completed"
//               id="is_completed"
//               checked={formData.is_completed}
//               onChange={handleChange}
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded"
//             />
//             <label htmlFor="is_completed" className="ml-2 text-sm text-gray-700">
//               Mark as completed
//             </label>
//           </div>

//           {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : (task ? 'Update' : 'Create')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskForm;


import React, { useState } from 'react';
import { createTask, updateTask } from '../../services/task_api';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ task, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date || '',
    is_completed: task?.is_completed || false
  });
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.due_date) {
      setErrors({ submit: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        due_date: new Date(formData.due_date).toISOString(),
        is_completed: formData.is_completed,
        priority: "medium",
        tags: []
      };

      let result;
      if (task) {
        result = await updateTask(task.id, taskData);
      } else {
        result = await createTask(taskData);
      }

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: task ? 'Task Updated!' : 'Task Created!',
          text: task ? 'Task has been updated successfully.' : 'Task has been created successfully.',
          showConfirmButton: false,
          timer: 1500
        });
        
        onSuccess();
        onClose();
        if (!task) {
          navigate('/dashboard');
        }
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_completed"
              id="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="is_completed" className="ml-2 text-sm text-gray-700">
              Mark as completed
            </label>
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (task ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;