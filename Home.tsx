import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store';
import EventCard from '../components/EventCard';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const heroContent = {
  default: {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    title: 'Discover Amazing Events',
    description: 'Book tickets for the best concerts, theater shows, workshops, and sports events',
  },
  concerts: {
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    title: 'Live Music Experiences',
    description: 'From rock concerts to classical symphonies, find your perfect musical event',
  },
  theater: {
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    title: 'Theater, Comedy & Art',
    description: 'Experience the magic of live performances, comedy shows, and artistic productions',
  },
  workshops: {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    title: 'Learn from the Best',
    description: 'Join expert-led workshops and master new skills in a hands-on environment',
  },
  sports: {
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    title: 'Thrilling Sports Events',
    description: 'Experience the excitement of live sports competitions and championships',
  },
};

interface Filters {
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  minPrice: number;
  maxPrice: number;
}

export default function Home() {
  const location = useLocation();
  const events = useStore((state) => state.events);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    startDate: '',
    endDate: '',
    country: '',
    city: '',
    minPrice: 0,
    maxPrice: 1000,
  });
  const heroImages = useStore((state) => state.heroImages);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

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

  const featuredEvents = events
    .filter(event => event.capacity - event.bookedSeats < event.capacity * 0.5)
    .slice(0, 6);

  const filteredEvents = events.filter((event) => {
    if (selectedCategory && event.category !== selectedCategory) return false;
    
    if (filters.startDate && event.date < filters.startDate) return false;
    if (filters.endDate && event.date > filters.endDate) return false;
    
    const [city, country] = event.location.split(', ');
    if (filters.country && country !== filters.country) return false;
    if (filters.city && city !== filters.city) return false;
    
    if (event.price < filters.minPrice || event.price > filters.maxPrice) return false;
    
    return true;
  });

  const currentHero = selectedCategory
    ? heroContent[selectedCategory as keyof typeof heroContent]
    : heroContent.default;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative mb-8">
        <img
          src={currentHero.image}
          alt="Hero"
          className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center p-4 text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">{currentHero.title}</h1>
            <p className="text-base sm:text-xl">{currentHero.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Date Range
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Location
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Country</option>
                {locations.countries.sort().map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select City</option>
                {locations.cities.sort().map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Price Range
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedCategory && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events` : 'All Events'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
              No events found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}