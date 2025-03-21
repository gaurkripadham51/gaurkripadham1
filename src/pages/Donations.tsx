import React from 'react';
import { Heart, DollarSign, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const Donations = () => {
  const donationCategories = [
    {
      icon: <Heart className="w-12 h-12 text-orange-600" />,
      title: 'Temple Development',
      description: 'Support the expansion and maintenance of temple facilities',
      suggested: ['₹1,100', '₹5,100', '₹11,000'],
    },
    {
      icon: <DollarSign className="w-12 h-12 text-orange-600" />,
      title: 'Prasadam Distribution',
      description: 'Help us serve free prasadam to devotees and visitors',
      suggested: ['₹501', '₹1,001', '₹2,101'],
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: 'Educational Programs',
      description: 'Support spiritual education and youth programs',
      suggested: ['₹1,001', '₹2,001', '₹5,001'],
    },
    {
      icon: <Building className="w-12 h-12 text-orange-600" />,
      title: 'Festival Celebrations',
      description: 'Contribute to grand festival celebrations',
      suggested: ['₹2,100', '₹5,100', '₹11,000'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pt-16"
    >
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Our Temple
            </h1>
            <div className="w-20 h-1 bg-orange-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your generous donations help us maintain the temple services and
              expand our spiritual programs.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {donationCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-center mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {category.description}
                </p>
                <div className="space-y-3">
                  {category.suggested.map((amount, idx) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={idx}
                      className="w-full bg-orange-100 text-orange-600 py-2 rounded-full hover:bg-orange-600 hover:text-white transition duration-300"
                    >
                      {amount}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition duration-300"
                >
                  Custom Amount
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">
              For additional information about donations or to make a bank
              transfer, please contact us.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition duration-300"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Donations;
