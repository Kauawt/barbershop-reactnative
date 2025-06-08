
import { Barber, Service, User, Appointment, TimeSlot } from "../types";

export const services: Service[] = [
  {
    id: "1",
    name: "Corte Clássico",
    description: "Corte tradicional com tesoura e máquina.",
    price: 35.00,
    duration: 30,
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Barba Completa",
    description: "Modelagem e aparação de barba com toalha quente e produtos especiais.",
    price: 25.00,
    duration: 20,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Corte + Barba",
    description: "Combo com corte de cabelo e barba completa.",
    price: 50.00,
    duration: 50,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Acabamento Máquina",
    description: "Manutenção rápida do corte apenas com máquina.",
    price: 20.00,
    duration: 15,
    image: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Coloração",
    description: "Aplicação de coloração para cabelo ou barba.",
    price: 60.00,
    duration: 60,
    image: "/placeholder.svg"
  },
  {
    id: "6",
    name: "Hidratação",
    description: "Tratamento para hidratação profunda dos fios.",
    price: 45.00,
    duration: 40,
    image: "/placeholder.svg"
  }
];

export const barbers: Barber[] = [
  {
    id: "1",
    name: "Carlos Silva",
    photo: "/placeholder.svg",
    specialties: ["Corte Clássico", "Barba"],
    rating: 4.8
  },
  {
    id: "2",
    name: "André Martins",
    photo: "/placeholder.svg",
    specialties: ["Coloração", "Corte Moderno"],
    rating: 4.7
  },
  {
    id: "3",
    name: "Lucas Santos",
    photo: "/placeholder.svg",
    specialties: ["Barba", "Hidratação"],
    rating: 4.9
  },
  {
    id: "4",
    name: "Rafael Costa",
    photo: "/placeholder.svg",
    specialties: ["Corte Degradê", "Design"],
    rating: 4.6
  }
];

export const users: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@barbearia.com",
    phone: "(11) 99999-9999",
    role: "admin",
    address: {
      street: "Rua Exemplo",
      number: "123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    }
  },
  {
    id: "2",
    name: "Cliente Exemplo",
    email: "cliente@email.com",
    phone: "(11) 98888-8888",
    role: "client",
    address: {
      street: "Av. Cliente",
      number: "456",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-890"
    }
  }
];

export const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:00", available: true },
  { id: "2", time: "09:30", available: true },
  { id: "3", time: "10:00", available: false },
  { id: "4", time: "10:30", available: true },
  { id: "5", time: "11:00", available: true },
  { id: "6", time: "11:30", available: false },
  { id: "7", time: "13:00", available: true },
  { id: "8", time: "13:30", available: true },
  { id: "9", time: "14:00", available: true },
  { id: "10", time: "14:30", available: false },
  { id: "11", time: "15:00", available: true },
  { id: "12", time: "15:30", available: true },
  { id: "13", time: "16:00", available: false },
  { id: "14", time: "16:30", available: true },
  { id: "15", time: "17:00", available: true },
  { id: "16", time: "17:30", available: true },
  { id: "17", time: "18:00", available: false },
  { id: "18", time: "18:30", available: true }
];

export const appointments: Appointment[] = [
  {
    id: "1",
    userId: "2",
    barberId: "1",
    serviceId: "1",
    date: "2025-05-05",
    time: "10:00",
    status: "confirmed",
    totalPrice: 35.00
  },
  {
    id: "2",
    userId: "2",
    barberId: "3",
    serviceId: "2",
    date: "2025-05-10",
    time: "11:30",
    status: "pending",
    totalPrice: 25.00
  }
];