import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Book from "../../components/book/Book";
import "./search.css";
import { searchBooksFull } from "../../constants/booksData";

const BOOKS_PER_PAGE = 10;
const MAX_PAGES = 5;

export default function Search() {
  const { search } = useParams();
  const query = decodeURIComponent(search || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getResults() {
      try {
        setLoading(true);
        const { books, totalPages } = await searchBooksFull(
          query,
          page,
          BOOKS_PER_PAGE,
          MAX_PAGES,
        );
        setResults(books);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    }
    getResults();
  }, [query, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <section className="search-results">
      <div className="sr-container">
        <div className="sr-top">
          <h2 className="sr-title">
            نتائج البحث عن <span className="sr-query"> {query}</span>
          </h2>

          <span className="sr-text"> البحث أول طريق المعرفة</span>
        </div>

        <div className="sr-books">
          {loading ? (
            Array.from({ length: BOOKS_PER_PAGE }).map((_, index) => (
              <div key={index} className="sr-skeleton" />
            ))
          ) : results.length > 0 ? (
            results.map((b) => <Book key={b.id} b={"none"} book={b} />)
          ) : (
            <div className="sr-empty">
              <p>لا يوجد كتب </p>
            </div>
          )}
        </div>

        {!loading && results.length > 0 && totalPages > 1 && (
          <div className="search-pagination">
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
    </section>
  );
}
