// ==========================================
// FeedbackForm.tsx
// ==========================================

import React, { useState } from "react";

const FeedbackForm = () => {

  const [form, setForm] = useState({

    name: "",
    dob: "",
    address: "",
    phone: "",

    roomCleanliness: "",
    stayComfort: "",
    foodService: "",
    recommend: "",

    overallExperience: "",
    staffBehaviour: "",

    nextVisit: "",
    comments: "",

  });

  const [errors, setErrors] =
    useState<any>({});

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);



  // ======================================
  // API URL
  // ======================================

  const API_URL =
    "https://script.google.com/macros/s/AKfycbzPYVT2giWakid0Gyrzrq-tZ0Jf314LVcXmeMzqtGADHxk-nQSMjCN3wwQAJ9-igdB-Qg/exec";



  // ======================================
  // HANDLE CHANGE
  // ======================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const { name, value } =
      e.target;

    // PHONE ONLY NUMBER
    if (
      name === "phone" &&
      !/^\d*$/.test(value)
    ) return;

    setForm({

      ...form,
      [name]: value,

    });

    // REMOVE ERROR ON CHANGE
    if (errors[name]) {

      setErrors((prev: any) => ({

        ...prev,
        [name]: "",

      }));
    }
  };



  // ======================================
  // VALIDATION
  // ======================================

  const validateForm = () => {

    const newErrors: any = {};



    const requiredFields = [

      "name",
      "dob",
      "address",
      "phone",

      "roomCleanliness",
      "stayComfort",
      "foodService",
      "recommend",

      "overallExperience",
      "staffBehaviour",

    ];



    requiredFields.forEach((field) => {

      const value =
        form[
          field as keyof typeof form
        ];

      if (
        !value ||
        !value.toString().trim()
      ) {

        newErrors[field] =
          "Required";
      }
    });



    return newErrors;
  };



  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const newErrors =
      validateForm();

    if (
      Object.keys(newErrors)
        .length > 0
    ) {

      setErrors(newErrors);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

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

        setSubmitted(true);

        window.scrollTo({

          top: 0,
          behavior: "smooth",

        });

      } else {

        alert(
          "Failed to submit feedback"
        );
      }

    } catch (err) {

      console.log(err);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };



  // ======================================
  // RADIO OPTIONS
  // ======================================

  const renderRadioOptions = (
    name: string,
    options: string[]
  ) => (

    <div>

      <div className="flex flex-wrap gap-4 mt-2">

        {options.map((item) => (

          <label
            key={item}
            className="flex items-center gap-2"
          >

            <input
              type="radio"
              name={name}
              value={item}
              checked={
                form[
                  name as keyof typeof form
                ] === item
              }
              onChange={handleChange}
            />

            {item}

          </label>

        ))}

      </div>



      {errors[name] && (

        <p className="text-red-500 text-sm mt-2">
          Please select one option
        </p>

      )}

    </div>
  );



  return (

    <div className="min-h-screen bg-orange-50 py-10 px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-3">

          Dharamshala Feedback Form

        </h1>

        <h2 className="text-xl text-center text-gray-700 mb-8">

          धर्मशाला फीडबैक फॉर्म

        </h2>



        {submitted ? (

          <div className="bg-green-100 text-green-700 text-center p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-2">
              Thank You 🙏
            </h2>

            <p>
              Thank you for your feedback!
            </p>

            <p className="mt-2">
              आपके सुझाव के लिए धन्यवाद!
            </p>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}

            <div>

              <label className="font-semibold">
                Name / नाम *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

              {errors.name && (

                <p className="text-red-500 text-sm mt-1">
                  Required
                </p>

              )}

            </div>



            {/* DOB */}

            <div>

              <label className="font-semibold">
                Date of Birth / जन्म तिथि *
              </label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

              {errors.dob && (

                <p className="text-red-500 text-sm mt-1">
                  Required
                </p>

              )}

            </div>



            {/* ADDRESS */}

            <div>

              <label className="font-semibold">
                Address / पता *
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

              {errors.address && (

                <p className="text-red-500 text-sm mt-1">
                  Required
                </p>

              )}

            </div>



            {/* PHONE */}

            <div>

              <label className="font-semibold">
                Phone Number / फ़ोन नंबर *
              </label>

              <input
                type="text"
                name="phone"
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

              {errors.phone && (

                <p className="text-red-500 text-sm mt-1">
                  Required
                </p>

              )}

            </div>



            {/* Q1 */}

            <div>

              <h3 className="font-semibold">
                1. Room Cleanliness /
                कमरे की सफ़ाई *
              </h3>

              {renderRadioOptions(
                "roomCleanliness",
                [
                  "Poor / खराब",
                  "Average / औसत",
                  "Good / अच्छा",
                ]
              )}

            </div>



            {/* Q2 */}

            <div>

              <h3 className="font-semibold">
                2. Stay Comfort /
                ठहरने का अनुभव *
              </h3>

              {renderRadioOptions(
                "stayComfort",
                [
                  "Uncomfortable / असुविधाजनक",
                  "Neutral / औसत",
                  "Comfortable / आरामदायक",
                ]
              )}

            </div>



            {/* Q3 */}

            <div>

              <h3 className="font-semibold">
                3. Food Service /
                भोजन सेवा *
              </h3>

              {renderRadioOptions(
                "foodService",
                [
                  "Poor / खराब",
                  "Average / औसत",
                  "Good / अच्छा",
                ]
              )}

            </div>



            {/* Q4 */}

            <div>

              <h3 className="font-semibold">
                4. Recommend Dharamshala /
                क्या आप सुझाव देंगे? *
              </h3>

              {renderRadioOptions(
                "recommend",
                [
                  "No / नहीं",
                  "Maybe / शायद",
                  "Yes / हाँ",
                ]
              )}

            </div>



            {/* Q5 */}

            <div>

              <h3 className="font-semibold">
                5. Overall Experience /
                आपका अनुभव *
              </h3>

              {renderRadioOptions(
                "overallExperience",
                [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                ]
              )}

            </div>



            {/* Q6 */}

            <div>

              <h3 className="font-semibold">
                6. Staff Behaviour /
                कर्मचारियों का व्यवहार *
              </h3>

              {renderRadioOptions(
                "staffBehaviour",
                [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                ]
              )}

            </div>



            {/* NEXT VISIT */}

            <div>

              <label className="font-semibold">
                7. Next Tentative Visit (Optional)
                <br />
                अगली संभावित यात्रा (वैकल्पिक)
              </label>

              <input
                type="text"
                name="nextVisit"
                value={form.nextVisit}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

            </div>



            {/* COMMENTS */}

            <div>

              <label className="font-semibold">
                8. Suggestions (Optional)
                <br />
                सुझाव (वैकल्पिक)
              </label>

              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-4 py-2 mt-2"
              />

            </div>



            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
            >

              {loading ? (

                <div className="flex items-center gap-3">

                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  <span>
                    Submitting...
                  </span>

                </div>

              ) : (

                "Submit Feedback / फीडबैक जमा करें"

              )}

            </button>

          </form>

        )}

      </div>

    </div>
  );
};

export default FeedbackForm;