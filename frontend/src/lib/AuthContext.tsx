
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { users } from './data';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simulate authentication
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      // Redirect based on user role
      switch (foundUser.role) {
        case 'buyer':
          navigate('/buyer');
          break;
        case 'seller':
          navigate('/seller');
          break;
        case 'partner':
          navigate('/partner');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    // Check if email is already used
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email address is already in use.",
      });
      return;
    }
    
    // Create new user (in a real app, this would be an API call)
    const newUser: User = {
      id: `user-${users.length + 1}`,
      name,
      email,
      role,
      createdAt: new Date(),
    };
    
    // Add user to the array (this would be a database insertion in a real app)
    users.push(newUser);
    
    // Set the current user and store in localStorage
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: "Your account has been created successfully!",
    });
    
    // Redirect based on user role
    switch (newUser.role) {
      case 'buyer':
        navigate('/buyer');
        break;
      case 'seller':
        navigate('/seller');
        break;
      case 'partner':
        navigate('/partner');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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
