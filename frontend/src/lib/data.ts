
import { User, Property, ServiceOffer, ContactRequest, Stats, AIContent } from "./types";

// Dummy users
export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "buyer",
    createdAt: new Date('2023-01-15'),
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "buyer",
    createdAt: new Date('2023-02-20'),
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "seller",
    createdAt: new Date('2023-01-05'),
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "seller",
    createdAt: new Date('2023-03-10'),
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-5",
    name: "Michael Wilson",
    email: "michael@example.com",
    role: "partner",
    createdAt: new Date('2023-02-15'),
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-6",
    name: "Sarah Brown",
    email: "sarah@example.com",
    role: "partner",
    createdAt: new Date('2023-04-05'),
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "user-7",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date('2023-01-01'),
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&auto=format&fit=crop",
  }
];

// Dummy service offers
export const serviceOffers: ServiceOffer[] = [
  {
    id: "offer-1",
    title: "Premium Interior Decoration",
    description: "High-end interior decoration service with custom furniture and design.",
    price: 5000,
    partnerId: "user-5",
    partnerName: "Michael Wilson",
    category: "decor",
    createdAt: new Date('2023-03-15'),
  },
  {
    id: "offer-2",
    title: "Professional Moving Service",
    description: "Full-service moving including packing, transport, and unpacking.",
    price: 2500,
    partnerId: "user-5",
    partnerName: "Michael Wilson",
    category: "transport",
    createdAt: new Date('2023-03-20'),
  },
  {
    id: "offer-3",
    title: "High-Speed Internet Setup",
    description: "Fiber optic internet installation with premium router and setup.",
    price: 300,
    partnerId: "user-6",
    partnerName: "Sarah Brown",
    category: "internet",
    createdAt: new Date('2023-04-10'),
  },
  {
    id: "offer-4",
    title: "Deep Cleaning Service",
    description: "Comprehensive cleaning service for move-in ready properties.",
    price: 450,
    partnerId: "user-6",
    partnerName: "Sarah Brown",
    category: "cleaning",
    createdAt: new Date('2023-04-15'),
  },
  {
    id: "offer-5",
    title: "Home Security System",
    description: "Full security system with cameras, sensors, and 24/7 monitoring.",
    price: 1200,
    partnerId: "user-5",
    partnerName: "Michael Wilson",
    category: "security",
    createdAt: new Date('2023-03-25'),
  }
];

// Dummy properties with bundled offers
export const properties: Property[] = [
  {
    id: "property-1",
    title: "Luxury Penthouse with City View",
    description: "Spectacular penthouse apartment with panoramic views of the city skyline. Features high-end finishes, an open floor plan, and a private rooftop terrace.",
    price: 1250000,
    location: "123 Skyline Drive, New York, NY",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2500,
    sellerId: "user-3",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&w=800&h=500&fit=crop"
    ],
    status: "available",
    createdAt: new Date('2023-02-10'),
    bundledOffers: [serviceOffers[0], serviceOffers[2], serviceOffers[4]],
  },
  {
    id: "property-2",
    title: "Modern Suburban Family Home",
    description: "Beautiful family home in a quiet neighborhood featuring modern design, spacious rooms, and a landscaped backyard with a swimming pool.",
    price: 750000,
    location: "456 Maple Avenue, Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    sellerId: "user-3",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&w=800&h=500&fit=crop"
    ],
    status: "available",
    createdAt: new Date('2023-02-20'),
    bundledOffers: [serviceOffers[1], serviceOffers[3]],
  },
  {
    id: "property-3",
    title: "Waterfront Cottage Retreat",
    description: "Charming cottage situated on a private lake with a dock. Perfect for weekend getaways, featuring rustic interiors, a stone fireplace, and wraparound deck.",
    price: 450000,
    location: "789 Lakeside Lane, Portland, OR",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    sellerId: "user-4",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&w=800&h=500&fit=crop"
    ],
    status: "pending",
    createdAt: new Date('2023-03-15'),
    bundledOffers: [serviceOffers[0], serviceOffers[1]],
  },
  {
    id: "property-4",
    title: "Downtown Loft Apartment",
    description: "Industrial-style loft in the heart of downtown, featuring exposed brick walls, high ceilings, and large windows with city views.",
    price: 550000,
    location: "101 Urban Street, Chicago, IL",
    bedrooms: 1,
    bathrooms: 1.5,
    area: 1200,
    sellerId: "user-4",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&w=800&h=500&fit=crop"
    ],
    status: "available",
    createdAt: new Date('2023-03-25'),
    bundledOffers: [serviceOffers[2], serviceOffers[3], serviceOffers[4]],
  },
  {
    id: "property-5",
    title: "Spanish-Style Villa with Pool",
    description: "Elegant Spanish-style villa with terracotta roof, arched doorways, and a private courtyard featuring a swimming pool and outdoor kitchen.",
    price: 1100000,
    location: "222 Sunset Boulevard, Los Angeles, CA",
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    sellerId: "user-3",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&w=800&h=500&fit=crop"
    ],
    status: "available",
    createdAt: new Date('2023-04-05'),
    bundledOffers: [serviceOffers[0], serviceOffers[4]],
  },
];

