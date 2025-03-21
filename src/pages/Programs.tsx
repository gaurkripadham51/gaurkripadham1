import React from 'react';
import { motion } from 'framer-motion';
import { Book, Music, Users, Star } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: <Book className="w-12 h-12 text-orange-600" />,
      title: 'Bhagavad Gita Classes',
      schedule: 'Every Monday & Thursday, 6:30 PM',
      description:
        'In-depth study and discussion of Bhagavad Gita verses with practical life applications.',
    },
    {
      icon: <Music className="w-12 h-12 text-orange-600" />,
      title: 'Kirtan Sessions',
      schedule: 'Every Saturday, 5:00 PM',
      description:
        'Experience the bliss of devotional music and chanting in community.',
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: 'Youth Program',
      schedule: 'Every Sunday, 4:00 PM',
      description:
        'Special programs for youth including spiritual discussions, activities, and cultural events.',
    },
    {
      icon: <Star className="w-12 h-12 text-orange-600" />,
      title: 'Sunday Feast',
      schedule: 'Every Sunday, 6:30 PM',
      description:
        'Weekly gathering with kirtan, lecture, and free prasadam distribution.',
    },
  ];

  return (
    <div className="pt-16">
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Regular Programs
            </h1>
            <motion.div
              className="w-20 h-1 bg-orange-600 mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our regular spiritual programs and activities designed to
              enhance your spiritual journey.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">{program.icon}</div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-orange-600 font-medium mb-3">
                      {program.schedule}
                    </p>
                    <p className="text-gray-600">{program.description}</p>
                    <motion.button
                      className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Register Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Special Programs
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                className="text-center p-6 border rounded-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  New Devotee Program
                </h3>
                <p className="text-gray-600">
                  Introduction to Krishna Consciousness for newcomers
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 border rounded-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  Marriage Counseling
                </h3>
                <p className="text-gray-600">
                  Spiritual guidance for married couples
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
