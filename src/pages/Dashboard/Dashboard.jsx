import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import LocalTasks from '../LocalTasks/LocalTasks';
import ApiTasks from '../ApiTasks/ApiTasks';
import Button from '../../components/Button';
import { 
  FaTasks, 
  FaServer, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaUser
} from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (location.pathname === '/dashboard') {
  //     navigate('/dashboard/local', { replace: true });
  //   }
  // }, [location.pathname, navigate]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      path: '/dashboard/local',
      name: 'Local Tasks',
      icon: <FaTasks className="w-5 h-5" />
    },
    {
      path: '/dashboard/api',
      name: 'API Tasks',
      icon: <FaServer className="w-5 h-5" />
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gradient-to-b from-purple-700 to-[#9661bf]">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-800 shadow-md'
                      : 'text-purple-100 hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-purple-600 p-4">
            <div className="flex items-center w-full">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 text-white">
                    <FaUser className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex items-center text-sm font-medium text-purple-200 hover:text-white transition-colors duration-200"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0">
            <div 
              className="absolute inset-0 bg-gray-600 opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </div>
          <div className="relative flex-1 flex flex-col w-64 max-w-xs pt-5 pb-4 bg-gradient-to-b from-purple-700 to-purple-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <FaTimes className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-white">Task Manager</h1>
            </div>
            <div className="mt-8 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg w-full transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-purple-100 text-purple-800 shadow-md'
                        : 'text-purple-100 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-purple-600 p-4">
              <div className="flex items-center w-full">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 text-white">
                      <FaUser className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto flex items-center text-sm font-medium text-purple-200 hover:text-white transition-colors duration-200"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {location.pathname === '/dashboard/local' && 'Local Tasks'}
                {location.pathname === '/dashboard/api' && 'API Tasks'}
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="hidden md:flex items-center">
                <span className="text-gray-700 mr-4">Welcome, {user?.username}</span>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleLogout}
                  className="flex items-center bg-purple-600 hover:bg-purple-700"
                >
                  <FaSignOutAlt className="mr-2 w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
              <Routes>
  <Route index element={<Navigate to="local" replace />} />
  <Route path="local" element={<LocalTasks />} />
  <Route path="api" element={<ApiTasks />} />
</Routes>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;