import { api } from './axios';
import type { User, UserRole } from '../lib/types';

export interface AuthResponse {
  access: string;
  refresh?: string; // Refresh token might not always be present or used by frontend directly
  user?: User; // Some endpoints might return user data on login/register
}

export interface LoginCredentials {
  email: string; // Or username, depending on backend config
  password_confirm?: string; // if using password confirmation
  password_old?: string; // if changing password
  password?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password_confirm?: string; // if using password confirmation
  password_old?: string; // if changing password
  password?: string;
  // role: UserRole; // Role is now read-only in the UserSerializer, set by backend or admin
}

// Assumes backend uses Simple JWT at /api/token/ for login
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Django Simple JWT typically expects 'username' or 'email' and 'password'.
    // Adjust field names if your backend User model uses email as username field.
    // For now, assuming 'email' can be sent as 'username' if DRF User model is configured that way,
    // or that the login serializer handles email. Often, it's just 'username'.
    // Let's assume the backend login serializer takes 'email' and 'password'.
    const response = await api.post<AuthResponse>('/token/', {
      email: credentials.email, // Or username: credentials.email if email is the USERNAME_FIELD
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Uses /api/users/ (POST) for registration from UserViewSet
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post<User>('/users/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Fetches current user details from /api/users/me/
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/me/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    // This could be a 401 if token is invalid/expired
    throw error;
  }
};

// Logout: Simple JWT doesn't have a mandatory server-side logout endpoint by default.
// Token blacklisting is optional. If implemented, call it here.
// For now, this function might only be responsible for client-side token removal,
// handled in AuthContext. If a backend logout endpoint exists (e.g. /api/token/logout/),
// it can be called here.
// export const logoutUser = async (): Promise<void> => {
//   try {
//     // Example: if you have a blacklist endpoint
//     // await api.post('/auth/token/logout/', { refresh: localStorage.getItem('refreshToken') });
//   } catch (error) {
//     console.error('Logout failed:', error);
//     // Even if server logout fails, client should clear tokens
//     throw error;
//   }
// };
