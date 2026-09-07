import { useEffect, useState } from "react";
import Book from "../../components/book/Book";
import BookSkeleton from "../../components/book/BookSkeleton";
import "./booksPage.css";

export default function BooksPage({
  title,
  subtitle,
  tagline,
  fetchPage,
  resetKey,
  emptyMessage,
  skeletonCount = 12,
}) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const start = Date.now();
        const { books, totalPages } = await fetchPage(page);
        const elapsed = Date.now() - start;
        const minDelay = 400;
        if (elapsed < minDelay) {
          await new Promise((resolve) =>
            setTimeout(resolve, minDelay - elapsed),
          );
        }
        if (active) {
          setBooks(books);
          setTotalPages(totalPages);
        }
      } catch (err) {
        console.error(err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [fetchPage, page, retryKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="blp-page">
      <div className="blp-head">
        <div className="right">
          <h1 className="blp-title">{title}</h1>
          {subtitle && <h3 className="blp-subtitle">{subtitle}</h3>}
        </div>
        {tagline && <h3 className="left">{tagline}</h3>}
      </div>
      <hr />

      {loading ? (
        <div className="blp-grid">
          <BookSkeleton count={skeletonCount} />
        </div>
      ) : error ? (
        <div className="blp-error">
          <p>حدث خطأ أثناء تحميل الكتب</p>
          <button onClick={() => setRetryKey((k) => k + 1)}>
            إعادة المحاولة
          </button>
        </div>
      ) : books.length > 0 ? (
        <div className="blp-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </div>
      ) : (
        emptyMessage && <div className="blp-empty">{emptyMessage}</div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="blp-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            السابق
          </button>
          <span>
            {page} من {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
