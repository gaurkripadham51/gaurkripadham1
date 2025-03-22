import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import YoutubeLive from '../components/YoutubeLive';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import ChatBot from '../components/chatbot'
import EkadashiPanel from '../components/EkadashiPanel';
import WelcomeOverlay from '../components/WelcomeOverlay';

const Home = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      <Hero className="mb-10" />
      <div className="container mx-auto px-4">
        <About className="mb-10 p-6 bg-white shadow-lg rounded-lg" />
        <Services className="mb-10 p-6 bg-white shadow-lg rounded-lg" />
        <Gallery className="p-6 bg-white shadow-lg rounded-lg" />
        <YoutubeLive className="p-6 bg-white shadow-lg rounded-lg" />
        <ChatBot/>
        <EkadashiPanel/>
        <WelcomeOverlay/>
      </div>
    </div>
  );
};

export default Home;
