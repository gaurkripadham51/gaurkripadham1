// ============================
// React Token Form Component
// ============================

import React, {
  useEffect,
  useState,
} from "react";

import html2canvas from "html2canvas";

const TokenForm = () => {

  const [form, setForm] =
    useState({
      name: "",
      city: "",
      mobile: "",
      members: "",
    });

  const [token, setToken] =
    useState("");

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

  const [errorPopup, setErrorPopup] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [invalidQRCode, setInvalidQRCode] =
    useState(false);



  // =========================
  // API URL
  // =========================

  const API_URL =
    "https://script.google.com/macros/s/AKfycbwdDEh6K3lkLQw3YDetcIibcO5ZXkn7LAwpchKvW2fkn8xU-O9avLt9auf3InsBIm5f/exec";



  // =========================
  // CHECK QR DATE
  // (unchanged - QR is only valid for today's date)
  // =========================

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const urlDate =
      params.get("date");

    if (!urlDate) {

      setInvalidQRCode(true);
      return;
    }

    const today =
      new Date();

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const year =
      today.getFullYear();

    const todayDate =
      `${day}-${month}-${year}`;

    if (urlDate !== todayDate) {

      setInvalidQRCode(true);

    }

  }, []);



  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value } =
      e.target;

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
  // SHARE TOKEN
  // =========================

  const shareToken = async () => {

    try {

      // MOBILE SHARE IMAGE
      if (
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
      ) {

        const element =
          document.getElementById(
            "token-share-card"
          );

        const canvas =
          await html2canvas(
            element
          );

        canvas.toBlob(
          async (blob) => {

            const file =
              new File(
                [blob],
                "token.png",
                {
                  type: "image/png",
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
                  "Token Generated",

                text:
                  "Your token has been generated",

                files: [file],

              });

            } else {

              alert(
                "Sharing not supported"
              );
            }

          },
          "image/png"
        );

      }

      // WEB SHARE TEXT
      else {

        const today =
          new Date();

        const day = String(
          today.getDate()
        ).padStart(2, "0");

        const month = String(
          today.getMonth() + 1
        ).padStart(2, "0");

        const year =
          today.getFullYear();

        const formattedDate =
          `${day}-${month}-${year}`;

        const text =
          `Token Generated Successfully\n\nName: ${form.name}\nToken Number: ${token}\nDate: ${formattedDate}`;

        window.open(

          `https://wa.me/?text=${encodeURIComponent(text)}`,

          "_blank"
        );
      }

    } catch (err) {

      console.log(err);

      alert(
        "Failed to share token"
      );
    }
  };



  // =========================
  // GENERATE TOKEN
  // (time-window validation removed - date check
  // is already handled above via the QR's ?date= param)
  // =========================

  const generateToken = async (e) => {

    e.preventDefault();

    if (
      !form.name ||
      !form.city ||
      !form.mobile ||
      !form.members
    ) {

      setErrorMessage(
        "Please fill all fields"
      );

      setErrorPopup(true);

      return;
    }



    // =========================
    // API CALL
    // =========================

    try {

      setLoading(true);

      const formData =
        new URLSearchParams();

      Object.entries(form).forEach(
        ([key, value]) => {

          formData.append(
            key,
            value
          );

        }
      );



      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            body: formData,
          }
        );



      const data =
        await response.json();



      if (data.success) {

        setToken(
          data.tokenNumber
        );

        setShowPopup(true);

      } else {

        setErrorMessage(
          "Failed to generate token"
        );

        setErrorPopup(true);
      }

    } catch (err) {

      console.log(err);

      setErrorMessage(
        "Something went wrong"
      );

      setErrorPopup(true);

    } finally {

      setLoading(false);
    }
  };



  // =========================
  // GET TOKEN
  // =========================

  const getToken = async () => {

    if (!searchMobile) {

      setErrorMessage(
        "Enter mobile number"
      );

      setErrorPopup(true);

      return;
    }

    try {

      setSearchLoading(true);

      const today =
        new Date();

      const day = String(
        today.getDate()
      ).padStart(2, "0");

      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");

      const year =
        today.getFullYear();

      const sheetName =
        `${day}-${month}-${year}`;

      const response =
        await fetch(

          `${API_URL}?mobile=${searchMobile}&sheetName=${sheetName}`

        );

      const data =
        await response.json();

      if (data.success) {

        setFetchedToken(
          data.tokenNumber
        );

      } else {

        setFetchedToken("");

        setErrorMessage(
          "Token not found"
        );

        setErrorPopup(true);
      }

    } catch (err) {

      console.log(err);

      setErrorMessage(
        "Something went wrong"
      );

      setErrorPopup(true);

    } finally {

      setSearchLoading(false);
    }
  };



  // =========================
  // INVALID QR PAGE
  // =========================

  if (invalidQRCode) {

    return (

      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">

        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg text-center">

          <div className="text-6xl mb-4">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Wrong QR Code Scanned
          </h1>

          <p className="text-gray-700 text-lg mb-3">
            Please scan today's latest QR Code to generate token.
          </p>

          <p className="text-gray-700 text-lg">
            कृपया आज का नया QR Code स्कैन करें टोकन जनरेट करने के लिए।
          </p>

        </div>

      </div>

    );
  }



  return (

    <div className="min-h-screen bg-orange-50 flex items-start justify-center pt-10 px-4 pb-10">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Generate Token
        </h1>



        {/* FORM */}

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



        {/* GET TOKEN SECTION */}

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



          {/* TOKEN RESULT */}

          {fetchedToken && (

            <div className="mt-5 text-center bg-blue-100 p-4 rounded-lg">

              <p className="text-lg font-semibold">
                Your Token Number
              </p>

              <p className="text-3xl font-bold mt-2 text-blue-700">
                {fetchedToken}
              </p>

            </div>

          )}

        </div>

      </div>



      {/* SUCCESS POPUP */}

      {showPopup && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div
            id="token-share-card"
            className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80"
          >

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

            <div className="flex flex-col gap-3 mt-6">

              <button
                onClick={shareToken}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Share Token
              </button>

              <button
                onClick={() => {

                  setShowPopup(false);

                  setForm({
                    name: "",
                    city: "",
                    mobile: "",
                    members: "",
                  });

                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}



      {/* GENERATE LOADING */}

      {loading && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="flex justify-center mb-4">

              <div className="h-14 w-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

            </div>

            <h2 className="text-xl font-bold text-orange-600">
              Generating Token...
            </h2>

          </div>

        </div>

      )}



      {/* SEARCH LOADING */}

      {searchLoading && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="flex justify-center mb-4">

              <div className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

            </div>

            <h2 className="text-xl font-bold">
              Fetching Token...
            </h2>

          </div>

        </div>

      )}



      {/* ERROR POPUP */}

      {errorPopup && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">

            <div className="text-5xl mb-3">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold text-red-600">
              Error
            </h2>

            <p className="mt-4 text-gray-700">
              {errorMessage}
            </p>

            <button
              onClick={() =>
                setErrorPopup(false)
              }
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
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
