import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    setDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Logo/App name */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">Duty Tracker</Link>
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className={`px-3 py-2 font-medium text-sm transition-colors duration-200 relative ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Duties
            {location.pathname === '/' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </Link>
        </div>

        {/* Right side - Auth logic */}
        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdown((d) => !d)}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  {user.email[0].toUpperCase()}
                </span>
                {/* Email hidden: <span className="hidden sm:inline text-gray-700 font-medium">{user.email}</span> */}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 