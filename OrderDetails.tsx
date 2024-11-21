import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useStore } from '../store';

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, quantity, totalAmount } = location.state || {};
  const event = useStore((state) => state.events.find((e) => e.id === eventId));

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleContinue = () => {
    navigate('/payment', { 
      state: { 
        eventId: event.id,
        quantity,
        totalAmount
      } 
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-6">
          <img
            src={event.image}
            alt={event.title}
            className="w-48 h-32 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.capacity - event.bookedSeats} seats available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 pt-6">
          <div className="flex justify-between mb-2">
            <span>Ticket Price</span>
            <span>${event.price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Quantity</span>
            <span>{quantity} tickets</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}