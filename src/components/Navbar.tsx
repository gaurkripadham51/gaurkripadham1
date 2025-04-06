import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    /*
    { path: '/schedule', label: 'Schedule' },
    { path: '/festivals', label: 'Festivals' },
    { path: '/programs', label: 'Programs' },
    { path: '/donations', label: 'Donations' },
    { path: '/bhajanlist', label: 'Bhajan List' },
    */
  ];

  // Devotee items hidden (dropdown removed)
  // const devoteeSubItems = [
  //   { path: '/InitiationForm', label: 'Initiation Form' },
  //   { path: '/DevoteeList', label: 'Devotee List' },
  // ];

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
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img
              className="h-12 w-auto hover:scale-110 transition-transform"
              src="https://i.ibb.co/HMg30Kh/Whats-App-Image-2025-04-01-at-22-04-18-removebg-preview.png"
              alt="Logo"
            />
            <span className="text-white font-bold text-lg hover:scale-105 transition-transform">
              Acharya Rajesh Nag Shastri
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-white hover:bg-orange-700 px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-transform"
              >
                {item.label}
              </button>
            ))}
            {/* 🔻 Devotees Dropdown hidden from desktop */}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-orange-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-orange-600 px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-orange-700"
            >
              {item.label}
            </button>
          ))}
          {/* 🔻 Devotees section hidden from mobile */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// 🔧 Inject fade-out transition style
document.body.insertAdjacentHTML(
  'beforeend',
  `<style>
    .fade-out {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  </style>`
);
