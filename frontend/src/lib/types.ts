
export type UserRole = 'buyer' | 'seller' | 'partner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  avatar?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  sellerId: string;
  images: string[];
  status: 'available' | 'pending' | 'sold';
  createdAt: Date;
  bundledOffers: ServiceOffer[];
}

export interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  partnerId: string;
  partnerName: string;
  category: 'decor' | 'transport' | 'internet' | 'cleaning' | 'security' | 'other';
  createdAt: Date;
}

export interface BundledOffer {
  propertyId: string;
  offerId: string;
}

export interface ContactRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  propertyId: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: Date;
}

export interface AIContent {
  id: string;
  userId: string;
  contentType: 'marketing' | 'chatbot';
  content: string;
  createdAt: Date;
}

export interface Stats {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  totalProperties: number;
  totalOffers: number;
  totalContactRequests: number;
  aiUsage: number;
}
