import { api } from './axios'; // Corrected import to use the shared 'api' instance
import type { User } from '../lib/types';

// Interface for data that can be used to update a user
// For user creation, DRF UserViewSet typically expects username, password, email etc.
// For updates, it might be a subset.
export interface UserUpdateData {
  username?: string;
  email?: string;
  // role?: string; // Role is read-only in UserSerializer, not updatable by users or via this standard route
  // Password updates are usually handled by separate endpoints/logic
}

// For user creation, especially if it's self-registration.
// Djoser or similar libraries often handle registration flows.
// Our basic UserViewSet will take these fields.
export interface UserCreateData {
  username:string;
  email: string;
  password_confirm?: string; // if using password confirmation
  password_old?: string; // if changing password
  password?: string; // Required for creation
  // role?: string; // Role is read-only in UserSerializer, set by backend or admin only
}


export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    throw error;
  }
};

// This function is for general user creation, might be admin-only
// or used for registration if UserViewSet allows anonymous creation.
export const createUser = async (data: UserCreateData): Promise<User> => {
  try {
    const response = await api.post<User>('/users/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};


export const updateUser = async (id: number, data: UserUpdateData): Promise<User> => {
  try {
    // For updating user profile, typically current user or admin.
    // Password changes should ideally use a dedicated endpoint.
    const response = await api.patch<User>(`/users/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw error;
  }
};

// updateUser could also be api.put, depending on whether you want full or partial updates.
// patch is generally preferred for partial updates.

export const deleteUser = async (id: number): Promise<void> => {
  try {
    // This is typically an admin-only action.
    await api.delete(`/users/${id}/`);
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw error;
  }
};
