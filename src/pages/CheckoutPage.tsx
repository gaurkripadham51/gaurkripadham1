// components/CheckoutPage.tsx
import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwtHBiRYZoD3Oj1yFvMYM1Apqd1Rlngrjjj4idHbXuolo856_UQwbscRwmsdNIMlE3X/exec';

const CheckoutPage = () => {
  const [details, setDetails] = useState({
    name: '',
    mobile: '',
    city: '',
    address: '',
    landmark: '',
  });
  const [cart, setCart] = useState<any[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const handleQuantityChange = (index: number, newQty: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.book.price,
    0
  );

  const deliveryCharge = cart.length > 0 ? cart[0].book.deliveryCharges : 0;
  const totalPrice = subtotal + deliveryCharge;

  const handlePlaceOrder = () => {
    const id = 'ORD-' + Math.floor(Math.random() * 1000000);
    setOrderId(id);
    setOrderPlaced(true);

    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      body: JSON.stringify({ ...details, totalQuantity, totalPrice, orderId: id, cart }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  if (orderPlaced)
    return (
      <div className="p-16 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Order Placed Successfully!</h2>
        <p className="text-lg">Your order number is <strong>{orderId}</strong></p>
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 gap-10 p-16 bg-orange-50 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
        {['name', 'mobile', 'city', 'address', 'landmark'].map(field => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 mb-4 border rounded"
            onChange={e => setDetails({ ...details, [field]: e.target.value })}
          />
        ))}
        <h3 className="mt-6 mb-2 font-semibold">UPI Payment</h3>
        <img src="/qr.png" alt="QR Code" className="w-48 h-48" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold">{item.book.title}</h3>
            <p>Price: ₹{item.book.price}</p>
            <div className="flex items-center gap-2 mt-1">
              <label htmlFor={`qty-${index}`} className="text-sm">Quantity:</label>
              <select
                id={`qty-${index}`}
                value={item.quantity}
                onChange={e => handleQuantityChange(index, parseInt(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                  <option key={qty} value={qty}>{qty}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Total for this book: ₹{item.quantity * item.book.price}
            </p>
          </div>
        ))}

        <p className="mt-2 font-medium">Total Quantity: {totalQuantity}</p>
        <p className="">Subtotal: ₹{subtotal}</p>
        <p className="">Delivery Charges: ₹{deliveryCharge}</p>
        <p className="font-bold text-lg">Total Amount: ₹{totalPrice}</p>

        <button
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
