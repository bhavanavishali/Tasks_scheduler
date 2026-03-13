import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { getCurrentUser } from "../services/auth_api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finish FastAPI Login", status: "Pending", date: "2026-03-13" },
    { id: 2, title: "Create Task API", status: "Completed", date: "2026-03-12" },
    { id: 3, title: "React Dashboard UI", status: "In Progress", date: "2026-03-14" },
  ]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
    
    const loadUserInfo = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Failed to load user info');
      }
    };
    
    loadUserInfo();
  }, []);
    


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
         
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {user?.first_name || "User"}! 👋
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your tasks today.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Task
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Export
                </button>
              </div>
            </div>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-blue-600 text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === "Completed").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <span className="text-yellow-600 text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === "In Progress").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <span className="text-red-600 text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === "Pending").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {tasks
                .filter(task => {
                  if (filter === "all") return true;
                  return task.status === filter;
                })
                .filter(task => 
                  task.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            task.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-gray-500 text-sm">{task.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default Dashboard;