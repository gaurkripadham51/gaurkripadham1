import React from 'react';
import { Calendar } from 'lucide-react';

const festivals = [
  {
    name: 'Upcomings Katha',
    date: 'In year 2025',
    image: '#',
    description:
      "Celebration of Lord Krishna's appearance day with abhishek, cultural programs, and midnight aarti.",
  },
  {
    name: 'Janmashtami',
    date: 'August 2025',
    image: '#',
    description:
      "Celebration of Lord Krishna's appearance day with abhishek, cultural programs, and midnight aarti.",
  },
  {
    name: 'Gaura Purnima',
    date: 'March 2025',
    image: '#',
    description:
      'Festival celebrating the appearance of Sri Chaitanya Mahaprabhu.',
  },
  {
    name: 'Rama Navami',
    date: 'April 2025',
    image: '#',
    description:
      "Celebration of Lord Rama's appearance day with special prayers and cultural events.",
  },
];

const Festivals = () => {
  return (
    <div className="pt-16">
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Festival Calendar
            </h1>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join us in celebrating these auspicious festivals throughout the
              year. Each festival includes special programs and prasadam
              distribution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {festivals.map((festival, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform duration-300 hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {festival.name}
                    </h3>
                    <div className="flex items-center text-orange-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">{festival.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {festival.description}
                  </p>
                  <button className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition duration-300 shadow-md hover:shadow-lg">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Festivals;
