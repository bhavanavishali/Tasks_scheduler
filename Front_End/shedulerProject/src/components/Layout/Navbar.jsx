import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

const handleLogout = async () => {
    try {
      
      
      await logout();
      
      
      navigate('/login');
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">TaskScheduler</div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-600">
            <Link to="/">TaskScheduler</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              
              <>
                <span className="text-gray-700">
                  Welcome, {user.first_name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              
              <>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;