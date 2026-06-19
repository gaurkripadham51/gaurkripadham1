// =======================================
// PujaSamagriList.jsx
// Shri Sankat Mochan Balaji Charitable Trust
// Aavashyak Puja Samagri - Category wise List + WhatsApp Share
// =======================================

import React, { useState, useRef } from "react";

// =======================================
// CATEGORY DATA (from physical list)
// =======================================

const CATEGORIES = [
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
    id: "hanuman",
    title: "हनुमान जी के चोले का सामान",
    items: [
      { name: "सिन्दूर (चोले वाला)", qty: "100 ग्रा." },
      { name: "चमेली का तेल", qty: "100 ग्रा." },
      { name: "जनेऊ", qty: "1 नग" },
      { name: "चांदी का वर्क", qty: "1 पैकेट" },
      { name: "इलायची दाना (हिमालय कं. का वर्क न लें)", qty: "1 पैकेट" },
      { name: "गुड़-चने का प्रसाद", qty: "1 पैकेट" },
    ],
  },
];

const PujaSamagriList = () => {
  // checked[categoryId] = true/false
  const [checked, setChecked] = useState({});
  const [sharing, setSharing] = useState(false);

  const canvasRef = useRef(null);

  // =======================================
  // TOGGLE CATEGORY CHECKBOX
  // =======================================

  const toggleCategory = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =======================================
  // SELECTED CATEGORIES + ITEMS
  // =======================================

  const selectedCategories = CATEGORIES.filter(
    (cat) => checked[cat.id]
  );

  const hasSelection = selectedCategories.length > 0;

  // =======================================
  // BUILD PLAIN TEXT (for whatsapp text share / fallback)
  // =======================================

  const buildShareText = () => {
    let text = "🙏 श्री संकट मोचन बालाजी चैरिटेबल ट्रस्ट 🙏\n";
    text += "आवश्यक पूजा सामग्री\n\n";

    selectedCategories.forEach((cat) => {
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
  // CREATE LIST IMAGE ON CANVAS
  // =======================================

  const createListImage = (callback) => {
    const canvas =
      canvasRef.current ||
      document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    // ---- measure height first ----
    const padding = 40;
    const lineHeight = 34;
    const headingGap = 50;

    let totalLines = 0;

    selectedCategories.forEach((cat) => {
      totalLines += 1; // category title
      totalLines += cat.items.length;
      totalLines += 0.6; // gap
    });

    const width = 720;
    const height =
      220 + totalLines * lineHeight + 100;

    canvas.width = width;
    canvas.height = height;

    // ---- background ----
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, width, height);

    // ---- border ----
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // ---- header ----
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

    // ---- content ----
    let y = 160;

    ctx.textAlign = "right";

    selectedCategories.forEach((cat) => {
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
  // SHARE ON WHATSAPP (image first, text fallback)
  // =======================================

  const shareOnWhatsapp = async () => {
    if (!hasSelection) {
      alert("कृपया कम से कम एक category चुनें");
      return;
    }

    setSharing(true);

    try {
      createListImage(async (canvas) => {
        canvas.toBlob(async (blob) => {
          try {
            const file = new File(
              [blob],
              "puja-samagri-list.png",
              { type: "image/png" }
            );

            if (
              navigator.canShare &&
              navigator.canShare({ files: [file] })
            ) {
              await navigator.share({
                title: "आवश्यक पूजा सामग्री",
                text: buildShareText(),
                files: [file],
              });
            } else if (navigator.share) {
              // device can share but not files -> share text
              await navigator.share({
                title: "आवश्यक पूजा सामग्री",
                text: buildShareText(),
              });
            } else {
              // ultimate fallback -> open whatsapp with text
              const url = `https://wa.me/?text=${encodeURIComponent(
                buildShareText()
              )}`;
              window.open(url, "_blank");
            }
          } catch (err) {
            console.log(err);
          } finally {
            setSharing(false);
          }
        }, "image/png");
      });
    } catch (err) {
      console.log(err);
      setSharing(false);
      alert("Share नहीं हो पाया, फिर से कोशिश करें");
    }
  };

  // =======================================
  // SELECT ALL / CLEAR
  // =======================================

  const selectAll = () => {
    const all = {};
    CATEGORIES.forEach((c) => (all[c.id] = true));
    setChecked(all);
  };

  const clearAll = () => setChecked({});

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        {/* HEADING */}
        <h1 className="text-xl sm:text-3xl font-bold text-center text-orange-600 mb-1">
          श्री संकट मोचन बालाजी चैरिटेबल ट्रस्ट
        </h1>

        <p className="text-center text-gray-700 font-semibold mb-6 text-sm sm:text-lg">
          आवश्यक पूजा सामग्री
        </p>

        {/* SELECT ALL / CLEAR */}
        <div className="flex justify-end gap-3 mb-4 text-xs sm:text-sm">
          <button
            onClick={selectAll}
            className="text-orange-600 underline"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-gray-500 underline"
          >
            Clear
          </button>
        </div>

        {/* CATEGORY LIST */}

        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const isChecked = !!checked[cat.id];

            return (
              <div
                key={cat.id}
                className={`border rounded-xl overflow-hidden transition ${
                  isChecked
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* CATEGORY HEADER */}
                <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer">
                  <span className="font-bold text-orange-700 text-sm sm:text-lg">
                    {cat.title}
                  </span>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleCategory(cat.id)
                    }
                    className="w-5 h-5 accent-orange-600 shrink-0"
                  />
                </label>

                {/* ITEM LIST - only when checked */}
                {isChecked && (
                  <div className="px-4 pb-4">
                    <table className="w-full text-xs sm:text-sm border-t">
                      <tbody>
                        {cat.items.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-orange-100"
                          >
                            <td className="py-2 pr-2 text-gray-500 w-6">
                              {idx + 1}.
                            </td>
                            <td className="py-2 pr-2 text-gray-800">
                              {item.name}
                            </td>
                            <td className="py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                              {item.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SHARE BUTTON */}

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={shareOnWhatsapp}
            disabled={sharing}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2"
          >
            {sharing
              ? "तैयार हो रहा है..."
              : "📤 Share on WhatsApp"}
          </button>

          {!hasSelection && (
            <p className="text-xs text-gray-400 text-center">
              Share करने के लिए कम से कम एक category चुनें
            </p>
          )}
        </div>

        {/* hidden canvas used to build the share image */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default PujaSamagriList;
