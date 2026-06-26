// =======================================
// RoomBookingForm.jsx
// Room Booking Page
//   Step 1: enter stay dates -> Search Available Rooms (date based only)
//   Step 2: pick a room from dropdown
//   Step 3: fill guest details (incl. extra bedding given) -> Book Room
// + Room Status (occupancy) checker by date
// + Manage Bookings (list + cancel with reason) by date
// Backend: Google Apps Script + Google Sheet
// =======================================

import React, { useState, useRef } from "react";
import jsPDF from "jspdf";

// standard checkout time shown alongside the checkout date
const CHECKOUT_TIME_LABEL = "11:00 AM";

// Trust's donation QR code (static image) - same QR is embedded into
// every booking-confirmation share. Place the file at this path inside
// your project's public/ folder (e.g. public/qr-code.png), so it's
// served at this exact URL.
const QR_CODE_IMAGE_PATH = "/qr-code.png";

// =======================================
// CHANGE THIS to your deployed Apps Script Web App URL
// =======================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzxOeJWJ5K07N2uFILqe7l1l2VIesucTFoFJKP9QECxWPuYHNN250RyDC-238L1RkeOGA/exec";

// =======================================
// PDF PAGE LAYOUT (Manage Bookings share)
// Each page is first drawn on a canvas (so Hindi names render
// correctly) then embedded into the PDF as an image.
// =======================================

const PDF_PAGE_WIDTH = 1000;
const PDF_PAGE_HEIGHT = 1000;
const ROWS_PER_PDF_PAGE = 12;

const truncateText = (text, max) => {
  const str = String(text || "");
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
};

const drawBookingsPageCanvas = (pageRows, pageNum, totalPages, dateLabel) => {

  const canvas = document.createElement("canvas");
  canvas.width = PDF_PAGE_WIDTH;
  canvas.height = PDF_PAGE_HEIGHT;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);

  ctx.textAlign = "center";
  ctx.fillStyle = "#ea580c";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Room Bookings", PDF_PAGE_WIDTH / 2, 55);

  ctx.fillStyle = "#1f2937";
  ctx.font = "20px Arial";
  ctx.fillText(
    `Date: ${dateLabel}   (Page ${pageNum}/${totalPages})`,
    PDF_PAGE_WIDTH / 2,
    90
  );

  const col = {
    name: 40,
    mobile: 220,
    room: 350,
    checkIn: 420,
    checkOut: 540,
    status: 700,
    checkoutTime: 800,
  };

  let y = 140;

  ctx.textAlign = "left";
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#ea580c";

  ctx.fillText("Name", col.name, y);
  ctx.fillText("Mobile", col.mobile, y);
  ctx.fillText("Room", col.room, y);
  ctx.fillText("Check-in", col.checkIn, y);
  ctx.fillText("Check-out", col.checkOut, y);
  ctx.fillText("Status", col.status, y);
  ctx.fillText("Checkout Time", col.checkoutTime, y);

  ctx.strokeStyle = "#fdba74";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, y + 12);
  ctx.lineTo(PDF_PAGE_WIDTH - 30, y + 12);
  ctx.stroke();

  y += 50;
  ctx.font = "16px Arial";

  pageRows.forEach((b) => {

    ctx.fillStyle = "#111827";
    ctx.fillText(truncateText(b.name, 16), col.name, y);
    ctx.fillText(String(b.mobile || ""), col.mobile, y);
    ctx.fillText(String(b.roomNumber), col.room, y);
    ctx.fillText(String(b.checkIn).split("T")[0], col.checkIn, y);
    ctx.fillText(String(b.checkOut).split("T")[0], col.checkOut, y);

    ctx.fillStyle =
      b.status === "Active"
        ? "#16a34a"
        : b.status === "Cancelled"
        ? "#dc2626"
        : "#6b7280";

    ctx.fillText(b.status, col.status, y);

    ctx.fillStyle = "#111827";
    ctx.fillText(b.checkoutTime || "-", col.checkoutTime, y);

    y += 42;
  });

  return canvas;
};

