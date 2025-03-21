import React, { useState } from 'react';

const images = [
  'https://i.ibb.co/7JZCvtrF/Maharaj-JIImage.jpg',
  'https://i.ibb.co/3VgWMBs/temple-Deity.jpg',
  'https://i.ibb.co/35xYwLzY/devotees1.jpg',
  'https://i.ibb.co/jPNGbp74/Maharaji3.jpg',
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative flex flex-col">
      {/* Image container with reduced height */}
      <div className="relative h-[90vh] flex-grow-0">
        <img
          src={images[currentIndex]}
          alt="Gaur Kirpa Dham"
          className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <button
            onClick={prevImage}
            className="w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full text-2xl font-bold hover:bg-orange-700 transition duration-300"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full text-2xl font-bold hover:bg-orange-700 transition duration-300"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Text section with extra margin to prevent overlap */}
      <div className="relative text-center text-white px-4 py-8 bg-orange-500 bg-opacity-80 mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Gaur Kirpa Dham
        </h1>
        <p className="text-xl md:text-2xl">
          Serving the Divine through Devotion and Service
        </p>
      </div>
    </div>
  );
};

export default Hero;
