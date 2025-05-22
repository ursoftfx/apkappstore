import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type AuthMode = 'login' | 'register';

const AuthPage = () => {
  const { user, login, register, error, clearError, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  useEffect(() => {
    // Determine auth mode based on the route
    setMode(location.pathname === '/register' ? 'register' : 'login');
    
    // Clear any previous errors when switching modes
    clearError();
  }, [location.pathname, clearError]);
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
      navigate(redirectTo);
    }
  }, [user, navigate, location.search]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await login(formData.email, formData.password);
    } else {
      await register(formData.email, formData.password, formData.fullName);
      // After successful registration, switch to login mode for user to sign in
      if (!error) {
        setMode('login');
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Or{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  create a new account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 input"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 input"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 input"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : mode === 'login' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;