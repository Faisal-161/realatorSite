import { api } from './axios';
import type { Booking, PropertyListing, User } from '../lib/types';

// Interface for data needed to create a Booking
// Buyer is automatically set by the backend based on the authenticated user.
// Property is an ID.
export interface BookingCreateData {
  property: number; // ID of the PropertyListing
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM:SS or HH:MM
  message?: string;
}

// Interface for data needed to update a Booking
// Typically, buyer and property might not be updatable.
// Only schedule and message might be.
export interface BookingUpdateData {
  scheduled_date?: string;
  scheduled_time?: string;
  message?: string;
}

export const getBookings = async (): Promise<Booking[]> => {
  try {
    // This will fetch bookings based on the backend's get_queryset logic
    // (e.g., bookings for the current user)
    const response = await api.get<Booking[]>('/bookings/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    throw error;
  }
};

// Note: getBookingById might not be needed if users only see their own bookings via getBookings.
// If admins need to fetch specific bookings, this could be added.
// export const getBooking = async (id: number): Promise<Booking> => {
//   try {
//     const response = await api.get<Booking>(`/bookings/${id}/`);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch booking ${id}:`, error);
//     throw error;
//   }
// };

export const createBooking = async (data: BookingCreateData): Promise<Booking> => {
  try {
    const response = await api.post<Booking>('/bookings/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};

export const updateBooking = async (id: number, data: BookingUpdateData): Promise<Booking> => {
  try {
    const response = await api.patch<Booking>(`/bookings/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update booking ${id}:`, error);
    throw error;
  }
};

export const deleteBooking = async (id: number): Promise<void> => {
  try {
    await api.delete(`/bookings/${id}/`);
  } catch (error) {
    console.error(`Failed to delete booking ${id}:`, error);
    throw error;
  }
};
