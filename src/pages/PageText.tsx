import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Page {
  PageID: string;
  PageTitle: string;
  PageText: string;
}

interface BookData {
  book: { Title: string };
  index: Page[];
  pages: Page[];
}

const PageText: React.FC = () => {
  const { bookId, pageId } = useParams<{ bookId: string; pageId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [indexList, setIndexList] = useState<Page[]>([]);
  const [fontSize, setFontSize] = useState("text-lg");
  const [bookTitle, setBookTitle] = useState("");

  useEffect(() => {
    if (!bookId || !pageId) return;

    const stored = localStorage.getItem(`bookData-${bookId}`);
    if (!stored) {
      console.warn("No book data in localStorage for:", bookId);
      navigate("/books");
      return;
    }

    try {
      const data: BookData = JSON.parse(stored);
      const index = data.index || [];
      const pages = data.pages || [];
      const book = data.book || {};

      setIndexList(index);

      // ✅ Improved book title logic
      const storedAllBooks = localStorage.getItem("allBooks");
      const allBooks = storedAllBooks ? JSON.parse(storedAllBooks) : [];

      let titleFromData = book?.Title?.trim();

      if (!titleFromData && allBooks?.length > 0) {
        const matchingBook = allBooks.find((b: any) => b.BookID === bookId);
        if (matchingBook?.Title) {
          titleFromData = matchingBook.Title;
        }
      }

      if (titleFromData) {
        setBookTitle(titleFromData);
      } else {
        const fallback = index[0]?.PageTitle || "Untitled Book";
        setBookTitle(fallback);
      }

      let foundPage = pages.find((p) => p.PageID === pageId) || null;

      if (!foundPage || !foundPage.PageText) {
        const indexItem = index.find((p) => p.PageID === pageId);
        if (indexItem) {
          foundPage = {
            PageID: indexItem.PageID,
            PageTitle: indexItem.PageTitle,
            PageText: indexItem.PageText || "",
          };

          const existingIdx = pages.findIndex((p) => p.PageID === pageId);
          if (existingIdx !== -1) {
            pages[existingIdx] = foundPage;
          } else {
            pages.push(foundPage);
          }

          localStorage.setItem(
            `bookData-${bookId}`,
            JSON.stringify({ ...data, pages })
          );
        }
      }

      if (foundPage && !foundPage.PageTitle) {
        const indexItem = index.find((p) => p.PageID === pageId);
        if (indexItem?.PageTitle) {
          foundPage.PageTitle = indexItem.PageTitle;
        }
      }

      setPage(foundPage || null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error parsing bookData:", error);
      navigate("/books");
    }
  }, [bookId, pageId, navigate]);

  const goToPage = (direction: "next" | "prev") => {
    const idx = indexList.findIndex((p) => p.PageID === pageId);
    const newIdx = direction === "next" ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < indexList.length) {
      const nextPage = indexList[newIdx];
      navigate(`/book/${bookId}/page/${nextPage.PageID}`);
    }
  };

  if (!page) {
    return (
      <div className="pt-24 text-center text-gray-600">
        Page not found. <br />
        <Link
          to={`/book/${bookId}`}
          className="text-orange-600 hover:underline text-sm font-medium"
        >
          📖 Back to {bookTitle || "Book"}
        </Link>
      </div>
    );
  }

  const currentIndex = indexList.findIndex((p) => p.PageID === pageId);
  const prevPage = indexList[currentIndex - 1];
  const nextPage = indexList[currentIndex + 1];

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4 sm:px-6 lg:px-16 relative">
      {/* 🔸 Top Bar */}
      <div className="flex justify-between items-center bg-orange-100 py-3 px-4 sm:px-8 rounded-t-lg">
        <div className="text-sm text-gray-700 flex items-center space-x-2">
          <Link to="/books" className="hover:text-orange-600 font-medium">
            📚 Books
          </Link>
          <span className="text-gray-500">›</span>
          <Link to={`/book/${bookId}`} className="hover:text-orange-600 font-medium">
            {bookTitle}
          </Link>
          <span className="text-gray-500">›</span>
          <span className="text-orange-800 font-semibold truncate max-w-[160px] sm:max-w-none">
            {page.PageTitle}
          </span>
        </div>

        {/* Font size dropdown */}
        <div className="text-sm text-gray-700">
          <label className="mr-2">Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          >
            <option value="text-base">Small</option>
            <option value="text-lg">Medium</option>
            <option value="text-xl">Large</option>
            <option value="text-2xl">Extra Large</option>
          </select>
        </div>
      </div>

      {/* 🔸 White Card */}
      <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow-md mt-0">
        {/* Book Title */}
        <h3 className="text-center text-2xl text-orange-700 font-semibold mb-2">
          {bookTitle}
        </h3>

        {/* Chapter Title */}
        <h3 className="text-center text-xl text-orange-800 font-bold mb-6">
          {page.PageTitle}
        </h3>

        {/* Page Text */}
        <div
          className={`whitespace-pre-line leading-relaxed text-gray-800 ${fontSize}`}
        >
          {page.PageText}
        </div>

        {/* 🔸 Navigation */}
        <div className="mt-10 space-y-4">
          <div className="text-center">
            <Link
              to={`/book/${bookId}`}
              className="text-orange-600 hover:underline text-sm"
            >
              📖 Back to Index
            </Link>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => goToPage("prev")}
              className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded shadow disabled:opacity-50"
              disabled={!prevPage}
            >
              ← {prevPage?.PageTitle || "Previous"}
            </button>

            <button
              onClick={() => goToPage("next")}
              className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded shadow disabled:opacity-50"
              disabled={!nextPage}
            >
              {nextPage?.PageTitle || "Next"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageText;
