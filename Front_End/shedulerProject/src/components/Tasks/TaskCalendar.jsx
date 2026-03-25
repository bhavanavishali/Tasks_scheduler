



import React, { useState } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TaskCalendar = ({ tasks, onTaskUpdate, onTaskDelete, onTaskEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date).toDateString();
      const calendarDate = date.toDateString();
      return taskDate === calendarDate;
    });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    dayNames.forEach(day => {
      days.push(
        <div key={day} className="text-center font-semibold text-gray-600 py-2">
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className={`border rounded-lg p-2 min-h-[80px] ${
            isToday ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
          }`}
        >
          <div className="font-semibold text-sm mb-1">{day}</div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                  task.is_completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div 
                className="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => {
                  // Show first task from remaining tasks
                  handleTaskClick(dayTasks[2]);
                }}
              >
                +{dayTasks.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {showModal && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleCloseModal}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
        />
      )}
    </>
  );
};

export default TaskCalendar;