import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { FaUser, FaLock, FaSignInAlt, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

import loginImage from '../../assets/images/login.jpg';
import { login } from '../../redux/actions/authActions';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data.username, data.password));
    } catch (err) {
      Swal.fire({
        title: 'Login Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#8B5CF6',
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back!',
        icon: 'success',
        confirmButtonText: 'Continue to Dashboard',
        confirmButtonColor: '#8B5CF6',
      }).then(() => {
        navigate('/dashboard');
      });
    }
    
    if (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error || 'Invalid username or password',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#8B5CF6',
      });
    }
  }, [isAuthenticated, error, navigate]);

  return (
    <>
      <Helmet>
        <title>Login | Management System</title>
        <meta
          name="description"
          content="Login to Management System - Comprehensive dashboard for website content management, reports, and statistics."
        />
        <meta
          name="keywords"
          content="login, management system, dashboard, content management"
        />
      </Helmet>

      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div 
          className="w-full md:w-1/2 relative min-h-[400px] md:min-h-screen"
          style={{
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-800/50"></div>
          
         
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="text-left mb-10">
              <h2 className="text-5xl font-bold text-gray-800">Welcome Back</h2>
              <p className="mt-4 text-lg text-gray-600">Sign in to access your account</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your username"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

          
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 shadow-md hover:shadow-lg ${
                    !isValid || loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign In
                      <FaSignInAlt className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>

        
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;