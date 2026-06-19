// =======================================
// RoomBookingForm.jsx
// Room Booking Page
//   Step 1: enter stay dates + guest count -> Search Available Rooms
//   Step 2: pick a room from dropdown (capacity + extra bedding aware)
//   Step 3: fill guest details -> Book Room
// + Room Status (occupancy) checker by date
// Backend: Google Apps Script + Google Sheet
// =======================================

import React, { useState } from "react";

// =======================================
// CHANGE THIS to your deployed Apps Script Web App URL
// =======================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzxOeJWJ5K07N2uFILqe7l1l2VIesucTFoFJKP9QECxWPuYHNN250RyDC-238L1RkeOGA/exec";

const RoomBookingForm = () => {

  // ---- stay details ----
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adultMale, setAdultMale] = useState("");
  const [adultFemale, setAdultFemale] = useState("");
  const [child, setChild] = useState("");

  // ---- room search ----
  const [searching, setSearching] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [searched, setSearched] = useState(false);

  // ---- guest details ----
  const [name, setName] = useState("");
  const [gender, setGender] = useState(""); // "Male" | "Female"
  const [mobile, setMobile] = useState("");
  const [aadhar4, setAadhar4] = useState("");
  const [bookedBy, setBookedBy] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // ---- occupancy section ----
  const [occDate, setOccDate] = useState("");
  const [occLoading, setOccLoading] = useState(false);
  const [occResult, setOccResult] = useState(null);



  const totalGuests =
    (Number(adultMale) || 0) +
    (Number(adultFemale) || 0) +
    (Number(child) || 0);



  // =======================================
  // RESET FORM (after a successful booking)
  // =======================================

  const resetForm = () => {
    setCheckIn("");
    setCheckOut("");
    setAdultMale("");
    setAdultFemale("");
    setChild("");
    setAvailableRooms([]);
    setSelectedRoom("");
    setSearched(false);
    setName("");
    setGender("");
    setMobile("");
    setAadhar4("");
    setBookedBy("");
  };



  // =======================================
  // any change in stay details invalidates the
  // previously searched room list
  // =======================================

  const onStayDetailChange = () => {
    setAvailableRooms([]);
    setSelectedRoom("");
    setSearched(false);
  };



  // =======================================
  // SEARCH AVAILABLE ROOMS
  // =======================================

  const searchAvailableRooms = async () => {

    if (!checkIn || !checkOut) {
      alert("Check-in और Check-out date चुनें");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date, Check-in date के बाद की होनी चाहिए");
      return;
    }

    if (totalGuests <= 0) {
      alert("कम से कम 1 guest (Male/Female/Child) count डालें");
      return;
    }

    setSearching(true);
    setSearched(false);
    setSelectedRoom("");

    try {

      const response = await fetch(
        `${API_URL}?action=availableRooms&checkIn=${checkIn}&checkOut=${checkOut}&guests=${totalGuests}`
      );

      const data = await response.json();

      if (data.success) {

        setAvailableRooms(data.rooms);
        setSearched(true);

      } else {

        alert(data.message || "Search failed");
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setSearching(false);
    }
  };



  // =======================================
  // SUBMIT BOOKING
  // =======================================

  const submitBooking = async () => {

    if (!selectedRoom) {
      alert("पहले एक Room select करें");
      return;
    }

    if (!name || !mobile || !gender) {
      alert("Name, Gender और Mobile Number भरें");
      return;
    }

    if (aadhar4 && aadhar4.length !== 4) {
      alert("Aadhar के last 4 digit ही डालें");
      return;
    }

    setSubmitting(true);
    setBookingResult(null);

    try {

      const payload = {
        name,
        gender,
        mobile,
        adultMale: adultMale || 0,
        adultFemale: adultFemale || 0,
        child: child || 0,
        checkIn,
        checkOut,
        aadhar4,
        bookedBy,
        roomNumber: selectedRoom,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {

        setBookingResult(data);
        resetForm();

      } else {

        alert(data.message || "Booking failed");

        // room might have just been taken - refresh the list
        searchAvailableRooms();
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setSubmitting(false);
    }
  };



  // =======================================
  // CHECK OCCUPANCY BY DATE
  // =======================================

  const checkOccupancy = async () => {

    if (!occDate) {
      alert("Date चुनें");
      return;
    }

    setOccLoading(true);
    setOccResult(null);

    try {

      const response = await fetch(
        `${API_URL}?action=occupancy&date=${occDate}`
      );

      const data = await response.json();

      if (data.success) {

        setOccResult(data);

      } else {

        alert(data.message || "Failed to fetch");
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setOccLoading(false);
    }
  };



  return (

    <div className="min-h-screen bg-orange-50 flex justify-center px-3 py-6 sm:px-4 sm:py-10">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">

        <h1 className="text-xl sm:text-3xl font-bold text-center text-orange-600 mb-8">
          Room Booking
        </h1>



        {/* ======================================= */}
        {/* STEP 1 - STAY DETAILS + SEARCH */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6 mb-6">

          <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-1">
            Step 1 - Stay Details
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            Dates और guests डाल कर उपलब्ध rooms search करें
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  onStayDetailChange();
                }}
                className="border rounded-md px-3 py-2 w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  onStayDetailChange();
                }}
                className="border rounded-md px-3 py-2 w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Adult - Male
              </label>
              <input
                type="number"
                min="0"
                value={adultMale}
                onChange={(e) => {
                  setAdultMale(e.target.value);
                  onStayDetailChange();
                }}
                className="border rounded-md px-3 py-2 w-full mt-1"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Adult - Female
              </label>
              <input
                type="number"
                min="0"
                value={adultFemale}
                onChange={(e) => {
                  setAdultFemale(e.target.value);
                  onStayDetailChange();
                }}
                className="border rounded-md px-3 py-2 w-full mt-1"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Child
              </label>
              <input
                type="number"
                min="0"
                value={child}
                onChange={(e) => {
                  setChild(e.target.value);
                  onStayDetailChange();
                }}
                className="border rounded-md px-3 py-2 w-full mt-1"
                placeholder="0"
              />
            </div>

            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Total Guests:{" "}
                <span className="font-bold text-orange-600">
                  {totalGuests}
                </span>
              </p>
            </div>

          </div>

          <button
            onClick={searchAvailableRooms}
            disabled={searching}
            className="mt-5 w-full md:w-auto bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-8 py-3 rounded-md font-semibold"
          >
            {searching ? "Searching..." : "Search Available Rooms"}
          </button>

        </div>



        {/* ======================================= */}
        {/* STEP 2 - SELECT ROOM (dropdown) */}
        {/* ======================================= */}

        {searched && (

          <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6 mb-6">

            <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-1">
              Step 2 - Select Room
            </h2>

            {availableRooms.length === 0 ? (

              <p className="text-red-600 text-sm mt-3">
                इन dates / guest count के लिए कोई room उपलब्ध नहीं है।
              </p>

            ) : (

              <>

                <p className="text-gray-500 text-sm mb-3">
                  {availableRooms.length} room(s) उपलब्ध हैं — नीचे select करें
                </p>

                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="border rounded-md px-3 py-3 w-full"
                >
                  <option value="">-- Room चुनें --</option>

                  {availableRooms.map((r) => (
                    <option key={r.roomNumber} value={r.roomNumber}>
                      Room {r.roomNumber} - {r.roomType} (Capacity{" "}
                      {r.capacity}
                      {r.extraBedding > 0
                        ? ` + ${r.extraBedding} extra bed`
                        : ""}
                      , Max {r.maxOccupancy})
                    </option>
                  ))}

                </select>

              </>

            )}

          </div>

        )}



        {/* ======================================= */}
        {/* STEP 3 - GUEST DETAILS + BOOK */}
        {/* ======================================= */}

        {selectedRoom && (

          <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6 mb-10">

            <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-5">
              Step 3 - Guest Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="Guest Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, ""))
                  }
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="10 digit mobile"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Gender
                </label>

                <div className="flex gap-5">

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={gender === "Male"}
                      onChange={() =>
                        setGender(gender === "Male" ? "" : "Male")
                      }
                      className="w-5 h-5 accent-orange-600"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={gender === "Female"}
                      onChange={() =>
                        setGender(gender === "Female" ? "" : "Female")
                      }
                      className="w-5 h-5 accent-orange-600"
                    />
                    Female
                  </label>

                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Aadhar Card (Last 4 digit)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhar4}
                  onChange={(e) =>
                    setAadhar4(e.target.value.replace(/\D/g, ""))
                  }
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="XXXX"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Room Booked By
                </label>
                <input
                  type="text"
                  value={bookedBy}
                  onChange={(e) => setBookedBy(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="Staff / Person name"
                />
              </div>

            </div>

            <button
              onClick={submitBooking}
              disabled={submitting}
              className="mt-6 w-full md:w-auto bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-8 py-3 rounded-md font-semibold"
            >
              {submitting ? "Booking हो रही है..." : "Book Room"}
            </button>

          </div>

        )}



        {/* BOOKING SUCCESS RESULT */}

        {bookingResult && (

          <div className="mb-10 bg-green-50 border border-green-300 rounded-xl p-4 text-center">

            <p className="text-green-700 font-bold text-lg">
              Booking Confirmed ✅
            </p>

            <p className="text-gray-700 mt-1">
              Allotted Room No.{" "}
              <span className="font-bold text-orange-600 text-xl">
                {bookingResult.room}
              </span>
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Booking ID: {bookingResult.bookingId}
            </p>

          </div>

        )}



        {/* ======================================= */}
        {/* OCCUPANCY BY DATE */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6">

          <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-5">
            Room Status (Date wise)
          </h2>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="date"
              value={occDate}
              onChange={(e) => setOccDate(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
            />

            <button
              onClick={checkOccupancy}
              disabled={occLoading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-2 rounded-md whitespace-nowrap"
            >
              {occLoading ? "Checking..." : "Check Status"}
            </button>

          </div>



          {occResult && (

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">

              <div className="bg-white border rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-800">
                  {occResult.totalRooms}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Total Rooms
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-2xl font-bold text-red-600">
                  {occResult.filled}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Filled
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-2xl font-bold text-green-600">
                  {occResult.available}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Available
                </p>
              </div>

            </div>

          )}

          {occResult && occResult.filledRoomNumbers?.length > 0 && (

            <p className="mt-4 text-sm text-gray-600 text-center break-words">
              Filled Rooms:{" "}
              <span className="font-medium text-gray-800">
                {occResult.filledRoomNumbers.join(", ")}
              </span>
            </p>

          )}

        </div>

      </div>

    </div>
  );
};

export default RoomBookingForm;
