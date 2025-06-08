
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "client" | "barber" | "admin";
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface Barber {
  id: string;
  name: string;
  photo?: string;
  specialties?: string[];
  rating?: number;
  userId?: string;
}

export interface Service {
  id: string;       
  name: string;
  price: number;
  duration: number; 
  isActive: boolean;
  image?: string;
  description?: string; 

}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  totalPrice: number;
}