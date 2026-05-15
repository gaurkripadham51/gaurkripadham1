// =======================================
// TokenFormAdmin.jsx
// =======================================

import React, { useState } from "react";

const TokenFormAdmin = () => {

  const [selectedDate, setSelectedDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [records, setRecords] =
    useState([]);

  const API_URL =
  "https://script.google.com/macros/s/AKfycbwdDEh6K3lkLQw3YDetcIibcO5ZXkn7LAwpchKvW2fkn8xU-O9avLt9auf3InsBIm5f/exec";



  const searchData = async () => {

    if (!selectedDate) {
      alert("Please select date");
      return;
    }

    try {

      setLoading(true);

      // yyyy-mm-dd → dd-mm-yyyy
      const parts = selectedDate.split("-");

      const formattedDate =
        `${parts[2]}-${parts[1]}-${parts[0]}`;

      const response = await fetch(
        `${API_URL}?admin=true&date=${formattedDate}`
      );

      const data = await response.json();

      if (data.success) {

        setRecords(data.records);

      } else {

        setRecords([]);
        alert(data.message);
      }

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-orange-50 flex justify-center pt-10 px-4">

    <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6">
  
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        Token Admin Panel
      </h1>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="border rounded-md px-4 py-2 w-full"
          />

          <button
            onClick={searchData}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>



        {/* TABLE */}
        <div className="overflow-auto">

          <table className="w-full border-collapse border">

            <thead>

              <tr className="bg-orange-100">

                <th className="border p-3">
                  Token
                </th>

                <th className="border p-3">
                  Name
                </th>

                <th className="border p-3">
                  City
                </th>

                <th className="border p-3">
                  Mobile
                </th>

                <th className="border p-3">
                  Members
                </th>

                <th className="border p-3">
                  Created At
                </th>

              </tr>

            </thead>


            <tbody>

              {records.length > 0 ? (

                records.map((item, index) => (

                  <tr key={index}>

                    <td className="border p-3">
                      {item.token}
                    </td>

                    <td className="border p-3">
                      {item.name}
                    </td>

                    <td className="border p-3">
                      {item.city}
                    </td>

                    <td className="border p-3">
                      {item.mobile}
                    </td>

                    <td className="border p-3">
                      {item.members}
                    </td>

                    <td className="border p-3">
                      {item.createdAt}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-5"
                  >
                    No Data Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default TokenFormAdmin;