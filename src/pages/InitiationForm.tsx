import React, { useState } from 'react';


const InitiationForm = () => {
  const [form, setForm] = useState({
    legalName: '',
    initiatedName: '',
    initiationDate: '',
    PhoneNumber: '',
    address: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    nearbyCentre: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // 🔁 loader state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only numbers for phone number
    if (name === 'PhoneNumber' && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true); // 🌀 Start loader
        const formData = new URLSearchParams();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });
  
        const response = await fetch('https://script.google.com/macros/s/AKfycbw98AgJ3g0vImhIUbLom7O2O_e7emOp4P4S5gjygw41OvuudC5LMF2j41cZB74FjWzHsw/exec', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll to top
          console.log('Data saved');
        } else {
          alert('Failed to submit. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Something went wrong.');
      }finally {
        setLoading(false); // ✅ Stop loader
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Initiated Devotee Details
        </h2>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold text-lg">
            Thank you! The details have been submitted.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Legal Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name (Legal)</label>
              <input
                name="legalName"
                value={form.legalName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Name"
              />
              {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>}
            </div>

            {/* Initiated Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Initiated Name</label>
              <input
                name="initiatedName"
                value={form.initiatedName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Initiated Name"
              />
              {errors.initiatedName && <p className="text-red-500 text-sm mt-1">{errors.initiatedName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                name="PhoneNumber"
                value={form.PhoneNumber}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Phone Number"
              />
              {errors.PhoneNumber && <p className="text-red-500 text-sm mt-1">{errors.PhoneNumber}</p>}
            </div>

            {/* Date When Initiated */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date When Initiated</label>
              <input
                type="date"
                name="initiationDate"
                value={form.initiationDate}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
              {errors.initiationDate && <p className="text-red-500 text-sm mt-1">{errors.initiationDate}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* Pincode & Centre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Near By Centre (if applicable)
                </label>
                <input
                  name="nearbyCentre"
                  value={form.nearbyCentre}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="e.g., Gaur Kripa Dham, Vrindavan"
                />
                {errors.nearbyCentre && <p className="text-red-500 text-sm mt-1">{errors.nearbyCentre}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
              disabled={loading}
              >
              {loading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InitiationForm;
