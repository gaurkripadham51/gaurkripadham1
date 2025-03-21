import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    'https://i.ibb.co/MpTrvp2/janamostav.jpg',
    'https://i.ibb.co/jPNGbp74/Maharaji3.jpg',
    'https://i.ibb.co/KjnQSMw3/Maharaj-JIImage1.jpg',
    'https://i.ibb.co/20PtpSdw/gallery2.jpg',
    'https://i.ibb.co/FqXQHDVS/gallery1.jpg',
    'https://i.ibb.co/35xYwLzY/devotees1.jpg',
  ];

  return (
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Temple Gallery
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.6 }}
            className="w-20 h-1 bg-orange-600 mx-auto"
          ></motion.div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <motion.img
                src={image}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-64 object-cover transform hover:scale-105 transition duration-300"
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
