import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel: React.FC = () => {
  const [embeddedLink, setEmbeddedLink] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Daily & Ekadashi states remain same
  const [dailyPhotos, setDailyPhotos] = useState<string[]>([]);
  const [ekadashiTitle, setEkadashiTitle] = useState('');
  const [ekadashiDate, setEkadashiDate] = useState('');
  const [ekadashiPhotos, setEkadashiPhotos] = useState<string[]>([]);

  const YOUTUBE_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

  const fetchYouTubeLink = async () => {
    try {
      const res = await axios.get(YOUTUBE_API_URL);
      const rawLink = res.data.link || res.data.values?.[0]?.[0]; // Adjust depending on response shape

      if (!rawLink.includes('youtube.com/watch?v=')) {
        throw new Error('Invalid YouTube link format');
      }

      const embedUrl = rawLink.replace('watch?v=', 'embed/');
      setEmbeddedLink(embedUrl);
      setMessage({ text: 'YouTube link loaded successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to load YouTube link. Check API or format.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchYouTubeLink();

    return () => {
      dailyPhotos.forEach((url) => URL.revokeObjectURL(url));
      ekadashiPhotos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'daily' | 'ekadashi'
  ) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    if (type === 'daily') setDailyPhotos(previews);
    else setEkadashiPhotos(previews);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 mt-20 bg-white shadow-md rounded-xl border">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Admin Panel</h2>

      {/* Message Box */}
      {message && (
        <div
          className={`mb-6 p-3 text-white rounded ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Refresh YouTube Link */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-700">YouTube Live Stream</h3>
          <button
            onClick={fetchYouTubeLink}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
          >
            Refresh Link
          </button>
        </div>

        {embeddedLink && (
          <div className="aspect-video rounded-lg overflow-hidden shadow">
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
        <label className="block text-lg font-medium text-gray-700 mb-2">Upload Daily Photos</label>
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
                <img src={src} alt={`Daily ${idx}`} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ekadashi Photo Upload */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Upload Ekadashi Details</h3>
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
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                {ekadashiTitle} {ekadashiDate && `- ${ekadashiDate}`}
              </h4>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ekadashiPhotos.map((src, idx) => (
                <div key={idx} className="overflow-hidden rounded shadow">
                  <img src={src} alt={`Ekadashi ${idx}`} className="w-full h-48 object-cover" />
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
