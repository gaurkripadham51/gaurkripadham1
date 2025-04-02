import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">
            हिमाचल ज्योतिष केंद्र
            </h3>
            <p className="text-gray-400">
            हमारे पूज्य गुरुजी के मार्गदर्शन में संचालित संपूर्ण ज्योतिष केंद्र आपकी जीवन की समस्याओं का सटीक समाधान प्रदान करता है। 
            यहां वैदिक ज्योतिष, कुंडली विश्लेषण, ग्रहदोष निवारण, रत्न परामर्श, विवाह मिलान, मुहूर्त निर्धारण, और अन्य ज्योतिषीय सेवाएं उपलब्ध हैं।
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">
              Contact Information
            </h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-400">
                <Phone size={20} className="mr-2 text-orange-400" />
                +91 98184 85071
              </p>
              <p className="flex items-center text-gray-400">
                <Mail size={20} className="mr-2 text-orange-400" />
                rajeshnagshastri@gmail.com
              </p>
              <p className="flex items-center text-gray-400">
                <MapPin size={20} className="mr-2 text-orange-400" />
                31/8 Sant Nagar Near Rani public school, Burari , Delhi 110084
              </p>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, link: 'https://www.facebook.com/GaurdasJi' },
                { icon: Twitter, link: 'https://x.com/GaurdasJi' },
                {
                  icon: Instagram,
                  link: 'https://www.instagram.com/shrigaurdasjimaharaj',
                },
                {
                  icon: Youtube,
                  link: 'https://www.youtube.com/@ShriGaurdasJiMaharaj',
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="text-gray-400">
            © 2025 Gaur Kripa Dham, Vrindavan. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
