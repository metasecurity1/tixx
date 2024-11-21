import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, quantity, totalAmount } = location.state;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const event = useStore((state) => 
    state.events.find((e) => e.id === eventId)
  );
  const addBooking = useStore((state) => state.addBooking);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, handle payment processing here
    
    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      userId: 'user-1', // In a real app, get from auth
      quantity,
      totalAmount,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Event</span>
            <span>{event.title}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Quantity</span>
            <span>{quantity}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Price per ticket</span>
            <span>${event.price}</span>
          </div>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${totalAmount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Payment Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              PayPal
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="123"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Pay ${totalAmount}
        </button>
      </form>
    </div>
  );
}