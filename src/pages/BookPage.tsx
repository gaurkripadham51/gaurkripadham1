import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface PageData {
  PageID: string;
  PageNumber: string;
  PageText: string;
}

const BookPage: React.FC = () => {
  const { bookId, pageId } = useParams<{ bookId: string; pageId: string }>();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [indexList, setIndexList] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookData = JSON.parse(localStorage.getItem(`bookData-${bookId}`) || "{}");
    setIndexList(bookData.pages || []);

    const page = bookData.pages?.find((p: PageData) => p.PageID === pageId);
    setPageData(page || null);
    setLoading(false);
  }, [bookId, pageId]);

  const currentIndex = indexList.findIndex(i => i.PageID === pageId);
  const prev = indexList[currentIndex - 1];
  const next = indexList[currentIndex + 1];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-center">📘 Page {pageData?.PageNumber}</h1>
      {loading ? <p>Loading page...</p> : <p>{pageData?.PageText}</p>}
      <div>
        {prev && <Link to={`/book/${bookId}/page/${prev.PageID}`}>← {prev.PageNumber}</Link>}
        <Link to={`/book/${bookId}`}>Back to Index</Link>
        {next && <Link to={`/book/${bookId}/page/${next.PageID}`}>{next.PageNumber} →</Link>}
      </div>
    </div>
  );
};

export default BookPage;
