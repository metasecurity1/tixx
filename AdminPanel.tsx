import React, { useState } from 'react';
import { useStore } from '../store';
import { RRule } from 'rrule';
import { Trash2, Edit, BarChart2, Users, Calendar, DollarSign, TrendingUp, Activity, User, Settings, X, Copy, Clock } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import UserManagement from '../components/UserManagement';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  country: string;
  city: string;
  category: string;
  price: number;
  capacity: number;
  image: string;
  status: 'draft' | 'published' | 'cancelled';
  isRecurring: boolean;
  recurrenceRule?: string;
}

interface HeroImageFormData {
  category: string;
  imageUrl: string;
}

export default function AdminPanel() {
  const events = useStore((state) => state.events);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const addEvent = useStore((state) => state.addEvent);
  const updateEvent = useStore((state) => state.updateEvent);
  const cloneEvent = useStore((state) => state.cloneEvent);
  const updateEventStatus = useStore((state) => state.updateEventStatus);
  const deleteMultipleEvents = useStore((state) => state.deleteMultipleEvents);

  const [activeTab, setActiveTab] = useState<'events' | 'analytics' | 'users'>('events');
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showNewCountry, setShowNewCountry] = useState(false);
  const [showNewCity, setShowNewCity] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    country: '',
    city: '',
    category: 'concerts',
    price: 0,
    capacity: 0,
    image: '',
    status: 'draft',
    isRecurring: false,
  });
  const [showHeroImageSettings, setShowHeroImageSettings] = useState(false);
  const [heroImageForm, setHeroImageForm] = useState<HeroImageFormData>({
    category: 'default',
    imageUrl: '',
  });

  // Extract unique countries and cities from events
  const locations = events.reduce((acc, event) => {
    const [city, country] = event.location.split(', ');
    if (country && !acc.countries.includes(country)) {
      acc.countries.push(country);
    }
    if (city && !acc.cities.includes(city)) {
      acc.cities.push(city);
    }
    return acc;
  }, { countries: [] as string[], cities: [] as string[] });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const handleEdit = (event: any) => {
    const [city, country] = event.location.split(', ');
    setEditingEvent(event.id);
    setFormData({
      ...event,
      country,
      city,
      status: event.status || 'published',
      isRecurring: !!event.recurrenceRule,
    });
    setShowAddEvent(true);
  };

  const handleClone = (id: string) => {
    cloneEvent(id);
  };

  const handleStatusChange = (id: string, status: 'draft' | 'published' | 'cancelled') => {
    updateEventStatus(id, status);
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) {
      deleteMultipleEvents(selectedEvents);
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (id: string) => {
    setSelectedEvents(prev =>
      prev.includes(id)
        ? prev.filter(eventId => eventId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedEvents(prev =>
      prev.length === events.length ? [] : events.map(e => e.id)
    );
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      country: '',
      city: '',
      category: 'concerts',
      price: 0,
      capacity: 0,
      image: '',
      status: 'draft',
      isRecurring: false,
    });
    setShowNewCountry(false);
    setShowNewCity(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = `${formData.city}, ${formData.country}`;
    const eventData = {
      ...formData,
      location,
      bookedSeats: 0,
      id: editingEvent || Math.random().toString(36).substr(2, 9),
    };

    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    handleCancel();
    setShowAddEvent(false);
  };

  const handleHeroImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useStore.getState().updateHeroImage(heroImageForm.category, heroImageForm.imageUrl);
    setShowHeroImageSettings(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'events' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setShowHeroImageSettings(true)}
            className="flex items-center px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Hero Images
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setShowAddEvent(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Event
        </button>
        <button
          onClick={() => setShowManageEvents(true)}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Manage Events
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              {selectedEvents.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete Selected ({selectedEvents.length})
                </button>
              )}
            </div>
          </div>

          {showManageEvents && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedEvents.length === events.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.date}</div>
                          <div className="text-sm text-gray-500">{event.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={event.status || 'published'}
                            onChange={(e) => handleStatusChange(event.id, e.target.value as any)}
                            className="text-sm rounded-full px-2 py-1 border"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleClone(event.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddEvent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="concerts">Concerts</option>
                      <option value="theater">Theater, Comedy & Art</option>
                      <option value="workshops">Workshops</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      value={showNewCountry ? 'other' : formData.country}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setShowNewCountry(true);
                          setFormData({ ...formData, country: '' });
                        } else {
                          setShowNewCountry(false);
                          setFormData({ ...formData, country: e.target.value });
                        }
                      }}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Country</option>
                      {locations.countries.sort().map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                      <option value="other">Add New Country</option>
                    </select>
                    {showNewCountry && (
                      <input
                        type="text"
                        placeholder="Enter country name"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="mt-2 block w-full border rounded-md px-3 py-2"
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select
                      value={showNewCity ? 'other' : formData.city}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setShowNewCity(true);
                          setFormData({ ...formData, city: '' });
                        } else {
                          setShowNewCity(false);
                          setFormData({ ...formData, city: e.target.value });
                        }
                      }}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select City</option>
                      {locations.cities.sort().map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                      <option value="other">Add New City</option>
                    </select>
                    {showNewCity && (
                      <input
                        type="text"
                        placeholder="Enter city name"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-2 block w-full border rounded-md px-3 py-2"
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                        className="mr-2"
                      />
                      Recurring Event
                    </label>
                    {formData.isRecurring && (
                      <select
                        value={formData.recurrenceRule || ''}
                        onChange={(e) => setFormData({ ...formData, recurrenceRule: e.target.value })}
                        className="mt-2 block w-full border rounded-md px-3 py-2"
                      >
                        <option value="">Select Recurrence Pattern</option>
                        <option value="FREQ=DAILY">Daily</option>
                        <option value="FREQ=WEEKLY">Weekly</option>
                        <option value="FREQ=MONTHLY">Monthly</option>
                      </select>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {activeTab === 'users' && <UserManagement />}

      {showHeroImageSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Hero Images</h2>
              <button
                onClick={() => setShowHeroImageSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleHeroImageSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={heroImageForm.category}
                  onChange={(e) => setHeroImageForm({ ...heroImageForm, category: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="default">Default</option>
                  <option value="concerts">Concerts</option>
                  <option value="theater">Theater</option>
                  <option value="workshops">Workshops</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={heroImageForm.imageUrl}
                  onChange={(e) => setHeroImageForm({ ...heroImageForm, imageUrl: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowHeroImageSettings(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}