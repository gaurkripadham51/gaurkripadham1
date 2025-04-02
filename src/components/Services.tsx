import React from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, Users, Music } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Book className="w-12 h-12 text-orange-600" />,
      title: 'कुंडली मिलान एवं ज्योतिष परामर्श',
      description:
        'जन्म कुंडली के आधार पर जीवन के महत्वपूर्ण पहलुओं पर मार्गदर्शन।',
    },
    {
      icon: <Heart className="w-12 h-12 text-orange-600" />,
      title: 'ग्रह दोष निवारण उपाय',
      description: 'शांति पाठ, रुद्राभिषेक, नवग्रह हवन, महामृत्युंजय जाप आदि।',
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: 'रत्न और उपाय परामर्श',
      description: 'उचित रत्न चयन और धारण करने की विधि।',
    },
    {
      icon: <Music className="w-12 h-12 text-orange-600" />,
      title: 'वास्तु परामर्श',
      description: 'घर, दुकान एवं व्यवसायिक स्थल के लिए वास्तु समाधान',
    },{
      icon: <Music className="w-12 h-12 text-orange-600" />,
      title: 'श्रीमद्भागवतम् कथा',
      description: 'भागवत पुराण की कथा करना',
    },
  ];

  return (
    <section id="services" className="py-10 bg-orange-500 bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Seva's
          </h2>
          <div className="w-20 h-1 bg-orange-500 bg-opacity-80 mx-auto"></div>
        </motion.div>

        <motion.div
          className="flex overflow-x-auto space-x-6 py-3 scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="min-w-[250px] p-4 bg-gray-50 rounded-lg text-center hover:shadow-xl transition duration-300 bg-yellow-100"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-3">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
