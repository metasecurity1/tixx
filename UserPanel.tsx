import React, { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store';
import { useAuthStore } from '../store/auth';
import { Heart, Calendar, User, Clock, MapPin } from 'lucide-react';

export default function UserPanel() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'favorites'>('bookings');
  const bookings = useStore((state) => state.bookings);
  const events = useStore((state) => state.events);
  const user = useAuthStore((state) => state.user);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter bookings for current user
  const userBookings = bookings.filter((booking) => booking.userId === user?.id);

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'favorites' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
        >
          Favorite Events
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
          <div className="space-y-6">
            {userBookings.map((booking) => {
              const event = events.find((e) => e.id === booking.eventId);
              if (!event) return null;

              return (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-gray-600">Tickets: </span>
                        <span className="font-semibold">{booking.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-semibold">${booking.totalAmount}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {userBookings.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                You haven't made any bookings yet.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Favorite Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter((event) => favorites.includes(event.id)).map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(event.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 hover:bg-indigo-50"
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${
                      favorites.includes(event.id) ? 'fill-current' : ''
                    }`}
                  />
                  Remove from Favorites
                </button>
              </div>
            ))}
            {favorites.length === 0 && (
              <p className="text-gray-500 text-center py-8 col-span-3">
                You haven't added any events to your favorites yet.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue={user?.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue={user?.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}