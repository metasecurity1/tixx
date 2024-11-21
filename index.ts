import { create } from 'zustand';
import type { Event, User, Booking } from '../types';
import { sampleEvents } from '../data/sampleEvents';

interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  averageTicketPrice: number;
  popularCategories: { category: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface Store {
  user: User | null;
  events: Event[];
  bookings: Booking[];
  users: User[];
  analytics: Analytics;
  heroImages: Record<string, string>;
  setUser: (user: User | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  deleteMultipleEvents: (ids: string[]) => void;
  cloneEvent: (id: string) => void;
  updateEventStatus: (id: string, status: Event['status']) => void;
  addBooking: (booking: Booking) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  calculateAnalytics: () => void;
  updateHeroImage: (category: string, imageUrl: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  events: sampleEvents.map(event => ({ ...event, status: 'published' })),
  bookings: [],
  users: [
    { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ],
  analytics: {
    totalRevenue: 0,
    totalBookings: 0,
    averageTicketPrice: 0,
    popularCategories: [],
    revenueByMonth: [],
  },
  heroImages: {
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    concerts: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    theater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    workshops: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
  },
  setUser: (user) => set({ user }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === event.id ? event : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  deleteMultipleEvents: (ids) =>
    set((state) => ({
      events: state.events.filter((e) => !ids.includes(e.id)),
    })),
  cloneEvent: (id) =>
    set((state) => {
      const eventToClone = state.events.find((e) => e.id === id);
      if (!eventToClone) return state;

      const clonedEvent = {
        ...eventToClone,
        id: Math.random().toString(36).substr(2, 9),
        title: `${eventToClone.title} (Copy)`,
        status: 'draft' as const,
        bookedSeats: 0,
      };

      return { events: [...state.events, clonedEvent] };
    }),
  updateEventStatus: (id, status) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, status } : e
      ),
    })),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  calculateAnalytics: () => {
    const state = get();
    const bookings = state.bookings;
    const events = state.events;

    // Calculate total revenue and bookings
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalBookings = bookings.length;

    // Calculate average ticket price
    const averageTicketPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Calculate popular categories
    const categoryCount = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate revenue by month
    const revenueByMonth = bookings.reduce((acc, booking) => {
      const month = new Date(booking.createdAt).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + booking.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const revenueByMonthArray = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    set({
      analytics: {
        totalRevenue,
        totalBookings,
        averageTicketPrice,
        popularCategories,
        revenueByMonth: revenueByMonthArray,
      },
    });
  },
  updateHeroImage: (category, imageUrl) =>
    set((state) => ({
      heroImages: {
        ...state.heroImages,
        [category]: imageUrl,
      },
    })),
}));