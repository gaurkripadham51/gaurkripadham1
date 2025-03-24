import React, { useEffect, useState } from 'react';

const EkadashiPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ekadashi = {
    title: 'Papankusha Ekadashi',
    date: 'राधेश्याम जी 🙏🙏 सभी वैष्णवजनों का श्री पापमोचनी एकादशी का व्रत 26 मार्च बुधवार को रहेगा। व्रत का पारण अगले दिन प्रातः 6:20 से 9:45 तक रहेगा।',
    description:
      'On this sacred Ekadashi, devotees fast and offer prayers to Lord Vishnu. It is believed to cleanse sins and bring spiritual upliftment.',
    image: 'https://i.ibb.co/5hfwjfL5/logo.png',
    youtube: 'https://www.youtube.com/watch?v=jdo76e0Mg8A',
  };

  const getYoutubeEmbed = (url: string) => {
    if (!url.includes('youtube.com')) return '';
    return url.replace('watch?v=', 'embed/');
  };

  // Optional: Close panel on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <>
      {/* Bottom-left Button */}
      <div className="fixed bottom-6 left-4 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            <span className="hidden sm:inline">Next Ekadashi Details</span>
            <span className="inline sm:hidden">Ekadashi</span>
          </button>
        )}
      </div>

      {/* Panel */}
      <div
        className={`fixed bottom-6 left-4 w-[360px] max-w-[95vw] bg-white rounded-xl shadow-xl z-50 overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
          >
            ×
          </button>

          {/* Content Area */}
          <div className="p-4 pt-10 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold text-red-700">{ekadashi.title}</h2>
            <p className="text-sm font-bold text-gray-500 mb-2">{ekadashi.date}</p>
            <p className="text-gray-700 text-sm mb-4">{ekadashi.description}</p>

            {ekadashi.youtube && (
              <div className="aspect-video w-full rounded overflow-hidden shadow-md">
                <iframe
                  src={getYoutubeEmbed(ekadashi.youtube)}
                  title="Ekadashi YouTube"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EkadashiPanel;
