// =======================================
// TokenFormAdmin.jsx
// =======================================

import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";

// =======================================
// AAVASHYAK PUJA SAMAGRI - CATEGORY DATA
// =======================================

const SAMAGRI_CATEGORIES = [
  {
    id: "arji",
    title: "अर्जी का सामान",
    items: [
      { name: "नारियल सूखा (बजने वाला)", qty: "1 नग" },
      { name: "सूती लाल कपड़ा", qty: "सवा मीटर" },
      { name: "देवी देवताओं के नाम के", qty: "₹ 11/-" },
      { name: "पित्तरों के नाम के", qty: "₹ 10/-" },
      { name: "गौ सेवा", qty: "₹ 11/-" },
      { name: "शुद्ध देसी घी", qty: "250 ग्रा." },
      { name: "तिल का तेल (ज्योत के लिए)", qty: "500 ग्रा." },
      { name: "भोग के लिए मिठाई", qty: "½ कि. / 1 कि." },
      { name: "मिट्टी (घर / दुकान / फैक्ट्री)", qty: "" },
    ],
  },
  {
    id: "mata",
    title: "माता के मन्दिर के लिए",
    items: [
      { name: "नारियल पानी वाला", qty: "1 नग" },
      { name: "माँ के लिए बड़ी चुनरी", qty: "1 नग" },
      { name: "त्रिशूल (छोटा/बड़ा) बिना स्टैंड का", qty: "1 नग" },
      { name: "माँ के लिये श्रृंगार का सामान", qty: "1 पैकेट" },
    ],
  },
  {
    id: "hanuman",
    title: "हनुमान जी के चोले का सामान",
    items: [
      { name: "सिन्दूर (चोले वाला)", qty: "100 ग्रा." },
      { name: "चमेली का तेल", qty: "100 ग्रा." },
      { name: "जनेऊ", qty: "1 नग" },
      { name: "चांदी का वर्क (हिमालय कं. का वर्क न लें)", qty: "1 पैकेट" },
      { name: "इलायची दाना", qty: "1 पैकेट" },
      { name: "गुड़-चने का प्रसाद", qty: "1 पैकेट" },
    ],
  },
];

