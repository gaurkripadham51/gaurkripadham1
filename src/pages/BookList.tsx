import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BOOKS_API =
  "https://script.google.com/macros/s/AKfycbwMawnNDDWztlYEZnkW9Y5azBV3KHNKNXICVa1lnp9RtKsgo7Ht90Qtcq0PDmbma1ZnWw/exec?action=getBooks";
const BOOK_DATA_API =
  "https://script.google.com/macros/s/AKfycbwMawnNDDWztlYEZnkW9Y5azBV3KHNKNXICVa1lnp9RtKsgo7Ht90Qtcq0PDmbma1ZnWw/exec?action=getBookData&bookId=";

interface Book {
  BookID: string;
  Title: string;
  CoverImageUrl: string;
  Category: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BOOKS_API)
      .then((res) => res.json())
      .then((data) => {
        const fetchedBooks = data.books || [];
        setBooks(fetchedBooks);
        localStorage.setItem("allBooks", JSON.stringify(fetchedBooks)); // 🔸 Save full list to localStorage
        setLoading(false);
      });
  }, []);

  const fetchAndStoreBookData = async (bookId: string) => {
    try {
      const res = await fetch(`${BOOK_DATA_API}${bookId}`);
      const json = await res.json();
      localStorage.setItem(`bookData-${bookId}`, JSON.stringify(json)); // 🔸 Save individual book details
    } catch (err) {
      console.error("Failed to fetch book data:", err);
    }
  };

  const categories = Array.from(new Set(books.map((book) => book.Category))).sort();

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 lg:px-12 pt-24">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-orange-800 mb-12">
        Gaur Kripa Dham Prakshit Granth
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        <input
          type="text"
          placeholder="🔍 Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-96 shadow-sm focus:ring focus:ring-orange-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-64 shadow-sm focus:ring focus:ring-orange-300"
        >
          <option value="">📂 All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Book Cards */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg animate-pulse">📖 Loading books...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-12">
          {books
            .filter(
              (b) =>
                (category === "" || b.Category === category) &&
                (b.Title.toLowerCase().includes(search.toLowerCase()) ||
                  b.Category.toLowerCase().includes(search.toLowerCase()))
            )
            .map((book, index) => (
              <Link
                key={book.BookID}
                to={`/book/${book.BookID}`}
                onClick={() => fetchAndStoreBookData(book.BookID)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Cover */}
                <div className="h-52 sm:h-56 bg-gray-100">
                  <img
                    src={book.CoverImageUrl}
                    alt={book.Title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title + Category */}
                <div className="p-4 space-y-1">
                  <h2 className="text-base font-semibold text-orange-800 leading-snug line-clamp-2">
                    {book.Title}
                  </h2>
                  <p className="text-xs text-gray-600">{book.Category}</p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
