import React from 'react';
import { motion } from 'framer-motion';

const YoutubeLive = () => {
  const youtubeLiveUrl = 'https://www.youtube.com/embed/KGpMOHq2Fkg';

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-[70vh] bg-orange-500 bg-opacity-80 text-white p-4 rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-4 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Live from Gaur Kirpa Dham
      </motion.h1>
      <motion.div
        className="relative w-full max-w-3xl aspect-w-16 aspect-h-9 border-2 border-white/50 rounded-lg shadow-md overflow-hidden"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <iframe
          className="w-full h-[450px] rounded-md"
          src={youtubeLiveUrl}
          title="Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
};

export default YoutubeLive;
