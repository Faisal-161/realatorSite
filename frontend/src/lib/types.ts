
export type UserRole = 'buyer' | 'seller' | 'service_provider'; // Adjusted to match backend

// Represents the User structure from the backend
export interface User {
  id: number; // Django typically uses numbers for IDs
  username: string;
  email: string;
  role: UserRole;
  // Add other fields if they are present in your UserSerializer and needed by frontend
}

// Represents the PropertyListing structure from the backend
export interface PropertyListing {
  id: number;
  seller: User; // Nested User object
  title: string;
  description: string;
  address: string;
  image: string | null; // Assuming image can be null and is a URL string
  num_bedrooms: number;
  num_bathrooms: number;
  price: string; // Django DecimalField often comes as string
  created_at: string; // DateTimeField comes as string
  // Add other fields if present in your PropertyListingSerializer
}

// Represents the Booking structure from the backend
export interface Booking {
  id: number;
  buyer: User; // Nested User object
  property: PropertyListing; // Nested PropertyListing object
  scheduled_date: string; // DateField
  scheduled_time: string; // TimeField
  message?: string | null;
  created_at: string; // DateTimeField
}

// Represents the ServiceOffer structure from the backend
export interface ServiceOffer {
  id: number;
  service_provider: User; // Nested User object for the provider
  property: PropertyListing; // Nested PropertyListing object
  title: string;
  description: string;
  approved: boolean;
  created_at: string; // DateTimeField
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
