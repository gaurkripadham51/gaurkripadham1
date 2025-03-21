import React from 'react';
import { Clock, Sun, Moon } from 'lucide-react';

const Schedule = () => {
  const schedules = [
    {
      time: '4:30 AM',
      event: 'Mangal Aarti',
      description: 'Early morning worship of the deities',
    },
    {
      time: '7:15 AM',
      event: 'Darshan Aarti',
      description: 'Morning darshan and worship',
    },
    {
      time: '8:30 AM',
      event: 'Shringar Aarti',
      description: 'Deity dressing ceremony',
    },
    {
      time: '12:00 PM',
      event: 'Raj Bhog Aarti',
      description: 'Midday offering and aarti',
    },
    {
      time: '4:30 PM',
      event: 'Utthapan Aarti',
      description: 'Evening awakening ceremony',
    },
    {
      time: '7:00 PM',
      event: 'Sandhya Aarti',
      description: 'Sunset aarti ceremony',
    },
    {
      time: '8:30 PM',
      event: 'Shayan Aarti',
      description: 'Final aarti of the day',
    },
  ];

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-orange-100 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Daily Schedule
            </h1>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Join us in our daily spiritual activities and services. The temple
              is open from 4:30 AM to 8:30 PM every day.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition duration-300 border border-transparent hover:border-orange-400"
              >
                <div className="flex items-center mb-4">
                  {index < 3 ? (
                    <Sun className="w-6 h-6 text-yellow-500 mr-2" />
                  ) : index > 5 ? (
                    <Moon className="w-6 h-6 text-blue-500 mr-2" />
                  ) : (
                    <Clock className="w-6 h-6 text-orange-600 mr-2" />
                  )}
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {item.time}
                  </h3>
                </div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">
                  {item.event}
                </h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
