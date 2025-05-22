import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Category } from '../../types';

interface AppFiltersProps {
  categories: Category[];
}

const AppFilters: React.FC<AppFiltersProps> = ({ categories }) => {
  const { filters, setFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleToggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (category: string | undefined) => {
    setLocalFilters({
      ...localFilters,
      category,
    });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value as 'newest' | 'popular' | 'alphabetical';
    setLocalFilters({
      ...localFilters,
      sortBy,
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      sortBy: 'newest' as const,
      category: undefined,
      search: filters.search,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggleFilters}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filters
          <ChevronDown
            className={`h-4 w-4 ml-1 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Downloaded</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    name="category"
                    type="radio"
                    checked={!localFilters.category}
                    onChange={() => handleCategoryChange(undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label
                    htmlFor="category-all"
                    className="ml-2 text-sm text-gray-700"
                  >
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      name="category"
                      type="radio"
                      checked={localFilters.category === category.slug}
                      onChange={() => handleCategoryChange(category.slug)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center text-xs text-gray-500 hover:text-primary-600"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {localFilters.search && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Search: {localFilters.search}
                    <button
                      onClick={() => setLocalFilters({ ...localFilters, search: undefined })}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {localFilters.category && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Category: {localFilters.category}
                    <button
                      onClick={() => handleCategoryChange(undefined)}
                      className="ml-1 text-primary-500 hover:text-primary-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {localFilters.sortBy && localFilters.sortBy !== 'newest' && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                    Sort: {localFilters.sortBy === 'popular' ? 'Most Downloaded' : 'A-Z'}
                    <button
                      onClick={() => setLocalFilters({ ...localFilters, sortBy: 'newest' })}
                      className="ml-1 text-secondary-500 hover:text-secondary-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppFilters;