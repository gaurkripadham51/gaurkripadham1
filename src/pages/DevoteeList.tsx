import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbw98AgJ3g0vImhIUbLom7O2O_e7emOp4P4S5gjygw41OvuudC5LMF2j41cZB74FjWzHsw/exec';

const DevoteeList = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    initiatedName: '',
    city: '',
    state: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const normalizeData = (rawData: any[]) => {
    return rawData.map((item) => ({
      legalName: item['Legal Name'] || '',
      initiatedName: item['Initiated Name'] || '',
      initiationDate: item['Initiation Date'] || '',
      phoneNumber: item['PhoneNumber'] || '',
      address: item['Address'] || '',
      city: item['City'] || '',
      state: item['State'] || '',
      pincode: item['Pincode'] || item['Pincode '] || '',
      nearbyCentre: item['Nearby Centre'] || '',
      createdAt: item['Created At'] || '',
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_URL);
        const json = await res.json();
        const parsed = normalizeData(json.data || json);
        setData(parsed);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = data
    .filter((item) => {
      return (
        item.initiatedName.toLowerCase().includes(filters.initiatedName.toLowerCase()) &&
        item.city.toLowerCase().includes(filters.city.toLowerCase()) &&
        item.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField]?.toLowerCase?.() || '';
      const valB = b[sortField]?.toLowerCase?.() || '';
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleTempFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Initiated Devotees List</h2>

        {/* Filter Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <input
              name="initiatedName"
              value={tempFilters.initiatedName}
              onChange={handleTempFilterChange}
              placeholder="Filter by Initiated Name"
              className="border rounded-md px-4 py-2"
            />
            <input
              name="city"
              value={tempFilters.city}
              onChange={handleTempFilterChange}
              placeholder="Filter by City"
              className="border rounded-md px-4 py-2"
            />
            <input
              name="state"
              value={tempFilters.state}
              onChange={handleTempFilterChange}
              placeholder="Filter by State"
              className="border rounded-md px-4 py-2"
            />
            <div className="col-span-full sm:col-span-1 flex justify-end sm:justify-start">
              <button
                onClick={applyFilters}
                className="mt-2 sm:mt-0 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-100 text-left">
                  <th className="p-2 border cursor-pointer" onClick={() => handleSort('legalName')}>
                    Legal Name {sortField === 'legalName' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-2 border cursor-pointer" onClick={() => handleSort('initiatedName')}>
                    Initiated Name {sortField === 'initiatedName' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-2 border cursor-pointer" onClick={() => handleSort('city')}>
                    City {sortField === 'city' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-2 border cursor-pointer" onClick={() => handleSort('state')}>
                    State {sortField === 'state' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-orange-50">
                    <td className="p-2 border">{row.legalName}</td>
                    <td className="p-2 border">{row.initiatedName}</td>
                    <td className="p-2 border">{row.city}</td>
                    <td className="p-2 border">{row.state}</td>
                    <td className="p-2 border">{row.phoneNumber}</td>
                    <td className="p-2 border">{row.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">No data found</div>
        )}
      </div>
    </div>
  );
};

export default DevoteeList;
