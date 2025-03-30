import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/festivals', label: 'Festivals' },
    { path: '/programs', label: 'Programs' },
    { path: '/donations', label: 'Donations' },
    { path: '/EkadashiKirtanList', label: 'Ekadashi Kirtan List' },
    { path: '/bhajanlist', label: 'Bhajan List' },
    { path: '/books', label: 'Prakshit Granth' },
    
  ];

  const devoteeSubItems = [
    { path: '/InitiationForm', label: 'Initiation Form' },
    { path: '/DevoteeList', label: 'Devotee List' },
  ];

  const handleNavigation = (path) => {
    setIsOpen(false);
    setShowDropdown(false);
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
            <img className="h-12 w-auto hover:scale-110 transition-transform" src="https://i.ibb.co/5hfwjfL5/logo.png" alt="Logo" />
            <span className="text-white font-bold text-lg hover:scale-105 transition-transform">Gaur Kripa Dham</span>
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

            {/* Devotee Dropdown */}
            <div
  className="relative"
  onMouseEnter={() => setTimeout(() => setShowDropdown(true), 5)}
  onMouseLeave={() => setTimeout(() => setShowDropdown(false), 5)}
>
  <button className="flex items-center text-white hover:bg-orange-700 px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-transform">
    Devotees Details
    <ChevronDown className="ml-1 w-4 h-4" />
  </button>

  {showDropdown && (
    <div className="absolute right-0 bg-orange-400/80 text-white rounded shadow-md mt-2 w-56 z-50 backdrop-blur-sm">
      {devoteeSubItems.map((subItem) => (
        <button
          key={subItem.path}
          onClick={() => handleNavigation(subItem.path)}
          className="block text-left w-full px-4 py-2 hover:bg-orange-500"
        >
          {subItem.label}
        </button>
      ))}
    </div>
  )}
</div>
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
          {[...navItems, { label: 'Devotees Details', path: null }].map((item) =>
            item.path ? (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-orange-700"
              >
                {item.label}
              </button>
            ) : (
              <div key="devotee-sub" className="text-white font-semibold mt-2">Devotees Details</div>
            )
          )}

          {/* Mobile Submenu */}
          {devoteeSubItems.map((sub) => (
            <button
              key={sub.path}
              onClick={() => handleNavigation(sub.path)}
              className="text-white block w-full text-left px-6 py-2 rounded-md text-sm hover:bg-orange-500 bg-orange-400/80"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// Inject fade-out CSS (or move to a global CSS file)
document.body.insertAdjacentHTML(
  'beforeend',
  `<style>
    .fade-out {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  </style>`
);
