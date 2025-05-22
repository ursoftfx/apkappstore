import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ 
          user: data as User,
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ 
        user: null, 
        isLoading: false,
        error: 'Failed to initialize auth session'
      });
    }
  },
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        set({ 
          user: data as User,
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to login' 
      });
    }
  },
  
  register: async (email, password, fullName) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to register' 
      });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to logout' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));