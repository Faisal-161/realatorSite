
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { loginUser, registerUser, getCurrentUser } from '../api/auth'; // Adjusted path
import { api } from '../api/axios'; // For setting auth header
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  authLoading: boolean; // Renamed from loading
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadUserSession = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Session load failed, token might be invalid:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // If using refresh tokens
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    loadUserSession();
  }, [loadUserSession]);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('accessToken', data.access);
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      
      // Fetch user details after successful token retrieval
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${currentUser.username}!`,
      });

      // Redirect based on user role
      switch (currentUser.role) {
        case 'buyer': navigate('/buyer'); break;
        case 'seller': navigate('/seller'); break;
        case 'service_provider': navigate('/partner'); break; // Matched UserRole type
        case 'admin': navigate('/admin'); break;
        default: navigate('/');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.detail || "Invalid credentials or server error.",
      });
      throw error; // Re-throw to allow form to handle error state
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
    // Consider calling backend logoutUser() if it exists and handles token blacklisting
  };

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    try {
      // Assuming role is 'buyer' by default for new public registrations,
      // or passed if admin is creating users. Adjust as needed.
      const newUser = await registerUser({ username, email, password, role });
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      });
      // Option 1: Redirect to login
      navigate('/login');
      // Option 2: Attempt to auto-login (requires password handling or token from register endpoint)
      // For simplicity, redirecting to login is often safer.
      // If registerUser returned a token, you could use it here.
      // Or, call login(email, password);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessages = error.response?.data;
      let description = "An error occurred during registration.";
      if (errorMessages) {
        // Concatenate multiple error messages if backend sends them (e.g. for username, email, password)
        description = Object.entries(errorMessages).map(([key, value]) => 
          `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`
        ).join('; ');
      }
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: description,
      });
      throw error; // Re-throw for form error handling
    }
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, register, authLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
