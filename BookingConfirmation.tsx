import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function BookingConfirmation() {
  const location = useLocation();
  const { success, bookingId } = location.state || {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {success ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. Booking ID: {bookingId}
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Booking Failed</h1>
            <p className="text-gray-600 mb-6">
              Sorry, there was an error processing your booking. Please try again.
            </p>
          </>
        )}
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
}