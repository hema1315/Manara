import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLibrary } from "../../contexts/LibraryContext";
import { Bookmark, BookOpen, Trash2, ArrowRight } from "lucide-react";
import Book from "../../components/book/Book";
import "./library.css";

const ITEMS_PER_PAGE = 8;

export default function Library() {
  const { library, toggleLibrary, loading } = useLibrary();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(library.length / ITEMS_PER_PAGE) || 1;

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = library.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [library.length, totalPages, page]);

  if (loading) {
    return (
      <div className="library-page">
        <div className="lib-loading-container">
          <div className="lib-spinner"></div>
          <p className="lib-loading">جاري تجهيز مكتبتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <header className="library-header">
        <div className="library-header-content">
          <div className="library-title-row">
            <div className="library-title-group">
              <div className="lib-icon-box">
                <Bookmark size={26} className="lib-header-icon" />
              </div>
              <div>
                <h1>مكتبتي</h1>
                <p className="library-subtitle">
                  الكتب المحفوظة للقراءة لاحقاً
                </p>
              </div>
            </div>

            {library.length > 0 && (
              <div className="lib-count-pill">
                <span>{library.length}</span> كتب في المكتبة
              </div>
            )}
          </div>
        </div>
      </header>

      {library.length === 0 ? (
        <div className="lib-empty">
          <div className="lib-empty-icon-wrap">
            <BookOpen size={48} className="lib-empty-icon" />
          </div>
          <h2>مكتبتك فارغة حالياً</h2>
          <p>لم تقم بإضافة أي كتاب إلى مكتبتك بعد</p>
          <Link to="/books" className="lib-explore-btn">
            <span>استكشف الكتب الآن</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="lib-grid">
            {currentItems.map((item) => {
              const formattedBook = {
                id: item.book_id,
                title: item.book_title,
                cover: item.cover_url,
              };

              return (
                <div key={item.id || item.book_id} className="lib-card-item">
                  <button
                    className="lib-delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLibrary({
                        id: item.book_id,
                        title: item.book_title,
                      });
                    }}
                    title="إزالة من المكتبة"
                    aria-label="إزالة من المكتبة"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Book book={formattedBook} fav={true} />
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="category-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
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
        </>
      )}
    </div>
  );
}
