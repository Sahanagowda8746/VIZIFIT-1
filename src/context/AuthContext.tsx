import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  aiDesigns: { prompt: string; image: string; date: string }[];
  addAIDesign: (prompt: string, image: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vizifit-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vizifit-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiDesigns, setAIDesigns] = useState<{ prompt: string; image: string; date: string }[]>(() => {
    const saved = localStorage.getItem('vizifit-ai-designs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('vizifit-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vizifit-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vizifit-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vizifit-ai-designs', JSON.stringify(aiDesigns));
  }, [aiDesigns]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    const users = JSON.parse(localStorage.getItem('vizifit-users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    
    if (found) {
      setUser({ id: found.id, email: found.email, name: found.name });
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('vizifit-users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };

    users.push(newUser);
    localStorage.setItem('vizifit-users', JSON.stringify(users));
    setUser({ id: newUser.id, email, name });
    return true;
  };

  const logout = () => setUser(null);

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
