import React from 'react';
import AppCard from './AppCard';
import { AppDetails } from '../../types';
import { FileWarning } from 'lucide-react';

interface AppGridProps {
  apps: AppDetails[];
  isLoading: boolean;
}

const AppGrid: React.FC<AppGridProps> = ({ apps, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="app-card animate-pulse-soft">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <FileWarning className="w-16 h-16 text-gray-400 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No apps found</h3>
        <p className="mt-2 text-sm text-gray-500">
          No applications match your current filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
};

export default AppGrid;