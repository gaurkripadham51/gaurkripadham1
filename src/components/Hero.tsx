import React, { useState } from 'react';

const images = [
  'https://i.ibb.co/NXRWKwX/bhagwat-katha-09-to-15-hame-page-2.png',
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
    <div className="relative flex flex-col bg-white">
      {/* Image Section */}
      <div
        className="
          relative 
          bg-white
          h-[65vh] 
          sm:h-[75vh] 
          md:h-[85vh] 
          lg:h-[90vh]
          flex items-center justify-center
        "
      >
        <img
          src={images[currentIndex]}
          alt="Gaur Kripa Dham"
          className="
            w-auto
            h-full
            max-w-[98%]
            object-contain
            transition-all 
            duration-500 
            ease-in-out
          "
        />

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={prevImage}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
              bg-orange-600 text-white rounded-full text-xl font-bold 
              hover:bg-orange-700 transition duration-300"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
              bg-orange-600 text-white rounded-full text-xl font-bold 
              hover:bg-orange-700 transition duration-300"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center text-white px-4 py-4 bg-orange-500">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3">
          Welcome to Gaur Kripa Dham
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl">
          Serving the Divine through Devotion and Service
        </p>
      </div>
    </div>
  );
};

export default Hero;
