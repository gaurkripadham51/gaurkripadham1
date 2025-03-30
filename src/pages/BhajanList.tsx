import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbzV2GA_nvQjGTAXRt-hjqZZOq7MkbaoIQaCHVr2Ut89HgxNRuAT4FklJNiT1RLLN8a4uw/exec';

interface BhajanData {
  SNo: string;
  title: string;
  bhajan_youtube_link: string;
  bhajan_youtube_text: string;
  category: string;
}

const BhajanList = () => {
  const [data, setData] = useState<BhajanData[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_URL);
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error('Error fetching Bhajan data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const allCategories = Array.from(new Set(data.map(item => item.category).filter(Boolean))).sort();

  const filtered = data.filter(item => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.bhajan_youtube_text?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group by category
  const grouped: Record<string, BhajanData[]> = {};
  filtered.forEach(item => {
    const key = item.category || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const sortedCategories = Object.keys(grouped).sort();

  return (
  <div className="min-h-screen bg-orange-50 pt-24 px-4"> {/* <-- pt-24 adds top padding */}
  <div className="max-w-screen-2xl mx-auto">
    <h2 className="text-4xl font-bold text-orange-600 text-center mb-8 break-words">
      Bhajan List
    </h2>
  
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title or description..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full lg:w-1/3 border border-gray-300 rounded-md px-4 py-2 shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-600 mb-6">
          Showing <strong>{filtered.length}</strong> bhajans
        </p>

        {/* Bhajan Groups */}
        {loading ? (
          <p className="text-center text-gray-500">Loading bhajans...</p>
        ) : sortedCategories.length === 0 ? (
          <p className="text-center text-gray-500">No bhajans found.</p>
        ) : (
          sortedCategories.map(category => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-semibold text-orange-700 mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[category].map((bhajan, index) => (
                  <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-orange-100 p-3 flex flex-col text-sm"
                >
                  <h4 className="text-base font-semibold text-orange-800 mb-1">{bhajan.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{bhajan.bhajan_youtube_text}</p>
                  <div className="relative w-full pt-[50%]">
                    <iframe
                      src={getYoutubeEmbedUrl(bhajan.bhajan_youtube_link)}
                      title={`Bhajan ${index}`}
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-md border"
                    ></iframe>
                  </div>
                </div>
                
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BhajanList;
