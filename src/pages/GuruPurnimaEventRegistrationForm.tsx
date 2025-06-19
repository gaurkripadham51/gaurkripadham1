import React, { useState } from 'react';

const GuruPurnimaEventRegistrationForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    fatherOrMotherName: '',
    whatsappMobile: '',
    city: '',
    seva: '', // Changed "art" to "seva"
    otherSeva: '', // For "Others" field
    visitPlace: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const KidsEventRegistration_API_URL = 'https://script.google.com/macros/s/AKfycbxLf6tNFsfp9a7r-M2ZHfYdvlzu8mZ2rM1RiPMKO5dyWkJFHJJUCFYFMOdel-DtriSq/exec';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'otherSeva' && !value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    // Ensure the "Other Seva" field is validated if "Others" is selected.
    if (form.seva === 'Others' && !form.otherSeva.trim()) {
      newErrors.otherSeva = 'Please enter your seva details';
    }

    // Father/Mother name is required if age is under 15 years.
    if (form.age && parseInt(form.age) < 15 && !form.fatherOrMotherName.trim()) {
      newErrors.fatherOrMotherName = 'Please enter Father or Mother name';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Set the formData to be sent in the POST request
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        setLoading(true);

        // Use fetch instead of axios to send the data
        const response = await fetch(KidsEventRegistration_API_URL, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setSubmitted(true);
        } else {
          alert('Failed to register. Please try again.');
        }
      } catch (error) {
        alert('Something went wrong. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      age: '',
      gender: '',
      fatherOrMotherName: '',
      whatsappMobile: '',
      city: '',
      seva: '',
      otherSeva: '',
      visitPlace: '',
    });
    setErrors({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSevaOptions = () => {
    return (
      <>
        <option value="Painting">Painting</option>
        <option value="Bhajan Singing">Bhajan Singing</option>
        <option value="Dance">Dance</option>
        <option value="Edited Video">Edited Video</option>
        <option value="Poster">Poster</option>
        <option value="YouTube Short Video">YouTube Short Video</option>
        <option value="Others">Others</option>
      </>
    );
  };

  const getVisitPlaceOptions = () => {
    return (
      <>
        <label className="flex items-center">
          <input
            type="radio"
            name="visitPlace"
            value="9 July, Vrindavan"
            checked={form.visitPlace === '9 July, Vrindavan'}
            onChange={handleChange}
            className="mr-2"
          />
          9 July – Vrindavan
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="visitPlace"
            value="10 July, Ghaziabad"
            checked={form.visitPlace === '10 July, Ghaziabad'}
            onChange={handleChange}
            className="mr-2"
          />
          10 July – Ghaziabad
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="visitPlace"
            value="Not Visiting"
            checked={form.visitPlace === 'Not Visiting'}
            onChange={handleChange}
            className="mr-2"
          />
          Not Visiting
        </label>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          <strong>Offer your devotion through art at the lotus feet of your Guru </strong>
        </h2>
        <h2 className="text-1xl text-center text-blue-700 mb-6">
          <strong>Registration will be open from 20 June 2025 to 28 June 2025.</strong>
        </h2>

        {submitted ? (
          <div className="text-center text-green-700 text-xl font-semibold space-y-4">
            <p>🌸 <strong>Shri Radhey Shyam !!</strong></p>
            <p>You have successfully registered for the Guru Purnima event.</p>
            
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Age:</strong> {form.age}</p>
            <p><strong>Gender:</strong> {form.gender}</p>
            <p><strong>Father/Mother Name:</strong> {form.fatherOrMotherName}</p>
            <p><strong>Whatsapp Mobile:</strong> {form.whatsappMobile}</p>
            <p><strong>City:</strong> {form.city}</p>
            <p><strong>Seva:</strong> {form.seva}</p>
            {form.seva === 'Others' && <p><strong>Other Seva Details:</strong> {form.otherSeva}</p>}
            <p><strong>Visit Place:</strong> {form.visitPlace}</p>

            <div className="mt-6">
              <button
                onClick={handleReset}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Submit Another Response
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields rendering (unchanged from your original code) */}
            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            {/* Show message if age is under 15 years */}
            {form.age && parseInt(form.age) < 15 && (
              <p className="text-yellow-500 text-sm">Please enter Father or Mother name as well.</p>
            )}

            {/* Father/Mother Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Father/Mother Name</label>
              <input
                type="text"
                name="fatherOrMotherName"
                value={form.fatherOrMotherName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter Father/Mother Name"
              />
              {errors.fatherOrMotherName && <p className="text-red-500 text-sm">{errors.fatherOrMotherName}</p>}
            </div>

            {/* Whatsapp Mobile Number */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Whatsapp Mobile Number</label>
              <input
                type="text"
                name="whatsappMobile"
                value={form.whatsappMobile}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter your WhatsApp mobile number"
              />
              {errors.whatsappMobile && <p className="text-red-500 text-sm">{errors.whatsappMobile}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter your city"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            {/* Seva Dropdown */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Seva (Edited Video, Poster, YouTube Short Video)</label>
              <select
                name="seva"
                value={form.seva}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select Seva</option>
                {getSevaOptions()}
              </select>
              {errors.seva && <p className="text-red-500 text-sm">{errors.seva}</p>}
            </div>

            {/* If "Others" is selected in Seva */}
            {form.seva === 'Others' && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">Please enter your seva</label>
                <input
                  type="text"
                  name="otherSeva"
                  value={form.otherSeva}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="Please enter your seva"
                />
                {errors.otherSeva && <p className="text-red-500 text-sm">{errors.otherSeva}</p>}
              </div>
            )}

            {/* Visit Place */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Visiting for Guru Purnima</label>
              {getVisitPlaceOptions()}
              {errors.visitPlace && <p className="text-red-500 text-sm">{errors.visitPlace}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuruPurnimaEventRegistrationForm;
