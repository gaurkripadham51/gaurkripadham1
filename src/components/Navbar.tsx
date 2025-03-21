import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/festivals', label: 'Festivals' },
    { path: '/programs', label: 'Programs' },
    { path: '/donations', label: 'Donations' },
  ];

  const handleNavigation = (path) => {
    setIsOpen(false);
    document.body.classList.add('fade-out');
    setTimeout(() => {
      navigate(path);
      document.body.classList.remove('fade-out');
    }, 300);
  };

  return (
    <nav className="bg-orange-600 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Text */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <img
              className="h-12 w-auto transition-transform duration-500 transform hover:scale-110"
              src="https://i.ibb.co/5hfwjfL5/logo.png"
              alt="Gaur Kripa Dham"
            />
            <span className="text-white font-bold text-lg hover:scale-105 transition-transform duration-300">
              Gaur Kripa Dham
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="text-white hover:bg-orange-700 px-3 py-2 rounded-md text-sm font-medium transition-transform duration-300 transform hover:scale-105"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-orange-700 focus:outline-none transition-transform duration-300 transform hover:rotate-90"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden transition-opacity duration-500 ease-in-out opacity-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-orange-700 transition-transform duration-300 transform hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// Add this CSS for smooth fade-out transition
document.body.insertAdjacentHTML(
  'beforeend',
  `
  <style>
    .fade-out {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  </style>
`
);
