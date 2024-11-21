import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const availableSeats = event.capacity - event.bookedSeats;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative pt-[60%] sm:pt-[56.25%]">
        <img
          src={event.image}
          alt={event.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{availableSeats} seats available</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-indigo-600">
            ${event.price}
          </span>
          <Link
            to={`/event/${event.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}