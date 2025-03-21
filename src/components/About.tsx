import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Gaur Kirpa Dham
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-orange-600 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src="https://i.ibb.co/3VgWMBs/temple-Deity.jpg"
              alt="Temple Interior"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-600 text-lg mb-6">
              Gaur Kirpa Dham is dedicated to spreading the message of
              Bhagavad-gita and promoting spiritual life based on the teachings
              of Lord Krishna and Lord Chaityna Mahaprabhu. Our temple serves as
              a spiritual sanctuary for devotees and visitors alike.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              We offer various spiritual programs, including daily aartis,
              bhajan sessions, prasadam distribution, and educational programs
              for all age groups.
            </p>
            <motion.button
              className="bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-700 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
