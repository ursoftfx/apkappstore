import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Settings, LogOut, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { fetchUserApps } from '../lib/supabase';
import { AppDetails } from '../types';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user, logout, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [userApps, setUserApps] = useState<AppDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/profile');
      return;
    }

    const loadUserApps = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await fetchUserApps(user.id);
        if (error) throw error;
        setUserApps(data as AppDetails[]);
      } catch (error) {
        console.error('Failed to load user apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserApps();
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32 md:h-48"></div>
        <div className="px-6 py-6 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 -mt-16 md:-mt-24">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-white p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-12 w-12 md:h-16 md:w-16 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-6 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.full_name || 'User'}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {formatDate(user.created_at)}
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
            <button className="btn-outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button onClick={() => logout()} className="btn-outline text-red-600 hover:text-red-700 hover:border-red-300">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* My apps section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            My Applications
          </h2>
          <button 
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            <Package className="h-4 w-4 mr-2" />
            Upload New App
          </button>
        </div>

        {userApps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-500">
              You haven't uploaded any applications yet. Start sharing your creations with the world!
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-4 btn-primary"
            >
              Upload Your First App
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            <img 
                              src={app.icon_url} 
                              alt={app.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {app.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {app.package_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.version}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.download_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(app.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => navigate(`/app/${app.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                          <button className="text-secondary-600 hover:text-secondary-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;