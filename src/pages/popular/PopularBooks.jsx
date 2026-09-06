import { useEffect, useState } from "react";

import "./popularBooks.css";
import Book from "../../components/book/Book";
import { getPopularPage } from "../../constants/booksData";

const BOOKS_PER_PAGE = 12;
const MAX_PAGES = 5;

export default function PopularBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPopular() {
      try {
        setLoading(true);
        const { books, totalPages } = await getPopularPage(
          page,
          BOOKS_PER_PAGE,
          MAX_PAGES,
        );
        setBooks(books);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch popular books:", error);
      } finally {
        setLoading(false);
      }
    }
    getPopular();
  }, [page]);

  return (
    <div className="popular-page">
      <div className="pop-head">
        <div className="right">
          <h1 className="popular-title">الأكثر قراءة</h1>
          <h3 className="popular-desc">الأشهر</h3>
        </div>
        <h3 className="left">
          الكتب التي اختارها القرّاء
          <br /> حان دورك لاكتشافها
        </h3>
      </div>
      <hr />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="popular-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="popular-pagination">
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
    </div>
  );
}
