
import { useContext } from 'react';
import { useAuth as useAuthContext } from '@/lib/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Return the context directly since it already has the expected structure
  return context;
};
