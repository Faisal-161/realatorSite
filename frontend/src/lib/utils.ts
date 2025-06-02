
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getRandomSubset<T>(array: T[], size: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export const generateMarketingContent = (property: { title: string, description: string, location: string }) => {
  const templates = [
    `🏡 EXCLUSIVE LISTING! 🏡\n\nPresenting ${property.title} in ${property.location}.\n\n${property.description}\n\nContact us now to schedule a viewing!`,
    `✨ NEW ON THE MARKET ✨\n\nDon't miss this opportunity to own ${property.title}!\n\nLocated in the desirable area of ${property.location}, this property offers: ${property.description}\n\nReach out today before it's gone!`,
    `🔑 YOUR DREAM HOME AWAITS 🔑\n\nIntroducing ${property.title}!\n\nPerfectly situated in ${property.location}, featuring ${property.description}\n\nCall now to make it yours!`,
    `📢 JUST LISTED! 📢\n\n${property.title} - A rare find in ${property.location}.\n\nHighlights include: ${property.description}\n\nSchedule your private tour today!`,
    `💎 LUXURY LIVING 💎\n\nExperience the epitome of elegance at ${property.title} in ${property.location}.\n\n${property.description}\n\nExclusive showings available now!`
  ];
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

export const generateChatbotScript = (service: { title: string, category: string, description: string }) => {
  const templates = [
    `Hello! Thank you for your interest in our ${service.title} services. I'd be happy to tell you more about our ${service.category} solutions and how ${service.description} Let me know if you have any specific questions!`,
    `Hi there! I'm here to help you learn more about our ${service.title}. We specialize in ${service.category} services, and what makes us unique is that ${service.description} How can I assist you today?`,
    `Welcome! Interested in our ${service.title}? As experts in ${service.category}, we pride ourselves on providing ${service.description} What would you like to know?`,
    `Greetings! Looking for quality ${service.category} services? Our ${service.title} might be perfect for you! ${service.description} Feel free to ask me anything about our offerings.`,
    `Thank you for reaching out about our ${service.title}! We're dedicated to providing exceptional ${service.category} services. ${service.description} How may I help you today?`
  ];
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};
