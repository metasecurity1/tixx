import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Music, Theater, Users, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    navigate('/', { state: { category } });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 font-bold text-xl">EventHub</span>
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => handleCategoryClick('concerts')}
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <Music className="h-4 w-4 mr-1" />
                Concerts
              </button>
              <button
                onClick={() => handleCategoryClick('theater')}
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <Theater className="h-4 w-4 mr-1" />
                Theater, Comedy & Art
              </button>
              <button
                onClick={() => handleCategoryClick('workshops')}
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <Users className="h-4 w-4 mr-1" />
                Workshops
              </button>
              <button
                onClick={() => handleCategoryClick('sports')}
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <User className="h-4 w-4 mr-1" />
                Sports
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/admin"
              className="text-gray-900 hover:text-indigo-600"
            >
              Admin Panel
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-900 hover:text-indigo-600"
            >
              User Panel
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-indigo-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleCategoryClick('concerts')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
            >
              <Music className="h-4 w-4 inline-block mr-2" />
              Concerts
            </button>
            <button
              onClick={() => handleCategoryClick('theater')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
            >
              <Theater className="h-4 w-4 inline-block mr-2" />
              Theater, Comedy & Art
            </button>
            <button
              onClick={() => handleCategoryClick('workshops')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
            >
              <Users className="h-4 w-4 inline-block mr-2" />
              Workshops
            </button>
            <button
              onClick={() => handleCategoryClick('sports')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Sports
            </button>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              User Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}