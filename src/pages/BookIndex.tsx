import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

interface IndexItem {
  BookID: string;
  PageID: string;
  PageTitle: string;
}

interface Book {
  BookID: string;
  Title: string;
  Category: string;
  CoverImageUrl: string;
}

const BOOK_DATA_API =
  "https://script.google.com/macros/s/AKfycbwMawnNDDWztlYEZnkW9Y5azBV3KHNKNXICVa1lnp9RtKsgo7Ht90Qtcq0PDmbma1ZnWw/exec?action=getBookData&bookId=";

const BookIndex: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [indexList, setIndexList] = useState<IndexItem[]>([]);
  const [bookTitle, setBookTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [fontSize, setFontSize] = useState("text-base");
  const [navLoading, setNavLoading] = useState(false); // 🆕 for next/prev loader

  const loadBookData = async () => {
    const storedBooks = JSON.parse(localStorage.getItem("allBooks") || "[]");
    setAllBooks(storedBooks);

    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
      const rawBookData = localStorage.getItem(`bookData-${bookId}`);
      if (rawBookData) {
        try {
          const bookData = JSON.parse(rawBookData);
          setIndexList(bookData.index || []);
          const bookFromAll = storedBooks.find((b) => b.BookID === bookId);
          setBookTitle(bookFromAll?.Title || bookData.book?.Title || "Untitled Book");
        } catch (err) {
          console.error("Failed to parse book data:", err);
          setBookTitle("Untitled Book");
        }
        break;
      } else {
        retries++;
        await new Promise((res) => setTimeout(res, 300));
      }
    }

    setLoading(false);
    setNavLoading(false); // 🆕 stop loader when data is loaded
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  const currentIndex = allBooks.findIndex((b) => b.BookID === bookId);
  const prevBook = allBooks[currentIndex - 1];
  const nextBook = allBooks[currentIndex + 1];

  const handleBookChange = async (newBookId: string) => {
    setNavLoading(true); // 🆕 start loader
    const res = await fetch(`${BOOK_DATA_API}${newBookId}`);
    const data = await res.json();
    localStorage.setItem(`bookData-${newBookId}`, JSON.stringify(data));
    navigate(`/book/${newBookId}`);
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4 sm:px-6 lg:px-20 relative">
      {/* 🔶 Top Bar */}
      <div className="flex justify-between items-center bg-orange-100 py-3 px-4 sm:px-8 rounded-t-lg">
        <div className="text-sm text-gray-700 flex items-center space-x-2">
          <Link to="/books" className="hover:text-orange-600 font-medium">
            📚 Books
          </Link>
          <span className="text-gray-500">›</span>
          <span className="text-orange-800 font-semibold max-w-[160px] sm:max-w-none truncate sm:whitespace-normal block sm:inline">
            {bookTitle}
          </span>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center text-sm text-gray-700">
          <label className="mr-2">Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm shadow-sm"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
          </select>
        </div>
      </div>

      {/* 🔶 White Card */}
      <div className="bg-white px-6 sm:px-12 py-8 rounded-b-lg shadow-md mt-0">
        {/* Book Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-orange-800 text-center mb-2">
          {bookTitle}
        </h2>

        {/* Subtitle (kept empty) */}
        <h3 className="text-xl sm:text-2xl font-bold text-orange-700 text-center mb-10">
          {indexList.length > 0 ? "" : ""}
        </h3>

        {/* Index List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading index...</p>
        ) : (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {indexList.map((item, idx) => (
              <Link
                key={item.PageID}
                to={`/book/${bookId}/page/${item.PageID}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className={`bg-orange-50 px-6 py-4 rounded-lg shadow hover:shadow-md border-l-4 border-orange-400 hover:border-orange-600 transition-all duration-200 ${fontSize}`}
                >
                  <p className="font-medium text-gray-800 group-hover:text-orange-700">
                    {idx + 1}. {item.PageTitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link
            to="/books"
            className="text-orange-600 hover:text-orange-800 font-medium underline"
          >
            ← Back to Books
          </Link>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
          <div className="w-full sm:w-auto sm:self-start">
            <button
              onClick={() => prevBook && handleBookChange(prevBook.BookID)}
              disabled={!prevBook || navLoading}
              className={`w-full sm:w-auto px-6 py-2 rounded text-white font-medium flex items-center justify-center gap-2 transition ${
                prevBook && !navLoading
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {navLoading && <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>}
              ← {prevBook ? prevBook.Title : "Previous Book"}
            </button>
          </div>

          <div className="w-full sm:w-auto sm:self-end text-right">
            <button
              onClick={() => nextBook && handleBookChange(nextBook.BookID)}
              disabled={!nextBook || navLoading}
              className={`w-full sm:w-auto px-6 py-2 rounded text-white font-medium flex items-center justify-center gap-2 transition ${
                nextBook && !navLoading
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {navLoading && <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>}
              {nextBook ? nextBook.Title : "Next Book"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookIndex;
