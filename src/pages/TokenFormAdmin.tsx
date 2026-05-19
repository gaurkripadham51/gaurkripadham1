// =======================================
// TokenFormAdmin.jsx
// =======================================

import React, { useState } from "react";
import QRCode from "react-qr-code";

const TokenFormAdmin = () => {

  const [selectedDate, setSelectedDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [records, setRecords] =
    useState([]);

  const [shareDate, setShareDate] =
    useState("");

  const [generatedLink, setGeneratedLink] =
    useState("");



  const API_URL =
    "https://script.google.com/macros/s/AKfycbwdDEh6K3lkLQw3YDetcIibcO5ZXkn7LAwpchKvW2fkn8xU-O9avLt9auf3InsBIm5f/exec";



  // =======================================
  // SEARCH DATA
  // =======================================

  const searchData = async () => {

    if (!selectedDate) {

      alert("Please select date");
      return;
    }

    try {

      setLoading(true);

      const parts =
        selectedDate.split("-");

      const formattedDate =
        `${parts[2]}-${parts[1]}-${parts[0]}`;

      const response =
        await fetch(
          `${API_URL}?admin=true&date=${formattedDate}`
        );

      const data =
        await response.json();

      if (data.success) {

        setRecords(
          data.records
        );

      } else {

        setRecords([]);

        alert(
          data.message
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };



  // =======================================
  // GENERATE LINK
  // =======================================

  const generateTokenLink = () => {

    if (!shareDate) {

      alert(
        "Please select date"
      );

      return;
    }

    const parts =
      shareDate.split("-");

    const formattedDate =
      `${parts[2]}-${parts[1]}-${parts[0]}`;

    const url =
      `https://shrisankatmochalmandal.netlify.app/TokenForm?date=${formattedDate}`;

    setGeneratedLink(url);
  };



  // =======================================
  // CREATE QR IMAGE
  // =======================================

  const createQRImage = (callback) => {

    const svg =
      document.getElementById(
        "qr-code"
      );

    const svgData =
      new XMLSerializer()
        .serializeToString(svg);

    const canvas =
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext("2d");

    const img =
      new Image();

    img.onload = () => {

      // Canvas Size
      canvas.width = 600;
      canvas.height = 700;

      // Background
      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Heading
      ctx.fillStyle = "#ea580c";

      ctx.font =
        "bold 32px Arial";

      ctx.textAlign =
        "center";

      ctx.fillText(
        "Scan QR For Token",
        canvas.width / 2,
        70
      );

      // QR Size
      const qrSize = 350;

      // Center Position
      const x =
        (canvas.width - qrSize) / 2;

      const y = 120;

      // Draw QR
      ctx.drawImage(
        img,
        x,
        y,
        qrSize,
        qrSize
      );

      // Footer Text
      ctx.fillStyle = "#2563eb";

      ctx.font =
        "20px Arial";

      ctx.fillText(
        "Open link after scanning",
        canvas.width / 2,
        530
      );

      callback(canvas);
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(svgData);
  };



  // =======================================
  // DOWNLOAD QR
  // =======================================

  const downloadQR = () => {

    createQRImage(
      (canvas) => {

        const pngFile =
          canvas.toDataURL(
            "image/png"
          );

        const downloadLink =
          document.createElement(
            "a"
          );

        downloadLink.download =
          "token-qr.png";

        downloadLink.href =
          pngFile;

        downloadLink.click();
      }
    );
  };



  // =======================================
  // SHARE QR
  // =======================================

  const shareOnWhatsapp = async () => {

    try {

      createQRImage(
        async (canvas) => {

          canvas.toBlob(
            async (blob) => {

              const file =
                new File(
                  [blob],
                  "token-qr.png",
                  {
                    type:
                      "image/png",
                  }
                );

              if (
                navigator.canShare &&
                navigator.canShare({
                  files: [file],
                })
              ) {

                await navigator.share({

                  title:
                    "Token QR",

                  text:
                    "Scan this QR to generate token",

                  files: [file],

                });

              } else {

                alert(
                  "Sharing not supported on this device"
                );
              }

            },
            "image/png"
          );
        }
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to share QR"
      );
    }
  };



  return (

    <div className="min-h-screen bg-orange-50 flex justify-center pt-10 px-4 pb-10">

      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6">

        {/* ======================================= */}
        {/* HEADING */}
        {/* ======================================= */}

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Token Admin Panel
        </h1>



        {/* ======================================= */}
        {/* QR GENERATOR */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold text-orange-600 mb-5">
            Generate QR Code
          </h2>



          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="date"
              value={shareDate}
              onChange={(e) =>
                setShareDate(
                  e.target.value
                )
              }
              className="border rounded-md px-4 py-2 w-full"
            />



            <button
              onClick={
                generateTokenLink
              }
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
            >
              Generate QR
            </button>

          </div>



          {/* QR CODE */}

          {generatedLink && (

            <div className="mt-8 bg-white border rounded-2xl p-6 flex flex-col items-center">

              <div className="bg-white p-4 rounded-xl shadow">

                <QRCode
                  id="qr-code"
                  value={
                    generatedLink
                  }
                  size={220}
                />

              </div>



              <p className="mt-5 text-sm break-all text-center text-blue-600">
                {generatedLink}
              </p>



              {/* BUTTONS */}

              <div className="flex flex-col md:flex-row gap-3 mt-6 w-full md:w-auto">

                <button
                  onClick={
                    downloadQR
                  }
                  className="bg-black text-white px-6 py-2 rounded-md"
                >
                  Download QR
                </button>



                <button
                  onClick={
                    shareOnWhatsapp
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                >
                  Share QR On WhatsApp
                </button>

              </div>

            </div>

          )}

        </div>



        {/* ======================================= */}
        {/* GET TOKEN LIST */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold text-orange-600 mb-5">
            Get Token List
          </h2>



          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="border rounded-md px-4 py-2 w-full"
            />



            <button
              onClick={searchData}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
            >

              {loading
                ? "Searching..."
                : "Search"}

            </button>

          </div>



          {/* ======================================= */}
          {/* TABLE */}
          {/* ======================================= */}

          <div className="overflow-auto rounded-xl border bg-white">

            <table className="w-full border-collapse">

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

                  records.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={index}
                        className="hover:bg-orange-50"
                      >

                        <td className="border p-3 font-semibold">
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

                    )
                  )

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

    </div>
  );
};

export default TokenFormAdmin;