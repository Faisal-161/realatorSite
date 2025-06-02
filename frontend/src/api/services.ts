import { api } from './axios';
import type { ServiceOffer, PropertyListing, User } from '../lib/types';

// Interface for data needed to create a ServiceOffer
// service_provider is automatically set by the backend.
// property is an ID.
export interface ServiceOfferCreateData {
  property: number; // ID of the PropertyListing
  title: string;
  description: string;
  // approved status is likely handled by backend, not set on creation by user
}

// Interface for data needed to update a ServiceOffer
// Only some fields might be updatable by the service provider or admin.
export interface ServiceOfferUpdateData {
  title?: string;
  description?: string;
  approved?: boolean; // Potentially updatable by admin or a specific workflow
  property?: number; // Usually not changed, but depends on rules
}

export const getServices = async (): Promise<ServiceOffer[]> => {
  try {
    const response = await api.get<ServiceOffer[]>('/services/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch service offers:', error);
    throw error;
  }
};

export const getService = async (id: number): Promise<ServiceOffer> => {
  try {
    const response = await api.get<ServiceOffer>(`/services/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch service offer ${id}:`, error);
    throw error;
  }
};

export const createService = async (data: ServiceOfferCreateData): Promise<ServiceOffer> => {
  try {
    const response = await api.post<ServiceOffer>('/services/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create service offer:', error);
    throw error;
  }
};

export const updateService = async (id: number, data: ServiceOfferUpdateData): Promise<ServiceOffer> => {
  try {
    const response = await api.patch<ServiceOffer>(`/services/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update service offer ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id: number): Promise<void> => {
  try {
    await api.delete(`/services/${id}/`);
  } catch (error) {
    console.error(`Failed to delete service offer ${id}:`, error);
    throw error;
  }
};
