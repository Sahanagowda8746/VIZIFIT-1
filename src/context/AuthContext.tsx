import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  orders: Order[];
  addOrder: (order: Order) => void;
  aiDesigns: { prompt: string; image: string; date: string }[];
  addAIDesign: (prompt: string, image: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Orders and AI designs stored per user in localStorage (keyed by user ID)
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiDesigns, setAIDesigns] = useState<{ prompt: string; image: string; date: string }[]>([]);

  // Load user-specific data from localStorage
  const loadUserData = (userId: string) => {
    const savedOrders = localStorage.getItem(`vizifit-orders-${userId}`);
    const savedDesigns = localStorage.getItem(`vizifit-ai-designs-${userId}`);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    setAIDesigns(savedDesigns ? JSON.parse(savedDesigns) : []);
  };

  // Clear user data on logout
  const clearUserData = () => {
    setOrders([]);
    setAIDesigns([]);
  };

  // Save orders when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`vizifit-orders-${user.id}`, JSON.stringify(orders));
    }
  }, [orders, user]);

  // Save AI designs when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`vizifit-ai-designs-${user.id}`, JSON.stringify(aiDesigns));
    }
  }, [aiDesigns, user]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
        loadUserData(mappedUser.id);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
        loadUserData(mappedUser.id);
      } else {
        setUser(null);
        clearUserData();
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.session === null) {
          return { 
            success: true, 
            error: 'Please check your email to confirm your account before logging in.' 
          };
        }
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    clearUserData();
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addAIDesign = (prompt: string, image: string) => {
    setAIDesigns((prev) => [
      { prompt, image, date: new Date().toISOString() },
      ...prev,
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        signup,
        logout,
        orders,
        addOrder,
        aiDesigns,
        addAIDesign,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
