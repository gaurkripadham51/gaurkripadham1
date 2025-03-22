import React, { useState } from 'react';

const AdminPanel = () => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [embeddedLink, setEmbeddedLink] = useState('');
  const [dailyPhotos, setDailyPhotos] = useState([]);

  // Ekadashi states
  const [ekadashiTitle, setEkadashiTitle] = useState('');
  const [ekadashiDate, setEkadashiDate] = useState('');
  const [ekadashiPhotos, setEkadashiPhotos] = useState([]);

  const handleLinkUpload = () => {
    if (!youtubeLink.trim()) {
      alert('YouTube link cannot be blank.');
      return;
    }

    if (!youtubeLink.includes('youtube.com/watch?v=')) {
      alert('Please enter a valid YouTube link.');
      return;
    }

    const embedUrl = youtubeLink.replace('watch?v=', 'embed/');
    setEmbeddedLink(embedUrl);
    setYoutubeLink('');
  };

  const handlePhotoUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    if (type === 'daily') {
      setDailyPhotos(previews);
    } else if (type === 'ekadashi') {
      setEkadashiPhotos(previews);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 mt-20 bg-white shadow-md rounded-xl border">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Admin Panel
      </h2>

      {/* YouTube Section */}
      <div className="mb-10">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          YouTube Link
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <button
            onClick={handleLinkUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Embed
          </button>
        </div>

        {embeddedLink && (
          <div className="mt-6 aspect-video rounded-lg overflow-hidden shadow">
            <iframe
              src={embeddedLink}
              title="YouTube Video"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
      </div>

      {/* Daily Photo Upload */}
      <div className="mb-10">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Upload Daily Photos
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e, 'daily')}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />

        {dailyPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {dailyPhotos.map((src, idx) => (
              <div key={idx} className="overflow-hidden rounded shadow">
                <img
                  src={src}
                  alt={`Daily ${idx}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ekadashi Upload */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Upload Ekadashi Details
        </h3>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Ekadashi Title"
            value={ekadashiTitle}
            onChange={(e) => setEkadashiTitle(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <input
            type="date"
            value={ekadashiDate}
            onChange={(e) => setEkadashiDate(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e, 'ekadashi')}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />

        {(ekadashiTitle || ekadashiDate || ekadashiPhotos.length > 0) && (
          <div className="mt-6">
            {(ekadashiTitle || ekadashiDate) && (
              <div className="mb-4">
                <h4 className="text-xl font-semibold text-gray-700">
                  {ekadashiTitle} {ekadashiDate && `- ${ekadashiDate}`}
                </h4>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ekadashiPhotos.map((src, idx) => (
                <div key={idx} className="overflow-hidden rounded shadow">
                  <img
                    src={src}
                    alt={`Ekadashi ${idx}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
