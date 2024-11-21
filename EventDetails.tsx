import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Minus, Plus } from 'lucide-react';
import { useStore } from '../store';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const event = useStore((state) => 
    state.events.find((e) => e.id === id)
  );

  if (!event) {
    return <div>Event not found</div>;
  }

  const availableSeats = event.capacity - event.bookedSeats;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableSeats) {
      setQuantity(newQuantity);
    }
  };

  const handleBooking = () => {
    navigate('/order-details', { 
      state: { 
        eventId: event.id,
        quantity: quantity,
        totalAmount: event.price * quantity
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{availableSeats} seats available</span>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{event.description}</p>
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                ${event.price}
              </span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={quantity >= availableSeats}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${(event.price * quantity).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}