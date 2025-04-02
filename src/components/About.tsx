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
            हिमाचल ज्योतिष केंद्र के बारे में
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
            हमारे पूज्य गुरुजी के मार्गदर्शन में संचालित संपूर्ण ज्योतिष केंद्र आपकी जीवन की समस्याओं का सटीक समाधान प्रदान करता है। 
            यहां वैदिक ज्योतिष, कुंडली विश्लेषण, ग्रहदोष निवारण, रत्न परामर्श, विवाह मिलान, मुहूर्त निर्धारण, और अन्य ज्योतिषीय सेवाएं उपलब्ध हैं।


            </p>
            <p className="text-gray-600 text-lg mb-6">
            🔹 कुंडली मिलान एवं ज्योतिष परामर्श – जन्म कुंडली के आधार पर जीवन के महत्वपूर्ण पहलुओं पर मार्गदर्शन।
🔹 ग्रह दोष निवारण उपाय – शांति पाठ, रुद्राभिषेक, नवग्रह हवन, महामृत्युंजय जाप आदि।
🔹 रत्न और उपाय परामर्श – उचित रत्न चयन और धारण करने की विधि।
🔹 वास्तु परामर्श – घर, दुकान एवं व्यवसायिक स्थल के लिए वास्तु समाधान।
🔹 मांगलिक एवं विशेष अनुष्ठान – विवाह, गृह प्रवेश, नामकरण, सत्यनारायण कथा आदि।

हमारी सेवाएं शास्त्रों और परंपराओं के अनुसार होती हैं, जिससे भक्तों को जीवन में सकारात्मकता और उन्नति प्राप्त हो।
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
