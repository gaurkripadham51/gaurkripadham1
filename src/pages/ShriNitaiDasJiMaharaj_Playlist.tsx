import React, { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzewZ_kCtIFbmkA5N2-_X2B1uyCgs_f7cn0f1VNLoS0c7f5e9gDnIgzrJ9rl3I_039LFw/exec";

interface Katha {
  id: string;
  katha_name: string;
  date: string;
  venue: string;
  image_url: string;
}

interface Video {
  katha_id: string;
  title: string;
  youtube_link: string;
  description: string;
}

const ShriNitaiDasJiMaharaj_Playlist = () => {
  const [kathas, setKathas] = useState<Katha[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedKatha, setSelectedKatha] = useState<Katha | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setKathas(json.kathas || []);
        setVideos(json.videos || []);
      } catch (e) {
        console.error("Error fetching katha data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 👉 AUTO SELECT FIRST VIDEO WHEN KATHA CHANGES
  useEffect(() => {
    if (selectedKatha) {
      const firstVideo = videos.find(
        v => v.katha_id === selectedKatha.id
      );
      setCurrentVideo(firstVideo || null);
    }
  }, [selectedKatha, videos]);

  const getEmbedUrl = (url: string) => {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  };

  const filteredVideos = videos.filter(
    v =>
      v.katha_id === selectedKatha?.id &&
      v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4">
      <div className="max-w-screen-2xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-orange-700 mb-8">
          Shri Nitai Das Ji Maharaj Kathas
        </h1>

        {/* ================= KATHA LIST ================= */}
        {!selectedKatha && (
          <>
            {loading ? (
              <p className="text-center text-gray-500">Loading kathas...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kathas.map(katha => (
                  <div
                    key={katha.id}
                    onClick={() => setSelectedKatha(katha)}
                    className="bg-white rounded-xl shadow-md cursor-pointer 
                               hover:shadow-lg transition overflow-hidden"
                  >
                    {/* IMAGE (NO CUT) */}
                    <div className="h-72 bg-orange-50 flex items-center justify-center p-2">
                      <img
                        src={katha.image_url}
                        alt={katha.katha_name}
                        className="max-h-full w-full object-contain"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-orange-800">
                        {katha.katha_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        📅 {katha.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {katha.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ================= PLAYLIST VIEW ================= */}
        {selectedKatha && (
          <>
            {/* BACK BUTTON */}
            <button
              onClick={() => {
                setSelectedKatha(null);
                setCurrentVideo(null);
                setSearch("");
              }}
              className="mb-4 text-orange-600 font-medium"
            >
              ← Back to Katha List
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-4">
              {selectedKatha.katha_name}
            </h2>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search video..."
              className="w-full border rounded-md p-3 mb-4 text-sm sm:text-base"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* MAIN PLAYER */}
              <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 shadow order-1">
                {currentVideo ? (
                  <>
                    <div className="w-full aspect-video rounded overflow-hidden">
                      <iframe
                        src={getEmbedUrl(currentVideo.youtube_link)}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentVideo.title}
                      />
                    </div>

                    <h3 className="mt-3 font-semibold text-base sm:text-lg">
                      {currentVideo.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentVideo.description}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No video available
                  </p>
                )}
              </div>

              {/* SIDE PLAYLIST */}
              <div
                className="bg-white rounded-xl shadow p-3 space-y-3
                           max-h-[320px] lg:max-h-[520px]
                           overflow-y-auto order-2"
              >
                {filteredVideos.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    No videos found
                  </p>
                )}

                {filteredVideos.map((v, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentVideo(v)}
                    className={`p-3 border rounded-lg cursor-pointer transition
                      ${
                        currentVideo?.youtube_link === v.youtube_link
                          ? "bg-orange-100 border-orange-300"
                          : "hover:bg-orange-50"
                      }`}
                  >
                    <h4 className="text-sm sm:text-base font-semibold">
                      {v.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ShriNitaiDasJiMaharaj_Playlist;
