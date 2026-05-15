// ============================
// React Token Form Component
// ============================

import React, { useState } from "react";

const TokenForm = () => {

  const [form, setForm] = useState({
    name: "",
    city: "",
    mobile: "",
    members: "",
  });

  const [token, setToken] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  const [searchMobile, setSearchMobile] =
    useState("");

  const [fetchedToken, setFetchedToken] =
    useState("");

  const [searchLoading, setSearchLoading] =
    useState(false);



  const API_URL =
    "https://script.google.com/macros/s/AKfycbwdDEh6K3lkLQw3YDetcIibcO5ZXkn7LAwpchKvW2fkn8xU-O9avLt9auf3InsBIm5f/exec";



  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (
      name === "mobile" &&
      !/^\d*$/.test(value)
    ) return;

    setForm({
      ...form,
      [name]: value,
    });
  };



  // =========================
  // GENERATE TOKEN
  // =========================

  const generateToken = async (e) => {

    e.preventDefault();

    if (
      !form.name ||
      !form.city ||
      !form.mobile ||
      !form.members
    ) {

      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const formData =
        new URLSearchParams();

      Object.entries(form).forEach(
        ([key, value]) => {

          formData.append(key, value);

        }
      );

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (data.success) {

        setToken(data.tokenNumber);

        setShowPopup(true);

        // RESET FORM
        setForm({
          name: "",
          city: "",
          mobile: "",
          members: "",
        });

      } else {

        alert(
          "Failed to generate token"
        );
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };



  // =========================
  // GET TOKEN
  // =========================

  const getToken = async () => {

    if (!searchMobile) {

      alert("Enter mobile number");
      return;
    }

    try {

      setSearchLoading(true);

      const response = await fetch(
        `${API_URL}?mobile=${searchMobile}`
      );

      const data =
        await response.json();

      if (data.success) {

        setFetchedToken(
          data.tokenNumber
        );

      } else {

        setFetchedToken("");
        alert("Token not found");
      }

    } catch (err) {

      console.log(err);

    } finally {

      setSearchLoading(false);
    }
  };



  return (

    <div className="min-h-screen bg-orange-50 flex items-start justify-center pt-10 px-4 pb-10">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Generate Token
        </h1>



        {/* ========================= */}
        {/* FORM */}
        {/* ========================= */}

        <form
          onSubmit={generateToken}
          className="space-y-5"
        >

          <div>

            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              placeholder="Enter name"
            />

          </div>



          <div>

            <label className="block mb-1 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              placeholder="Enter city"
            />

          </div>



          <div>

            <label className="block mb-1 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              name="mobile"
              maxLength={10}
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              placeholder="Enter mobile number"
            />

          </div>



          <div>

            <label className="block mb-1 font-medium">
              Members
            </label>

            <input
              type="number"
              name="members"
              value={form.members}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              placeholder="No of members"
            />

          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold"
          >

            {loading
              ? "Generating..."
              : "Generate Token"}

          </button>

        </form>



        {/* ========================= */}
        {/* GET TOKEN */}
        {/* ========================= */}

        <div className="mt-10 border-t pt-8">

          <h2 className="text-2xl font-bold text-center text-orange-600 mb-5">
            Get Your Token
          </h2>


          <input
            type="text"
            placeholder="Enter mobile number"
            value={searchMobile}
            onChange={(e) =>
              setSearchMobile(
                e.target.value
              )
            }
            className="w-full border rounded-md px-4 py-2"
          />


          <button
            onClick={getToken}
            disabled={searchLoading}
            className="w-full mt-4 bg-black text-white py-3 rounded-md font-semibold"
          >

            {searchLoading
              ? "Searching..."
              : "Get Token"}

          </button>



          {fetchedToken && (

            <div className="mt-5 text-center bg-blue-100 p-4 rounded-lg">

              <p className="text-lg font-semibold">
                Your Token Number
              </p>

              <p className="text-3xl font-bold mt-2">
                {fetchedToken}
              </p>

            </div>

          )}

        </div>

      </div>



      {/* ========================= */}
      {/* GENERATE TOKEN LOADING */}
      {/* ========================= */}

      {loading && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="flex justify-center mb-4">

              <div className="h-14 w-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

            </div>

            <h2 className="text-xl font-bold text-orange-600">
              Generating Token...
            </h2>

            <p className="text-gray-500 mt-2">
              Please wait
            </p>

          </div>

        </div>

      )}



      {/* ========================= */}
      {/* GET TOKEN LOADING */}
      {/* ========================= */}

      {searchLoading && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="flex justify-center mb-4">

              <div className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

            </div>

            <h2 className="text-xl font-bold">
              Fetching Token...
            </h2>

            <p className="text-gray-500 mt-2">
              Please wait
            </p>

          </div>

        </div>

      )}



      {/* ========================= */}
      {/* SUCCESS POPUP */}
      {/* ========================= */}

      {showPopup && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="text-6xl mb-3">
              🎉
            </div>

            <h2 className="text-2xl font-bold text-green-600">
              Token Generated
            </h2>

            <p className="mt-4 text-gray-600">
              Your Token Number
            </p>

            <p className="text-4xl font-bold text-orange-600 mt-2">
              {token}
            </p>

            <button
              onClick={() =>
                setShowPopup(false)
              }
              className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default TokenForm;