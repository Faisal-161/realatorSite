import { api } from './axios';
import type { PropertyListing, User } from '../lib/types';

// Interface for data needed to create a PropertyListing (excluding seller, which is set by backend)
export interface PropertyListingCreateData {
  title: string;
  description: string;
  address: string;
  image?: File | null; // For file uploads, or string for URL if image is pre-uploaded
  num_bedrooms: number;
  num_bathrooms: number;
  price: string; // Assuming price is sent as a string
  // seller ID will be handled by the backend based on authenticated user
}

// Interface for data needed to update a PropertyListing
export interface PropertyListingUpdateData extends Partial<PropertyListingCreateData> {
  // Seller cannot be changed via this type, typically managed by backend logic
}

export const getListings = async (): Promise<PropertyListing[]> => {
  try {
    const response = await api.get<PropertyListing[]>('/listings/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    throw error;
  }
};

export const getProperty = async (id: number): Promise<PropertyListing> => {
  try {
    const response = await api.get<PropertyListing>(`/listings/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property ${id}:`, error);
    throw error;
  }
};

export const createProperty = async (data: PropertyListingCreateData): Promise<PropertyListing> => {
  try {
    // If data.image is a File, use FormData. Otherwise, send as JSON.
    let requestData: FormData | PropertyListingCreateData = data;
    const headers: Record<string, string> = {};

    if (data.image && data.image instanceof File) {
      const formData = new FormData();
      // Append other fields to FormData
      (Object.keys(data) as Array<keyof PropertyListingCreateData>).forEach(key => {
        if (key === 'image') {
          formData.append(key, data[key] as File);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, String(data[key]));
        }
      });
      requestData = formData;
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const response = await api.post<PropertyListing>('/listings/', requestData, { headers });
    return response.data;
  } catch (error)
    {
    console.error('Failed to create property:', error);
    throw error;
  }
};

export const updateProperty = async (id: number, data: PropertyListingUpdateData): Promise<PropertyListing> => {
  try {
    let requestData: FormData | PropertyListingUpdateData = data;
    const headers: Record<string, string> = {};

    if (data.image && data.image instanceof File) {
      const formData = new FormData();
      // Append other fields to FormData
      (Object.keys(data) as Array<keyof PropertyListingUpdateData>).forEach(key => {
        if (key === 'image') {
          formData.append(key, data[key] as File);
        } else if (data[key] !== undefined && data[key] !== null) {
           formData.append(key, String(data[key]));
        }
      });
      requestData = formData;
    } else if (data.image === null) {
      // Handle explicit image deletion if backend supports it
      // (requestData as PropertyListingUpdateData).image = ''; // or some indicator
      headers['Content-Type'] = 'application/json';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const response = await api.patch<PropertyListing>(`/listings/${id}/`, requestData, { headers });
    return response.data;
  } catch (error) {
    console.error(`Failed to update property ${id}:`, error);
    throw error;
  }
};

export const deleteProperty = async (id: number): Promise<void> => {
  try {
    await api.delete(`/listings/${id}/`);
  } catch (error) {
    console.error(`Failed to delete property ${id}:`, error);
    throw error;
  }
};
