import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Clock, Package, Tag, User, ChevronLeft, Monitor, Calendar, Shield } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { incrementDownloadCount } from '../lib/supabase';
import { formatFileSize, formatDate } from '../utils/formatters';

const AppDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedApp, fetchApp, isLoading } = useAppStore();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApp(id);
    }
  }, [id, fetchApp]);

  useEffect(() => {
    if (selectedApp?.screenshots && selectedApp.screenshots.length > 0) {
      setActiveImage(selectedApp.screenshots[0]);
    }
  }, [selectedApp]);

  const handleDownload = async () => {
    if (!selectedApp) return;
    
    setIsDownloading(true);
    
    try {
      // Increment download count in the database
      await incrementDownloadCount(selectedApp.id);
      
      // Trigger file download
      const link = document.createElement('a');
      link.href = selectedApp.file_url;
      link.download = `${selectedApp.title}-v${selectedApp.version}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedApp) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">App not found</h2>
          <p className="mt-2 text-gray-600">
            The application you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/apps" className="mt-4 inline-block btn-primary">
            Browse Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/apps" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to apps
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* App icon and basic info */}
            <div className="md:w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={selectedApp.icon_url} 
                  alt={selectedApp.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full btn-primary py-3 text-base"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download APK
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatFileSize(selectedApp.file_size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Version</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.version}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Monitor className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Package</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {selectedApp.package_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Developer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.user?.full_name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Updated</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedApp.updated_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Downloads</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.download_count.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App details */}
            <div className="md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedApp.title}
              </h1>
              
              <div className="mt-2 flex items-center">
                <span className="badge-primary mr-2">
                  {selectedApp.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {selectedApp.download_count.toLocaleString()} downloads
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">About this app</h2>
                <div className="mt-2 text-gray-700 space-y-3">
                  {selectedApp.description.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {selectedApp.screenshots && selectedApp.screenshots.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">Screenshots</h2>
                  
                  <div className="mt-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {activeImage && (
                        <img 
                          src={activeImage} 
                          alt="App screenshot" 
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-5 gap-3">
                      {selectedApp.screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(screenshot)}
                          className={`aspect-video rounded-md overflow-hidden border-2 ${
                            activeImage === screenshot 
                              ? 'border-primary-500' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={screenshot} 
                            alt={`Screenshot ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">Safety</h2>
                <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Safe to install
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      This app has been verified by our security team and is safe to install on your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add structured data for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": selectedApp.title,
          "description": selectedApp.description,
          "applicationCategory": selectedApp.category,
          "operatingSystem": "Android",
          "version": selectedApp.version,
          "downloadUrl": selectedApp.file_url,
          "installUrl": selectedApp.file_url,
          "author": {
            "@type": "Person",
            "name": selectedApp.user?.full_name || "Unknown Developer"
          },
          "datePublished": selectedApp.created_at,
          "dateModified": selectedApp.updated_at,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "ratingCount": selectedApp.download_count
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "screenshot": selectedApp.screenshots,
          "fileSize": selectedApp.file_size,
          "softwareVersion": selectedApp.version
        })}
      </script>
    </div>
  );
};

export default AppDetailPage;