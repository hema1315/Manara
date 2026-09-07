import { useEffect, useState } from "react";
import { Link } from "react-router";
import Book from "../book/Book";
import BookSkeleton from "../book/BookSkeleton";

import "./homeBookRow.css";

export default function HomeBookRow({
  title,
  description,
  linkTo,
  fetchFn,
  dark = false,
  divider = false,
  shadow = false,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const start = Date.now();
        const data = await fetchFn();
        const elapsed = Date.now() - start;
        const minDelay = 400;
        if (elapsed < minDelay) {
          await new Promise((resolve) =>
            setTimeout(resolve, minDelay - elapsed),
          );
        }
        if (active) setBooks(data);
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
  }, [fetchFn, retryKey]);

  return (
    <section className={`hbr ${dark ? "hbr-dark" : "hbr-light"}`}>
      <div className="hbr-container">
        <div className="hbr-top">
          <div>
            <h2 className="hbr-title">{title}</h2>
            {description && <h5 className="hbr-desc">{description}</h5>}
          </div>
          <Link to={linkTo} className="hbr-link">
            عرض المزيد ←
          </Link>
        </div>
        {divider && <hr />}

        <div className="hbr-books">
          {loading ? (
            <BookSkeleton count={5} dark={dark} />
          ) : error ? (
            <div className="hbr-error">
              <p>حدث خطأ أثناء تحميل الكتب</p>
              <button onClick={() => setRetryKey((k) => k + 1)}>
                إعادة المحاولة
              </button>
            </div>
          ) : (
            books.map((b) => <Book key={b.id} book={b} shadow={shadow} />)
          )}
        </div>
      </div>
    </section>
  );
}
