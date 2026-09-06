import { useEffect, useState } from "react";

import "./allBooks.css";
import Book from "../../components/book/Book";
import { getAllBooksPage } from "../../constants/booksData";

const BOOKS_PER_PAGE = 12;

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllBooks() {
      try {
        setLoading(true);
        const { books, totalPages } = await getAllBooksPage(
          page,
          BOOKS_PER_PAGE,
          BOOKS_PER_PAGE,
        );
        setBooks(books);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch all books:", error);
      } finally {
        setLoading(false);
      }
    }
    getAllBooks();
  }, [page]);

  return (
    <div className="allBooks-page">
      <div className="all-head">
        <div className="right">
          <h1 className="allBooks-title">جميع الكتب</h1>
          <h3 className="allBooks-desc">تصفح وكأنك في مكتبة </h3>
        </div>
      </div>
      <hr />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="allBooks-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="allBooks-pagination">
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