const generateBookingsPDF = (bookingsList, dateLabel) => {

  const rows = bookingsList || [];
  const pages = [];

  for (let i = 0; i < rows.length; i += ROWS_PER_PDF_PAGE) {
    pages.push(rows.slice(i, i + ROWS_PER_PDF_PAGE));
  }

  if (pages.length === 0) pages.push([]);

  const pdf = new jsPDF({
    unit: "px",
    format: [PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT],
  });

  pages.forEach((pageRows, idx) => {

    const canvas = drawBookingsPageCanvas(
      pageRows,
      idx + 1,
      pages.length,
      dateLabel
    );

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (idx > 0) {
      pdf.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT], "p");
    }

    pdf.addImage(imgData, "JPEG", 0, 0, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
  });

  return pdf;
};

const RoomBookingForm = () => {

  // ---- stay details ----
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ---- room search ----
  const [searching, setSearching] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [searched, setSearched] = useState(false);

  // ---- guest details ----
  const [name, setName] = useState("");
  const [gender, setGender] = useState(""); // "Male" | "Female"
  const [mobile, setMobile] = useState("");
  const [adultMale, setAdultMale] = useState("");
  const [adultFemale, setAdultFemale] = useState("");
  const [child, setChild] = useState("");
  const [extraBedding, setExtraBedding] = useState("");
  const [aadhar4, setAadhar4] = useState("");
  const [bookedBy, setBookedBy] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // ---- occupancy section ----
  const [occDate, setOccDate] = useState("");
  const [occLoading, setOccLoading] = useState(false);
  const [occResult, setOccResult] = useState(null);

  // ---- manage bookings (admin list + cancel) ----
  const [manageDate, setManageDate] = useState("");
  const [manageLoading, setManageLoading] = useState(false);
  const [bookingsList, setBookingsList] = useState([]);
  const [manageSearched, setManageSearched] = useState(false);

  // ---- cancel modal ----
  const [cancelTarget, setCancelTarget] = useState(null); // bookingId
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // ---- checkout modal ----
  const [checkoutTarget, setCheckoutTarget] = useState(null); // bookingId
  const [checkingOut, setCheckingOut] = useState(false);

  // ---- canvas used to build the booking-confirmation share image ----
  const bookingCanvasRef = useRef(null);
  const [confirmationSharing, setConfirmationSharing] = useState(false);



  // =======================================
  // PLAY SUCCESS SOUND (Web Audio API - no asset file needed)
  // =======================================

  const playSuccessSound = () => {

    try {

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();

      const playTone = (freq, startTime, duration) => {

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      playTone(880, now, 0.15);
      playTone(1320, now + 0.15, 0.25);

    } catch (err) {
      console.log(err);
    }
  };



  // =======================================
  // RESET FORM (after a successful booking)
  // =======================================

  const resetForm = () => {
    setCheckIn("");
    setCheckOut("");
    setAvailableRooms([]);
    setSelectedRoom("");
    setSearched(false);
    setName("");
    setGender("");
    setMobile("");
    setAdultMale("");
    setAdultFemale("");
    setChild("");
    setExtraBedding("");
    setAadhar4("");
    setBookedBy("");
  };



  const onStayDetailChange = () => {
    setAvailableRooms([]);
    setSelectedRoom("");
    setSearched(false);
  };



  // =======================================
  // SEARCH AVAILABLE ROOMS (date based only)
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

    setSearching(true);
    setSearched(false);
    setSelectedRoom("");

    try {

      const response = await fetch(
        `${API_URL}?action=availableRooms&checkIn=${checkIn}&checkOut=${checkOut}`
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
        action: "createBooking",
        name,
        gender,
        mobile,
        adultMale: adultMale || 0,
        adultFemale: adultFemale || 0,
        child: child || 0,
        extraBedding: extraBedding || 0,
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

        setBookingResult({
          ...data,
          name,
          mobile,
          checkIn,
          checkOut,
        });

        playSuccessSound();

        resetForm();

      } else {

        alert(data.message || "Booking failed");
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



  // =======================================
  // MANAGE BOOKINGS - LIST BY DATE
  // =======================================

  const searchBookingsByDate = async () => {

    if (!manageDate) {
      alert("Date चुनें");
      return;
    }

    setManageLoading(true);
    setManageSearched(false);

    try {

      const response = await fetch(
        `${API_URL}?action=listBookings&date=${manageDate}`
      );

      const data = await response.json();

      if (data.success) {

        setBookingsList(data.bookings);
        setManageSearched(true);

      } else {

        alert(data.message || "Failed to fetch");
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setManageLoading(false);
    }
  };



  // =======================================
  // CREATE BOOKING CONFIRMATION IMAGE (canvas)
  // =======================================

  const createBookingConfirmationImage = (callback) => {

    const canvas =
      bookingCanvasRef.current || document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    const width = 640;

    // ---- everything below is drawn once we know the QR image's
    // real aspect ratio, so it can be sized/placed without
    // distortion or overlapping the footer ----

    const drawCard = (qrImg) => {

      // fixed layout up to the QR block
      const headerBottom = 230 + 5 * 42; // 5 detail lines starting at y=230
      const afterDetailsY = headerBottom + 10;
      const qrLabelY = afterDetailsY + 30;
      const qrTop = qrLabelY + 20;

      // QR sizing - fit a generous width, keep the image's own
      // aspect ratio so its internal text/logo isn't squashed
      const qrDisplayWidth = 360;
      let qrDisplayHeight = 0;

      if (qrImg) {
        const ratio = qrImg.naturalHeight / qrImg.naturalWidth;
        qrDisplayHeight = Math.round(qrDisplayWidth * ratio);
      }

      const footerGap = 30;
      const footerY = qrImg
        ? qrTop + qrDisplayHeight + footerGap
        : qrTop + footerGap;

      const height = footerY + 30; // bottom padding under footer

      canvas.width = width;
      canvas.height = height;

      // background
      ctx.fillStyle = "#f0fdf4";
      ctx.fillRect(0, 0, width, height);

      // border
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // header
      ctx.fillStyle = "#16a34a";
      ctx.textAlign = "center";
      ctx.font = "bold 28px Arial";
      ctx.fillText("Room Booking Confirmed ✅", width / 2, 60);

      ctx.fillStyle = "#ea580c";
      ctx.font = "bold 22px Arial";
      ctx.fillText(
        "Shree Maruti Nandan Dham, Mehandipur Balaji",
        width / 2,
        95
      );

      ctx.strokeStyle = "#bbf7d0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 115);
      ctx.lineTo(width - 40, 115);
      ctx.stroke();

      // room number - big
      ctx.fillStyle = "#111827";
      ctx.font = "bold 34px Arial";
      ctx.fillText(`Room No. ${bookingResult.room}`, width / 2, 170);

      // details
      ctx.textAlign = "left";
      ctx.font = "22px Arial";
      ctx.fillStyle = "#1f2937";

      const lines = [
        `Name: ${bookingResult.name}`,
        `Mobile: ${bookingResult.mobile}`,
        `Check-in: ${bookingResult.checkIn}`,
        `Check-out: ${bookingResult.checkOut} ${CHECKOUT_TIME_LABEL}`,
        `Booking ID: ${bookingResult.bookingId}`,
      ];

      let y = 230;

      lines.forEach((line) => {
        ctx.fillText(line, 60, y);
        y += 42;
      });

      ctx.strokeStyle = "#bbf7d0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, afterDetailsY);
      ctx.lineTo(width - 40, afterDetailsY);
      ctx.stroke();

      // QR label
      ctx.textAlign = "center";
      ctx.fillStyle = "#16a34a";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Thank you For Booking!!!", width / 2, qrLabelY);

      // QR image (Trust's donation QR - same static image every time),
      // drawn at its own aspect ratio so it isn't stretched/squashed
      if (qrImg) {
        const qrX = (width - qrDisplayWidth) / 2;
        ctx.drawImage(qrImg, qrX, qrTop, qrDisplayWidth, qrDisplayHeight);
      }

      // footer - placed dynamically below the QR, never overlapping it
      ctx.textAlign = "center";
      ctx.fillStyle = "#2563eb";
      ctx.font = "16px Arial";
      ctx.fillText("Shri Sankat Mochan Balaji Mandal", width / 2, footerY);

      callback(canvas);
    };

    const qrImg = new Image();

    // NOTE: QR_CODE_IMAGE_PATH is a root-relative path ("/qr-code.png"),
    // so this image is always same-origin with the app - no crossOrigin
    // attribute is needed (and setting it can actually make mobile
    // browsers refuse to load an already-cached copy of the image that
    // wasn't fetched in CORS mode, which silently drops the QR).

    qrImg.onload = () => drawCard(qrImg);

    qrImg.onerror = (err) => {
      // QR asset missing/blocked - log so it's visible in console,
      // but still share the rest of the confirmation without the QR
      console.log("QR image failed to load:", QR_CODE_IMAGE_PATH, err);
      drawCard(null);
    };

    qrImg.src = QR_CODE_IMAGE_PATH;
  };



  // =======================================
  // SHARE BOOKING CONFIRMATION ON WHATSAPP
  // =======================================

  const shareBookingOnWhatsapp = async () => {

    if (!bookingResult) return;

    setConfirmationSharing(true);

    const shareText =
      `🙏 Room Booking Confirmed\n` +
      `Name: ${bookingResult.name}\n` +
      `Room No: ${bookingResult.room}\n` +
      `Check-in: ${bookingResult.checkIn}\n` +
      `Check-out: ${bookingResult.checkOut} ${CHECKOUT_TIME_LABEL}\n` +
      `Booking ID: ${bookingResult.bookingId}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {

      createBookingConfirmationImage((canvas) => {

        canvas.toBlob(async (blob) => {

          try {

            const file = new File(
              [blob],
              "booking-confirmation.png",
              { type: "image/png" }
            );

            // Desktop/laptop browsers usually have no share targets
            // (no WhatsApp etc registered), so navigator.share() just
            // opens an empty sheet that the user closes -> AbortError.
            // Some mobile browsers also can't share files via
            // navigator.share (canShare returns false for the PNG) -
            // in that case we must NOT fall back to a text-only share,
            // otherwise the QR image never reaches WhatsApp at all.
            // So: only the true file-share path uses navigator.share;
            // every other case (desktop, or mobile without file-share
            // support) downloads the image + opens WhatsApp with the
            // text, so the user always has the image to attach.
            if (
              isMobile &&
              navigator.canShare &&
              navigator.canShare({ files: [file] })
            ) {

              await navigator.share({
                title: "Room Booking Confirmed",
                text: shareText,
                files: [file],
              });

            } else {

              // download the image (works on both mobile and desktop)
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "booking-confirmation.png";
              link.click();
              URL.revokeObjectURL(url);

              // open WhatsApp (Web on desktop, app on mobile) with the
              // text - image needs to be attached manually from the
              // just-downloaded file / gallery
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                "_blank"
              );
            }

          } catch (err) {

            if (err && err.name === "AbortError") {
              // user closed the native share sheet - not an error
              console.log("Share cancelled by user");
            } else {
              console.log(err);
            }

          } finally {

            setConfirmationSharing(false);
          }

        }, "image/png");
      });

    } catch (err) {

      console.log(err);
      setConfirmationSharing(false);
    }
  };



  // =======================================
  // MANAGE BOOKINGS - DOWNLOAD AS CSV
  // =======================================

  const downloadBookingsCSV = () => {

    if (!bookingsList.length) {
      alert("Download करने के लिए कोई booking नहीं है");
      return;
    }

    const headers = [
      "BookingId",
      "Name",
      "Mobile",
      "Room",
      "CheckIn",
      "CheckOut",
      "Status",
      "AdultMale",
      "AdultFemale",
      "Child",
      "ExtraBedding",
      "CheckoutTime",
    ];

    let csv = headers.join(",") + "\n";

    bookingsList.forEach((b) => {

      const row = [
        b.bookingId,
        b.name,
        b.mobile,
        b.roomNumber,
        String(b.checkIn).split("T")[0],
        String(b.checkOut).split("T")[0],
        b.status,
        b.adultMale,
        b.adultFemale,
        b.child,
        b.extraBedding,
        b.checkoutTime || "",
      ];

      csv +=
        row
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings-${manageDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };



  // =======================================
  // MANAGE BOOKINGS - PLAIN TEXT (fallback only,
  // used when the device can't share files)
  // =======================================

  const buildBookingsListText = () => {

    let text = `🏨 Room Bookings - ${manageDate}\n\n`;

    bookingsList.forEach((b, idx) => {

      text +=
        `${idx + 1}. Room ${b.roomNumber} - ${b.name} (${b.status})\n` +
        `   Mobile: ${b.mobile} | ${String(b.checkIn).split("T")[0]} to ${
          String(b.checkOut).split("T")[0]
        }\n`;
    });

    return text;
  };

  const [bookingsPdfBusy, setBookingsPdfBusy] = useState(false);



  // =======================================
  // MANAGE BOOKINGS - DOWNLOAD AS PDF
  // =======================================

  const downloadBookingsPDF = () => {

    if (!bookingsList.length) {
      alert("Download करने के लिए कोई booking नहीं है");
      return;
    }

    const pdf = generateBookingsPDF(bookingsList, manageDate);
    pdf.save(`bookings-${manageDate}.pdf`);
  };



  // =======================================
  // MANAGE BOOKINGS - SHARE LIST ON WHATSAPP (as PDF)
  // Falls back to a plain text share if the device/browser
  // can't share files (e.g. desktop without Web Share API).
  // =======================================

  const shareBookingsListOnWhatsapp = async () => {

    if (!bookingsList.length) {
      alert("Share करने के लिए कोई booking नहीं है");
      return;
    }

    setBookingsPdfBusy(true);

    try {

      const pdf = generateBookingsPDF(bookingsList, manageDate);
      const blob = pdf.output("blob");

      const file = new File(
        [blob],
        `bookings-${manageDate}.pdf`,
        { type: "application/pdf" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {

        await navigator.share({
          title: `Room Bookings - ${manageDate}`,
          text: `Room Bookings - ${manageDate}`,
          files: [file],
        });

      } else if (navigator.share) {

        // can share text but not files -> share plain text instead
        await navigator.share({
          title: `Room Bookings - ${manageDate}`,
          text: buildBookingsListText(),
        });

      } else {

        // no Web Share API at all -> open whatsapp with text
        window.open(
          `https://wa.me/?text=${encodeURIComponent(buildBookingsListText())}`,
          "_blank"
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setBookingsPdfBusy(false);
    }
  };



  // =======================================
  // CANCEL BOOKING
  // =======================================

  const openCancelModal = (bookingId) => {
    setCancelTarget(bookingId);
    setCancelReason("");
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
    setCancelReason("");
  };

  const confirmCancelBooking = async () => {

    setCancelling(true);

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "cancelBooking",
          bookingId: cancelTarget,
          reason: cancelReason,
        }),
      });

      const data = await response.json();

      if (data.success) {

        closeCancelModal();
        searchBookingsByDate(); // refresh list

      } else {

        alert(data.message || "Cancel failed");
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setCancelling(false);
    }
  };



  // =======================================
  // CHECK-OUT BOOKING (manual)
  // =======================================

  const openCheckoutModal = (bookingId) => {
    setCheckoutTarget(bookingId);
  };

  const closeCheckoutModal = () => {
    setCheckoutTarget(null);
  };

  const confirmCheckoutBooking = async () => {

    setCheckingOut(true);

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "checkoutBooking",
          bookingId: checkoutTarget,
        }),
      });

      const data = await response.json();

      if (data.success) {

        closeCheckoutModal();
        searchBookingsByDate(); // refresh list

      } else {

        alert(data.message || "Check-out failed");
      }

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    } finally {

      setCheckingOut(false);
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
            Step 1 - Stay Dates
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            Check-in / Check-out date डाल कर उपलब्ध rooms search करें
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
                इन dates के लिए कोई room उपलब्ध नहीं है।
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
                        ? `, max ${r.extraBedding} extra bed`
                        : ""}
                      )
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
              Step 3 - Guest & Booking Details
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
                  Adult - Male
                </label>
                <input
                  type="number"
                  min="0"
                  value={adultMale}
                  onChange={(e) => setAdultMale(e.target.value)}
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
                  onChange={(e) => setAdultFemale(e.target.value)}
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
                  onChange={(e) => setChild(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Extra Bedding दिया (कितना)
                </label>
                <input
                  type="number"
                  min="0"
                  value={extraBedding}
                  onChange={(e) => setExtraBedding(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full mt-1"
                  placeholder="0"
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

            <button
              onClick={shareBookingOnWhatsapp}
              disabled={confirmationSharing}
              className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded-md font-semibold"
            >
              {confirmationSharing
                ? "तैयार हो रहा है..."
                : "📤 Share on WhatsApp"}
            </button>

            <canvas
              ref={bookingCanvasRef}
              style={{ display: "none" }}
            />

          </div>

        )}



        {/* ======================================= */}
        {/* OCCUPANCY BY DATE */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6 mb-10">

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



        {/* ======================================= */}
        {/* MANAGE BOOKINGS (admin list + cancel) */}
        {/* ======================================= */}

        <div className="bg-orange-50 border rounded-2xl p-4 sm:p-6">

          <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-5">
            Manage Bookings
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input
              type="date"
              value={manageDate}
              onChange={(e) => setManageDate(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
            />

            <button
              onClick={searchBookingsByDate}
              disabled={manageLoading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-2 rounded-md whitespace-nowrap"
            >
              {manageLoading ? "Searching..." : "Search"}
            </button>

          </div>

          {manageSearched && bookingsList.length > 0 && (

            <div className="flex flex-col sm:flex-row gap-3 mb-4">

              <button
                onClick={downloadBookingsCSV}
                className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium"
              >
                ⬇ Download CSV
              </button>

              <button
                onClick={downloadBookingsPDF}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-md text-sm font-medium"
              >
                ⬇ Download PDF
              </button>

              <button
                onClick={shareBookingsListOnWhatsapp}
                disabled={bookingsPdfBusy}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2 rounded-md text-sm font-medium"
              >
                {bookingsPdfBusy ? "PDF बन रही है..." : "📤 Share PDF on WhatsApp"}
              </button>

            </div>

          )}

          {manageSearched && (

            <div className="overflow-auto rounded-xl border bg-white">

              <table className="w-full border-collapse text-xs sm:text-sm">

                <thead>
                  <tr className="bg-orange-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Mobile</th>
                    <th className="border p-2">Room</th>
                    <th className="border p-2">Check-in</th>
                    <th className="border p-2">Check-out</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Checkout Time</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {bookingsList.length > 0 ? (

                    bookingsList.map((b, idx) => (

                      <tr key={idx} className="hover:bg-orange-50">

                        <td className="border p-2">{b.name}</td>
                        <td className="border p-2">{b.mobile}</td>
                        <td className="border p-2 font-semibold">
                          {b.roomNumber}
                        </td>
                        <td className="border p-2">
                          {String(b.checkIn).split("T")[0]}
                        </td>
                        <td className="border p-2">
                          {String(b.checkOut).split("T")[0]}
                        </td>
                        <td className="border p-2">

                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              b.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : b.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {b.status}
                          </span>

                        </td>
                        <td className="border p-2">
                          {b.checkoutTime || "-"}
                        </td>
                        <td className="border p-2 text-center whitespace-nowrap">

                          {b.status === "Active" ? (

                            <>
                              <button
                                onClick={() => openCheckoutModal(b.bookingId)}
                                className="text-green-600 underline text-xs font-medium mr-3"
                              >
                                Check-out
                              </button>

                              <button
                                onClick={() => openCancelModal(b.bookingId)}
                                className="text-red-600 underline text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </>

                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="8" className="text-center p-5">
                        No Bookings Found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>



      {/* ======================================= */}
      {/* CANCEL CONFIRMATION MODAL */}
      {/* ======================================= */}

      {cancelTarget && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Cancel Booking?
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this room booking?
            </p>

            <label className="text-sm font-medium text-gray-700">
              Reason (optional)
            </label>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="border rounded-md px-3 py-2 w-full mt-1"
              placeholder="Cancel करने की वजह (optional)"
            />

            <div className="flex gap-3 mt-5">

              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                No, Keep It
              </button>

              <button
                onClick={confirmCancelBooking}
                disabled={cancelling}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-md"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>

            </div>

          </div>

        </div>

      )}



      {/* ======================================= */}
      {/* CHECK-OUT CONFIRMATION MODAL */}
      {/* ======================================= */}

      {checkoutTarget && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Check-out Booking?
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to check-out this booking now?
            </p>

            <div className="flex gap-3 mt-5">

              <button
                onClick={closeCheckoutModal}
                disabled={checkingOut}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                No
              </button>

              <button
                onClick={confirmCheckoutBooking}
                disabled={checkingOut}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-md"
              >
                {checkingOut ? "Checking out..." : "Yes, Check-out"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default RoomBookingForm;
