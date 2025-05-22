import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import AppUploadForm from '../components/apps/AppUploadForm';

const UploadPage = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { categories, loadCategories } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/upload');
      return;
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign in Required</h2>
          <p className="mt-2 text-gray-600">
            You need to be signed in to upload applications.
          </p>
          <button
            onClick={() => navigate('/login?redirect=/upload')}
            className="mt-4 btn-primary"
          >
            Sign in to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Application</h1>
        <p className="mt-2 text-gray-600">
          Share your mobile application with users around the world.
        </p>
      </div>

      <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
        <ShieldAlert className="h-6 w-6 text-blue-500 mt-0.5 mr-3" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Developer Guidelines
          </p>
          <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
            <li>Ensure your app complies with our platform policies and guidelines</li>
            <li>Provide accurate information about your application</li>
            <li>Upload high-quality screenshots that accurately represent your app</li>
            <li>Test your APK thoroughly before uploading</li>
            <li>Do not upload malicious software or apps that violate copyright laws</li>
          </ul>
        </div>
      </div>

      <AppUploadForm categories={categories} />
    </div>
  );
};

export default UploadPage;