// returns today's date as "YYYY-MM-DD" (the format <input type="date">
// expects/returns), used to default the date pickers to today.
const getTodayInputDate = () => {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TokenFormAdmin = () => {

  const [selectedDate, setSelectedDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [records, setRecords] =
    useState([]);

  const [shareDate, setShareDate] =
    useState(getTodayInputDate());

  const [generatedLink, setGeneratedLink] =
    useState("");

  // ---- Aavashyak Puja Samagri state ----

  // samagriItemChecked is keyed by "<categoryId>-<itemIndex>" -> true/false
  const [samagriItemChecked, setSamagriItemChecked] =
    useState({});

  const [samagriSharing, setSamagriSharing] =
    useState(false);

  const samagriCanvasRef = useRef(null);

  // ---- Admin "Generate Token" state ----

  const [tokenForm, setTokenForm] = useState({
    name: "",
    city: "",
    mobile: "",
    members: "",
  });

  const [tokenDate, setTokenDate] = useState(getTodayInputDate());

  const [tokenGenLoading, setTokenGenLoading] =
    useState(false);

  const [generatedTokenNumber, setGeneratedTokenNumber] =
    useState("");

  const [tokenGenError, setTokenGenError] =
    useState("");

  // snapshot of the fields used to generate the last token
  // (form gets cleared after success, popup still needs these)
  const [lastGeneratedToken, setLastGeneratedToken] =
    useState(null);

  const [showTokenPopup, setShowTokenPopup] =
    useState(false);



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
  // ADMIN - GENERATE TOKEN (any date)
  // Reuses the same fields/API call pattern as TokenForm.jsx's
  // generateToken, plus a date field so admin can generate a
  // token for any date, not just today.
  // =======================================

  const handleTokenFormChange = (e) => {

    setTokenForm({
      ...tokenForm,
      [e.target.name]: e.target.value,
    });
  };

  const generateTokenAdmin = async () => {

    setTokenGenError("");

    if (
      !tokenForm.name ||
      !tokenForm.city ||
      !tokenForm.mobile ||
      !tokenForm.members ||
      !tokenDate
    ) {

      setTokenGenError("Please fill all fields including date");
      return;
    }

    try {

      setTokenGenLoading(true);

      // tokenDate comes from <input type="date"> as "YYYY-MM-DD",
      // convert to "dd-MM-yyyy" (same convention used elsewhere
      // in this app, e.g. searchData's formattedDate / TokenForm's
      // sheetName) so the backend can create the token under the
      // correct date instead of defaulting to today.
      const parts = tokenDate.split("-");
      const sheetName = `${parts[2]}-${parts[1]}-${parts[0]}`;

      const formData = new URLSearchParams();

      Object.entries(tokenForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("sheetName", sheetName);
      formData.append("date", sheetName);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {

        setGeneratedTokenNumber(data.tokenNumber);

        setLastGeneratedToken({
          name: tokenForm.name,
          city: tokenForm.city,
          mobile: tokenForm.mobile,
          members: tokenForm.members,
          token: data.tokenNumber,
          date: sheetName,
        });

        setShowTokenPopup(true);

        setTokenForm({
          name: "",
          city: "",
          mobile: "",
          members: "",
        });

        setTokenDate(getTodayInputDate());

      } else {

        setGeneratedTokenNumber("");
        setTokenGenError(data.message || "Failed to generate token");
      }

    } catch (err) {

      console.log(err);
      setTokenGenError("Something went wrong");

    } finally {

      setTokenGenLoading(false);
    }
  };



  // =======================================
  // CREATE TOKEN SHARE IMAGE
  // Drawn directly on a <canvas> (no DOM screenshot library) so
  // there's no dependency on html2canvas - which fails on mobile
  // when the page uses Tailwind's modern oklch/oklab colors that
  // html2canvas can't parse. This avoids that error entirely.
  // =======================================

  const createTokenShareImage = (callback) => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 600;
    canvas.height = 560;

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // border
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.textAlign = "center";

    // title
    ctx.fillStyle = "#16a34a";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Token Generated", canvas.width / 2, 80);

    // token number label
    ctx.fillStyle = "#6b7280";
    ctx.font = "20px Arial";
    ctx.fillText("Your Token Number", canvas.width / 2, 130);

    // token number
    ctx.fillStyle = "#ea580c";
    ctx.font = "bold 52px Arial";
    ctx.fillText(lastGeneratedToken.token, canvas.width / 2, 200);

    // details
    ctx.textAlign = "left";
    ctx.fillStyle = "#374151";
    ctx.font = "22px Arial";

    const lines = [
      `Name: ${lastGeneratedToken.name}`,
      `City: ${lastGeneratedToken.city}`,
      `Mobile: ${lastGeneratedToken.mobile}`,
      `Members: ${lastGeneratedToken.members}`,
      `Date: ${lastGeneratedToken.date}`,
    ];

    let lineY = 270;

    lines.forEach((line) => {
      ctx.fillText(line, 60, lineY);
      lineY += 42;
    });

    callback(canvas);
  };



  // =======================================
  // SHARE GENERATED TOKEN (admin)
  // Same robust pattern as RoomBookingForm's shareBookingOnWhatsapp -
  // navigator.share is only used when file-sharing is actually
  // supported (isMobile + canShare). Every other case (desktop, or
  // mobile without file-share support) downloads the image and
  // opens WhatsApp with the text, so the image is never silently
  // dropped and there's no AbortError on desktop.
  // =======================================

  const shareTokenAdmin = async () => {

    if (!lastGeneratedToken) return;

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const shareText =
      `Token Generated Successfully\n\n` +
      `Name: ${lastGeneratedToken.name}\n` +
      `City: ${lastGeneratedToken.city}\n` +
      `Mobile: ${lastGeneratedToken.mobile}\n` +
      `Members: ${lastGeneratedToken.members}\n` +
      `Token Number: ${lastGeneratedToken.token}\n` +
      `Date: ${lastGeneratedToken.date}`;

    try {

      createTokenShareImage((canvas) => {

        canvas.toBlob(async (blob) => {

          try {

            const file = new File(
              [blob],
              "token.png",
              { type: "image/png" }
            );

            if (
              isMobile &&
              navigator.canShare &&
              navigator.canShare({ files: [file] })
            ) {

              await navigator.share({
                title: "Token Generated",
                text: shareText,
                files: [file],
              });

            } else {

              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "token.png";
              link.click();
              URL.revokeObjectURL(url);

              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                "_blank"
              );
            }

          } catch (err) {

            if (err && err.name === "AbortError") {
              console.log("Share cancelled by user");
            } else {
              console.log(err);
            }
          }

        }, "image/png");
      });

    } catch (err) {

      console.log(err);
      alert("Failed to share token");
    }
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

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const shareText =
      "Scan this QR to generate token";

    try {

      createQRImage(
        async (canvas) => {

          canvas.toBlob(
            async (blob) => {

              try {

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
                  isMobile &&
                  navigator.canShare &&
                  navigator.canShare({
                    files: [file],
                  })
                ) {

                  await navigator.share({

                    title:
                      "Token QR",

                    text: shareText,

                    files: [file],

                  });

                } else if (isMobile && navigator.share) {

                  await navigator.share({
                    title: "Token QR",
                    text: shareText,
                  });

                } else {

                  // desktop - no share targets, so download the
                  // image and open a wa.me link instead of calling
                  // navigator.share (which throws AbortError here)
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "token-qr.png";
                  link.click();
                  URL.revokeObjectURL(url);

                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                    "_blank"
                  );
                }

              } catch (err) {

                if (err && err.name === "AbortError") {
                  console.log("Share cancelled by user");
                } else {
                  console.log(err);
                }
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



  // =======================================
  // AAVASHYAK PUJA SAMAGRI - ITEM LEVEL SELECTION
  // =======================================

  const samagriItemKey = (catId, idx) => `${catId}-${idx}`;

  const isSamagriItemChecked = (catId, idx) =>
    !!samagriItemChecked[samagriItemKey(catId, idx)];

  const toggleSamagriItem = (catId, idx) => {

    const key = samagriItemKey(catId, idx);

    setSamagriItemChecked((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };



  // a category counts as "selected" the moment even 1 of
  // its items below is checked - this drives the category
  // checkbox showing as ticked automatically
  const isSamagriCategoryAnySelected = (cat) =>
    cat.items.some((_, idx) => isSamagriItemChecked(cat.id, idx));

  const isSamagriCategoryFullySelected = (cat) =>
    cat.items.every((_, idx) => isSamagriItemChecked(cat.id, idx));



  // clicking the category checkbox itself = select / clear
  // every item under that category in one go
  const toggleSamagriCategory = (cat) => {

    const fullySelected = isSamagriCategoryFullySelected(cat);

    setSamagriItemChecked((prev) => {

      const updated = { ...prev };

      cat.items.forEach((_, idx) => {
        updated[samagriItemKey(cat.id, idx)] = !fullySelected;
      });

      return updated;
    });
  };



  // only categories that have at least 1 checked item, and
  // only the checked items inside them - this is what goes
  // into the shared text / image
  const selectedSamagriData = SAMAGRI_CATEGORIES
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((_, idx) =>
        isSamagriItemChecked(cat.id, idx)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const hasSamagriSelection =
    selectedSamagriData.length > 0;



  const selectAllSamagri = () => {

    const all = {};

    SAMAGRI_CATEGORIES.forEach((cat) => {
      cat.items.forEach((_, idx) => {
        all[samagriItemKey(cat.id, idx)] = true;
      });
    });

    setSamagriItemChecked(all);
  };



  const clearAllSamagri = () =>
    setSamagriItemChecked({});



  // =======================================
  // BUILD SHARE TEXT (samagri)
  // =======================================

  const buildSamagriShareText = () => {

    let text =
      "🙏 श्री संकट मोचन बालाजी चैरिटेबल ट्रस्ट 🙏\n";

    text += "आवश्यक पूजा सामग्री\n\n";

    selectedSamagriData.forEach((cat) => {

      text += `*${cat.title}*\n`;

      cat.items.forEach((item, idx) => {

        text += `${idx + 1}. ${item.name}${
          item.qty ? " - " + item.qty : ""
        }\n`;
      });

      text += "\n";
    });

    return text.trim();
  };



  // =======================================
  // CREATE SAMAGRI LIST IMAGE ON CANVAS
  // =======================================

  const createSamagriListImage = (callback) => {

    const canvas =
      samagriCanvasRef.current ||
      document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    const lineHeight = 34;
    const headingGap = 50;

    let totalLines = 0;

    selectedSamagriData.forEach((cat) => {

      totalLines += 1;
      totalLines += cat.items.length;
      totalLines += 0.6;
    });

    const width = 720;

    const height =
      220 + totalLines * lineHeight + 100;

    canvas.width = width;
    canvas.height = height;

    // background
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, width, height);

    // border
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // header
    ctx.fillStyle = "#ea580c";
    ctx.textAlign = "center";
    ctx.font = "bold 30px Arial";

    ctx.fillText(
      "श्री संकट मोचन बालाजी चैरिटेबल ट्रस्ट",
      width / 2,
      60
    );

    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 24px Arial";

    ctx.fillText(
      "आवश्यक पूजा सामग्री",
      width / 2,
      100
    );

    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 120);
    ctx.lineTo(width - 40, 120);
    ctx.stroke();

    // content
    let y = 160;

    ctx.textAlign = "right";

    selectedSamagriData.forEach((cat) => {

      ctx.fillStyle = "#c2410c";
      ctx.font = "bold 24px Arial";

      ctx.fillText(cat.title, width - 40, y);

      y += headingGap;

      ctx.fillStyle = "#111827";
      ctx.font = "20px Arial";

      cat.items.forEach((item, idx) => {

        const line = `${idx + 1}.  ${item.name}${
          item.qty ? "   —   " + item.qty : ""
        }`;

        ctx.fillText(line, width - 60, y);

        y += lineHeight;
      });

      y += 20;
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#2563eb";
    ctx.font = "18px Arial";

    ctx.fillText(
      "होम डिलिवरी: वायु पुत्र पूजा की दुकान",
      width / 2,
      y + 20
    );

    callback(canvas);
  };



  // =======================================
  // SHARE SAMAGRI LIST ON WHATSAPP
  // =======================================

  const shareSamagriOnWhatsapp = async () => {

    if (!hasSamagriSelection) {

      alert(
        "कृपया कम से कम एक category चुनें"
      );

      return;
    }

    setSamagriSharing(true);

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {

      createSamagriListImage(
        async (canvas) => {

          canvas.toBlob(
            async (blob) => {

              try {

                const file =
                  new File(
                    [blob],
                    "puja-samagri-list.png",
                    {
                      type: "image/png",
                    }
                  );

                if (
                  isMobile &&
                  navigator.canShare &&
                  navigator.canShare({
                    files: [file],
                  })
                ) {

                  await navigator.share({

                    title:
                      "आवश्यक पूजा सामग्री",

                    text:
                      buildSamagriShareText(),

                    files: [file],
                  });

                } else if (
                  isMobile &&
                  navigator.share
                ) {

                  await navigator.share({

                    title:
                      "आवश्यक पूजा सामग्री",

                    text:
                      buildSamagriShareText(),
                  });

                } else {

                  // desktop - no share targets, so download the
                  // image and open a wa.me link instead of calling
                  // navigator.share (which throws AbortError here)
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "puja-samagri-list.png";
                  link.click();
                  URL.revokeObjectURL(url);

                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      buildSamagriShareText()
                    )}`,
                    "_blank"
                  );
                }

              } catch (err) {

                if (err && err.name === "AbortError") {
                  console.log("Share cancelled by user");
                } else {
                  console.log(err);
                }

              } finally {

                setSamagriSharing(
                  false
                );
              }
            },
            "image/png"
          );
        }
      );

    } catch (err) {

      console.log(err);

      setSamagriSharing(false);

      alert(
        "Share नहीं हो पाया, फिर से कोशिश करें"
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
        {/* ADMIN - GENERATE TOKEN (any date) */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold text-orange-600 mb-5">
            Generate Token
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={tokenForm.name}
              onChange={handleTokenFormChange}
              className="border rounded-md px-4 py-2 w-full"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={tokenForm.city}
              onChange={handleTokenFormChange}
              className="border rounded-md px-4 py-2 w-full"
            />

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={tokenForm.mobile}
              onChange={handleTokenFormChange}
              className="border rounded-md px-4 py-2 w-full"
            />

            <input
              type="number"
              name="members"
              placeholder="Members"
              value={tokenForm.members}
              onChange={handleTokenFormChange}
              className="border rounded-md px-4 py-2 w-full"
            />

            <input
              type="date"
              value={tokenDate}
              onChange={(e) => setTokenDate(e.target.value)}
              className="border rounded-md px-4 py-2 w-full md:col-span-2"
            />

          </div>

          {tokenGenError && (
            <p className="text-red-600 text-sm mt-3">
              {tokenGenError}
            </p>
          )}

          <button
            onClick={generateTokenAdmin}
            disabled={tokenGenLoading}
            className="mt-5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-2 rounded-md"
          >
            {tokenGenLoading ? "Generating..." : "Generate Token"}
          </button>

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



        {/* ======================================= */}
        {/* AAVASHYAK PUJA SAMAGRI */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6">

          <h2 className="text-2xl font-bold text-orange-600 mb-1">
            आवश्यक पूजा सामग्री
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            Category चुनें और सामान की लिस्ट WhatsApp पर Share करें
          </p>

          {/* SELECT ALL / CLEAR */}

          <div className="flex justify-end gap-3 mb-4 text-xs sm:text-sm">

            <button
              onClick={selectAllSamagri}
              className="text-orange-600 underline"
            >
              Select All
            </button>

            <button
              onClick={clearAllSamagri}
              className="text-gray-500 underline"
            >
              Clear
            </button>

          </div>

          {/* CATEGORY LIST */}

          <div className="space-y-4">

            {SAMAGRI_CATEGORIES.map((cat) => {

              const anySelected =
                isSamagriCategoryAnySelected(cat);

              return (

                <div
                  key={cat.id}
                  className={`border rounded-xl overflow-hidden bg-white transition ${
                    anySelected
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                >

                  {/* CATEGORY HEADER - checkbox here selects/clears ALL items below in one go */}

                  <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer">

                    <span className="font-bold text-orange-700 text-sm sm:text-lg">
                      {cat.title}
                    </span>

                    <input
                      type="checkbox"
                      checked={anySelected}
                      onChange={() =>
                        toggleSamagriCategory(cat)
                      }
                      className="w-5 h-5 accent-orange-600 shrink-0"
                    />

                  </label>



                  {/* ITEM LIST - always visible, each item has its own checkbox */}

                  <div className="px-4 pb-4">

                    <table className="w-full text-xs sm:text-sm border-t">

                      <tbody>

                        {cat.items.map(
                          (item, idx) => {

                            const itemChecked =
                              isSamagriItemChecked(cat.id, idx);

                            return (

                              <tr
                                key={idx}
                                className={`border-b border-orange-100 ${
                                  itemChecked
                                    ? "bg-orange-50"
                                    : ""
                                }`}
                              >

                                <td className="py-2 pl-1 pr-2 w-6">
                                  <input
                                    type="checkbox"
                                    checked={itemChecked}
                                    onChange={() =>
                                      toggleSamagriItem(cat.id, idx)
                                    }
                                    className="w-4 h-4 accent-orange-600"
                                  />
                                </td>

                                <td className="py-2 pr-2 text-gray-800">
                                  {item.name}
                                </td>

                                <td className="py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                                  {item.qty}
                                </td>

                              </tr>

                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              );

            })}

          </div>



          {/* SHARE BUTTON */}

          <div className="mt-8 flex flex-col items-center gap-3">

            <button
              onClick={shareSamagriOnWhatsapp}
              disabled={samagriSharing}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2"
            >

              {samagriSharing
                ? "तैयार हो रहा है..."
                : "📤 Share on WhatsApp"}

            </button>

            {!hasSamagriSelection && (

              <p className="text-xs text-gray-400 text-center">
                Share करने के लिए कम से कम एक category चुनें
              </p>

            )}

          </div>



          {/* hidden canvas used to build the share image */}

          <canvas
            ref={samagriCanvasRef}
            style={{ display: "none" }}
          />

        </div>

      </div>



      {/* ======================================= */}
      {/* ADMIN GENERATE TOKEN - SUCCESS POPUP */}
      {/* same UI as TokenForm.jsx's success popup */}
      {/* ======================================= */}

      {showTokenPopup && lastGeneratedToken && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div
            id="admin-token-share-card"
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
              {lastGeneratedToken.token}
            </p>

            <div className="mt-5 text-left text-sm text-gray-700 space-y-1">

              <p><span className="font-semibold">Name:</span> {lastGeneratedToken.name}</p>
              <p><span className="font-semibold">City:</span> {lastGeneratedToken.city}</p>
              <p><span className="font-semibold">Mobile:</span> {lastGeneratedToken.mobile}</p>
              <p><span className="font-semibold">Members:</span> {lastGeneratedToken.members}</p>
              <p><span className="font-semibold">Date:</span> {lastGeneratedToken.date}</p>

            </div>

            <div className="flex flex-col gap-3 mt-6">

              <button
                onClick={shareTokenAdmin}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Share Token
              </button>

              <button
                onClick={() => {

                  setShowTokenPopup(false);
                  setGeneratedTokenNumber("");
                  setLastGeneratedToken(null);

                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default TokenFormAdmin;
