import { useEffect, useState } from "react";

import "./category.css";
import Book from "../../components/book/Book";
import { useParams } from "react-router";
import { ALL_CATEGORIES } from "../../constants/categories";
import { getTopicPage } from "../../constants/booksData";

const BOOKS_PER_PAGE = 12;
const MAX_PAGES = 5;

export default function Category() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const currentCategory = ALL_CATEGORIES.find((cat) => cat.topic === id);
  const categoryLabel = currentCategory ? currentCategory.label : "تصنيف";

  useEffect(() => {
    async function getCategory() {
      try {
        setLoading(true);
        const { books, totalPages } = await getTopicPage(
          id,
          page,
          BOOKS_PER_PAGE,
          MAX_PAGES,
        );
        setBooks(books);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch category books:", error);
      } finally {
        setLoading(false);
      }
    }
    getCategory();
  }, [page, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [id]);

  return (
    <div className="category-page">
      <div className="cat-head">
        <div className="right">
          <h1 className="category-title">{categoryLabel}</h1>
          <h3 className="category-desc"> التصنيف</h3>
        </div>
        <h3 className="left">تصفح بناءً على ذوقك</h3>
      </div>
      <hr />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="category-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="category-pagination">
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
