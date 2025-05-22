import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Image, FileIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Category } from '../../types';
import { uploadApp } from '../../lib/supabase';

interface AppUploadFormProps {
  categories: Category[];
}

const AppUploadForm: React.FC<AppUploadFormProps> = ({ categories }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    package_name: '',
    category: '',
  });
  
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);

  const apkDropzone = useDropzone({
    accept: {
      'application/vnd.android.package-archive': ['.apk'],
      'application/java-archive': ['.jar'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setApkFile(acceptedFiles[0]);
    },
  });

  const iconDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setIconFile(acceptedFiles[0]);
    },
  });

  const screenshotDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setScreenshots((prev) => [...prev, ...acceptedFiles].slice(0, 5));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in to upload an app');
      return;
    }

    if (!apkFile) {
      setError('APK file is required');
      return;
    }

    if (!iconFile) {
      setError('App icon is required');
      return;
    }

    if (screenshots.length === 0) {
      setError('At least one screenshot is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const appData = {
        ...formData,
        file_size: apkFile.size,
      };

      const { data, error } = await uploadApp(
        user.id,
        appData,
        apkFile,
        iconFile,
        screenshots
      );

      if (error) throw error;

      navigate(`/app/${data[0].id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">App Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Basic information about your application.
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              App Name *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 input"
              placeholder="My Awesome App"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 input"
              placeholder="Describe your app and its features..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                Version *
              </label>
              <input
                id="version"
                name="version"
                type="text"
                required
                value={formData.version}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="1.0.0"
              />
            </div>
            <div>
              <label htmlFor="package_name" className="block text-sm font-medium text-gray-700">
                Package Name *
              </label>
              <input
                id="package_name"
                name="package_name"
                type="text"
                required
                value={formData.package_name}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="com.example.myapp"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 input"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">App Files</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your APK file, app icon, and screenshots.
          </p>
        </div>
        <div className="px-6 py-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              APK File *
            </label>
            <div 
              {...apkDropzone.getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                apkDropzone.isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              <input {...apkDropzone.getInputProps()} />
              {apkFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileIcon className="h-8 w-8 text-primary-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{apkFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(apkFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setApkFile(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your APK file here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Only .apk files are accepted
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App Icon *
            </label>
            <div 
              {...iconDropzone.getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                iconDropzone.isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              <input {...iconDropzone.getInputProps()} />
              {iconFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden">
                    <img 
                      src={URL.createObjectURL(iconFile)} 
                      alt="App icon preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{iconFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(iconFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIconFile(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload a square icon for your app (512x512px recommended)
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG or JPG up to 2MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshots * (Up to 5)
            </label>
            <div 
              {...screenshotDropzone.getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                screenshotDropzone.isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-500'
              } ${screenshots.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...screenshotDropzone.getInputProps()} />
              <div>
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {screenshots.length >= 5 
                    ? 'Maximum number of screenshots reached' 
                    : 'Drag and drop screenshots here, or click to browse'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG or JPG up to 2MB each (landscape recommended)
                </p>
              </div>
            </div>

            {screenshots.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {screenshots.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-outline mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Upload App
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AppUploadForm;