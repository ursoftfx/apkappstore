import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import AppGrid from '../components/apps/AppGrid';
import AppFilters from '../components/apps/AppFilters';

const AppListPage = () => {
  const { 
    apps, 
    categories,
    isLoading, 
    fetchApps, 
    loadCategories,
    filters,
    setFilters
  } = useAppStore();
  
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    fetchApps();
    loadCategories();
  }, [fetchApps, loadCategories]);
  
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sort') as 'newest' | 'popular' | 'alphabetical' | undefined;

    const newFilters: Record<string, any> = {};
    
    if (search) newFilters.search = search;
    if (category) newFilters.category = category;
    if (sortBy) newFilters.sortBy = sortBy;
    
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, [searchParams, setFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Applications</h1>
        {filters.search && (
          <div className="text-sm text-gray-500">
            Showing results for "{filters.search}"
          </div>
        )}
      </div>

      <AppFilters categories={categories} />

      <AppGrid apps={apps} isLoading={isLoading} />

      {!isLoading && apps.length > 20 && (
        <div className="mt-8 flex justify-center">
          <button className="btn-outline">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AppListPage;