// components/BookStorePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwtHBiRYZoD3Oj1yFvMYM1Apqd1Rlngrjjj4idHbXuolo856_UQwbscRwmsdNIMlE3X/exec';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  deliveryCharges: number;
  quantity: number;
  images: string[];
}

const BookStorePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<{ book: Book; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [modalImages, setModalImages] = useState<string[] | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);

  useEffect(() => {
    axios.get(GOOGLE_SHEET_URL).then(res => {
      setBooks(res.data);
      setLoading(false);
    });
  }, []);

  const addToCart = (book: Book) => {
    const qty = quantities[book.id] || 1;
    const updatedCart = [{ book, quantity: qty }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.href = '/checkout';
  };

  const openImageModal = (images: string[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalImages(null);
    setModalIndex(0);
  };

  const nextImage = () => {
    if (modalImages) {
      setModalIndex((modalIndex + 1) % modalImages.length);
    }
  };

  const prevImage = () => {
    if (modalImages) {
      setModalIndex((modalIndex - 1 + modalImages.length) % modalImages.length);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="pt-16 text-5xl font-bold text-center text-orange-700 mb-12">📚 Online Bookstore</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {books.map(book => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.03] transition duration-300"
          >
            <div className="relative mb-4">
              <img
                src={book.images[0]}
                alt={book.title}
                className="w-full h-60 object-cover rounded cursor-pointer"
                onClick={() => openImageModal(book.images, 0)}
              />
              {book.images.length > 1 && (
                <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  +{book.images.length - 1} more
                </span>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{book.title}</h2>
            <p className="text-gray-700 mb-1">By: {book.author}</p>
            <p>Price: ₹{book.price}</p>
            <p>Delivery: ₹{book.deliveryCharges}</p>
            <p className="mb-2 font-medium">Total: ₹{book.price + book.deliveryCharges}</p>

            <label htmlFor={`qty-${book.id}`} className="text-sm font-medium">Quantity:</label>
            <select
              id={`qty-${book.id}`}
              className="ml-2 px-3 py-1 border rounded text-sm"
              value={quantities[book.id] || 1}
              onChange={(e) => setQuantities({ ...quantities, [book.id]: parseInt(e.target.value) })}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <button
              className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={() => addToCart(book)}
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {modalImages && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="relative max-w-md w-full">
            <img
              src={modalImages[modalIndex]}
              alt="Preview"
              className="w-full h-[500px] object-contain rounded"
            />
            <button onClick={prevImage} className="absolute top-1/2 left-2 text-white text-3xl">‹</button>
            <button onClick={nextImage} className="absolute top-1/2 right-2 text-white text-3xl">›</button>
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookStorePage;
