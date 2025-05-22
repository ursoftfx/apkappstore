import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Upload, Search, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import AppGrid from '../components/apps/AppGrid';

const HomePage = () => {
  const { apps, isLoading, fetchApps, setFilters } = useAppStore();
  
  useEffect(() => {
    setFilters({ sortBy: 'popular' });
  }, [setFilters]);

  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Discover and share amazing mobile applications
              </h1>
              <p className="text-lg md:text-xl text-primary-100">
                A platform for developers to distribute their apps and for users to find and download the latest mobile software.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/apps"
                  className="btn bg-white text-primary-700 hover:bg-primary-50"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Apps
                </Link>
                <Link
                  to="/upload"
                  className="btn bg-secondary-500 text-white hover:bg-secondary-600"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload App
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Mobile devices with apps"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature blocks */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Your Go-To Platform for Mobile Apps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              APK Store offers a comprehensive ecosystem for discovering, sharing, and downloading mobile applications.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Discover Apps
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Browse through our extensive collection of applications across various categories.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Download with Ease
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Quickly download apps directly to your device with just a single click.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto bg-accent-100 text-accent-600 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Share Your Creations
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Are you a developer? Upload and distribute your applications to a global audience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular apps section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-accent-500" />
              Popular Apps
            </h2>
            <Link
              to="/apps"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          <AppGrid apps={apps.slice(0, 5)} isLoading={isLoading} />
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to share your app with the world?
          </h2>
          <p className="mt-4 text-lg text-secondary-100 max-w-2xl mx-auto">
            Join thousands of developers who distribute their applications through our platform.
          </p>
          <div className="mt-8">
            <Link
              to="/upload"
              className="btn bg-white text-secondary-700 hover:bg-secondary-50"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Your App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;