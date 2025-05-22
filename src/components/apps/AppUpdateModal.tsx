import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileIcon } from 'lucide-react';
import { updateAppVersion } from '../../lib/supabase';
import { formatFileSize } from '../../utils/formatters';

interface AppUpdateModalProps {
  appId: string;
  currentVersion: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  appId,
  currentVersion,
  onClose,
  onSuccess,
}) => {
  const [version, setVersion] = useState('');
  const [changelog, setChangelog] = useState('');
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!apkFile) {
      setError('APK file is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await updateAppVersion(appId, version, changelog, apkFile);
      
      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update app version');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Update App Version</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                New Version *
              </label>
              <input
                id="version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder={`Current version: ${currentVersion}`}
                required
                className="mt-1 input"
              />
            </div>

            <div>
              <label htmlFor="changelog" className="block text-sm font-medium text-gray-700">
                Changelog *
              </label>
              <textarea
                id="changelog"
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                required
                rows={4}
                className="mt-1 input"
                placeholder="Describe what's new in this version..."
              />
            </div>

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

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
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
                    Updating...
                  </>
                ) : (
                  'Update Version'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateModal;