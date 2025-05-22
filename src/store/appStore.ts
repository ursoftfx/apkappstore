import { create } from 'zustand';
import { AppDetails, AppFilters, Category } from '../types';
import { fetchAllApps, fetchAppById, fetchCategories } from '../lib/supabase';

interface AppState {
  apps: AppDetails[];
  categories: Category[];
  selectedApp: AppDetails | null;
  filters: AppFilters;
  isLoading: boolean;
  error: string | null;
  fetchApps: () => Promise<void>;
  fetchApp: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  setFilters: (filters: Partial<AppFilters>) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  apps: [],
  categories: [],
  selectedApp: null,
  filters: {
    sortBy: 'newest',
  },
  isLoading: false,
  error: null,
  
  fetchApps: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await fetchAllApps(get().filters);
      
      if (error) throw error;
      
      set({ 
        apps: data as AppDetails[], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch apps' 
      });
    }
  },
  
  fetchApp: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await fetchAppById(id);
      
      if (error) throw error;
      
      set({ 
        selectedApp: data as AppDetails, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch app details' 
      });
    }
  },
  
  loadCategories: async () => {
    try {
      const { data, error } = await fetchCategories();
      
      if (error) throw error;
      
      set({ categories: data as Category[] });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load categories' });
    }
  },
  
  setFilters: (filters) => {
    set({ 
      filters: { ...get().filters, ...filters }
    });
    get().fetchApps();
  },
  
  clearError: () => set({ error: null }),
}));