import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbz1Zxpd6OgNQwVZRkjOAh1YY7KtdbNWvXGjBf6-myeUkiGOhJaLC44Roh8gan_FBf4YKg/exec';

const EkadashiKirtanList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const normalizeData = (rawData: any[]) => {
    return rawData.map((item) => ({
      name: item['Name'] || '',
      address: item['Address'] || '',
      phoneNumber: item['PhoneNumber'] || '',
      city: item['City'] || '',
      state: item['State'] || '',
      country: item['Country'] || '',
      timings: item['Timings'] || '',
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_URL);
        const json = await res.json();
        const parsed = normalizeData(json.data || json);
        const sorted = parsed.sort((a, b) => {
          if (a.state.toLowerCase() < b.state.toLowerCase()) return -1;
          if (a.state.toLowerCase() > b.state.toLowerCase()) return 1;
          if (a.city.toLowerCase() < b.city.toLowerCase()) return -1;
          if (a.city.toLowerCase() > b.city.toLowerCase()) return 1;
          return 0;
        });
        setData(sorted);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, curr) => {
    const state = curr.state || 'Unknown';
    if (!acc[state]) acc[state] = [];
    acc[state].push(curr);
    return acc;
  }, {} as Record<string, typeof data>);

  const handleDownloadCSV = () => {
    const header = ['Name', 'Address', 'Phone Number', 'City', 'State', 'Country', 'Timings'];
    const rows = filteredData.map((d) => [
      d.name,
      d.address,
      d.phoneNumber,
      d.city,
      d.state,
      d.country,
      d.timings,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows]
        .map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'ekadashi_kirtan_list.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Ekadashi Kirtan Devotee List
        </h2>

        {/* Search & Download */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name, city or state"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Download CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-500">No data found</div>
        ) : (
          Object.entries(groupedData).map(([state, devotees]) => (
            <div key={state} className="mb-10">
              <h3 className="text-2xl font-semibold text-orange-700 mb-3">{state}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-100 text-left">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Address</th>
                      <th className="p-2 border">Phone Number</th>
                      <th className="p-2 border">City</th>
                      <th className="p-2 border">Country</th>
                      <th className="p-2 border">Timings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devotees.map((row, index) => (
                      <tr key={index} className="hover:bg-orange-50">
                        <td className="p-2 border">{row.name}</td>
                        <td className="p-2 border">{row.address}</td>
                        <td className="p-2 border">{row.phoneNumber}</td>
                        <td className="p-2 border">{row.city}</td>
                        <td className="p-2 border">{row.country}</td>
                        <td className="p-2 border">{row.timings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EkadashiKirtanList;
