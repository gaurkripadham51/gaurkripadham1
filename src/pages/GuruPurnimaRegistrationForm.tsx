import React, { useEffect, useState } from 'react';

const GuruPurnimaRegistrationForm = () => {
  const [form, setForm] = useState({
    name: '',
    city: '',
    mobile: '',
    visitPlace: '',
    adults: '',
    children: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gp-token-info');
    if (saved) {
      const { token, form } = JSON.parse(saved);
      setToken(token);
      setForm(form);
      setSubmitted(true);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'mobile' && !/^\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
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
        setLoading(true);
        const generatedToken = `GP-${Math.floor(100000 + Math.random() * 900000)}`;
        setToken(generatedToken);
        setSubmitted(true);

        localStorage.setItem(
          'gp-token-info',
          JSON.stringify({
            token: generatedToken,
            form,
          })
        );
      } catch (error) {
        alert('Something went wrong. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem('gp-token-info');
    setForm({
      name: '',
      city: '',
      mobile: '',
      visitPlace: '',
      adults: '',
      children: '',
    });
    setToken('');
    setSubmitted(false);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = `🌸 Shri Radhey Shyam !!
You are Cordially Invited for Guru Pujan.

🪔 Name: ${form.name}
🏙️ City: ${form.city}
📱 Mobile: ${form.mobile}
🗓️ Visit Place: ${form.visitPlace}
👨‍👩‍👧 Adults: ${form.adults} | Children: ${form.children}
🎟️ Token: ${token}`;

  const getDropdownOptions = () => {
    return Array.from({ length: 7 }, (_, i) => (
      <option key={i} value={i}>{i}</option>
    ));
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          Guru Purnima Registration
        </h2>

        {submitted ? (
          <div className="text-center text-green-700 text-xl font-semibold space-y-4">
            <p>🌸 <strong>Shri Radhey Shyam !!</strong></p>
            <p>You are Cordially Invited for Guru Pujan.</p>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>City:</strong> {form.city}</p>
            <p><strong>Mobile:</strong> {form.mobile}</p>
            <p><strong>Visit Place:</strong> {form.visitPlace}</p>
            <p><strong>Adults:</strong> {form.adults}</p>
            <p><strong>Children:</strong> {form.children}</p>
            <p><strong>Your Token:</strong> <span className="text-orange-600">{token}</span></p>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </a>

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

            {/* Mobile */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter your mobile number"
                maxLength={10}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {/* Visit Place */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">Guru Poornima Visit Place</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visitPlace"
                    value="9 July 2025, Vrindavan"
                    checked={form.visitPlace === '9 July 2025, Vrindavan'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  9 July 2025 – Vrindavan
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visitPlace"
                    value="10 July 2025, Ghaziabad"
                    checked={form.visitPlace === '10 July 2025, Ghaziabad'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  10 July 2025 – Ghaziabad
                </label>
              </div>
              {errors.visitPlace && <p className="text-red-500 text-sm">{errors.visitPlace}</p>}
            </div>

            {/* Adults Dropdown */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Adults</label>
              <select
                name="adults"
                value={form.adults}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select adults</option>
                {getDropdownOptions()}
              </select>
              {errors.adults && <p className="text-red-500 text-sm">{errors.adults}</p>}
            </div>

            {/* Children Dropdown */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Children</label>
              <select
                name="children"
                value={form.children}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select children</option>
                {getDropdownOptions()}
              </select>
              {errors.children && <p className="text-red-500 text-sm">{errors.children}</p>}
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

export default GuruPurnimaRegistrationForm;