// Dummy contact requests
export const contactRequests: ContactRequest[] = [
  {
    id: "request-1",
    buyerId: "user-1",
    buyerName: "John Doe",
    propertyId: "property-1",
    message: "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
    status: "pending",
    createdAt: new Date('2023-04-12'),
  },
  {
    id: "request-2",
    buyerId: "user-2",
    buyerName: "Jane Smith",
    propertyId: "property-3",
    message: "Could you provide more information about the lake access and boat docking options?",
    status: "contacted",
    createdAt: new Date('2023-04-14'),
  },
  {
    id: "request-3",
    buyerId: "user-1",
    buyerName: "John Doe",
    propertyId: "property-5",
    message: "I'd like to know more about the neighborhood and nearby amenities.",
    status: "closed",
    createdAt: new Date('2023-04-10'),
  },
];

// Dummy AI content
export const aiContents: AIContent[] = [
  {
    id: "ai-1",
    userId: "user-3",
    contentType: "marketing",
    content: "Discover the height of luxury living in this stunning penthouse with breathtaking panoramic views. Perfect for entertaining or peaceful relaxation, this exceptional property offers the finest in urban lifestyle.",
    createdAt: new Date('2023-04-01'),
  },
  {
    id: "ai-2",
    userId: "user-4",
    contentType: "marketing",
    content: "Escape to your own private waterfront paradise! This charming cottage offers tranquility and natural beauty with modern comforts. Wake up to stunning lake views every morning!",
    createdAt: new Date('2023-04-05'),
  },
  {
    id: "ai-3",
    userId: "user-5",
    contentType: "chatbot",
    content: "Hello! I'm Michael from Premium Interior Decoration. I'd be happy to discuss how we can transform your new home into a personalized sanctuary that reflects your unique style and preferences.",
    createdAt: new Date('2023-04-08'),
  },
  {
    id: "ai-4",
    userId: "user-6",
    contentType: "chatbot",
    content: "Hi there! I'm Sarah from High-Speed Internet Setup. I can help you get connected with the fastest internet in your area, with professional installation and equipment setup.",
    createdAt: new Date('2023-04-10'),
  },
];

// Dummy stats
export const stats: Stats = {
  totalUsers: users.length,
  usersByRole: {
    buyer: users.filter(user => user.role === 'buyer').length,
    seller: users.filter(user => user.role === 'seller').length,
    partner: users.filter(user => user.role === 'partner').length,
    admin: users.filter(user => user.role === 'admin').length,
  },
  totalProperties: properties.length,
  totalOffers: serviceOffers.length,
  totalContactRequests: contactRequests.length,
  aiUsage: aiContents.length,
};
