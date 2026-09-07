import { useState, useEffect } from "react";
import { Link } from "react-router";
import { BookOpen, Trash2, ArrowRight } from "lucide-react";
import Book from "../book/Book";
import "./userSavedData.css";

const ITEMS_PER_PAGE = 8;

export default function UserSavedData({
  items,
  loading,
  onToggle,
  icon: Icon,
  title,
  subtitle,
  countLabel,
  loadingText,
  emptyTitle,
  emptyText,
  deleteLabel,
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [items.length, totalPages, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return (
      <div className="sbp-page">
        <div className="sbp-loading-container">
          <div className="sbp-spinner"></div>
          <p className="sbp-loading">{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sbp-page">
      <header className="sbp-header">
        <div className="sbp-header-content">
          <div className="sbp-title-row">
            <div className="sbp-title-group">
              <div className="sbp-icon-box">
                <Icon size={26} className="sbp-header-icon" />
              </div>
              <div>
                <h1>{title}</h1>
                <p className="sbp-subtitle">{subtitle}</p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="sbp-count-pill">
                <span>{items.length}</span> {countLabel}
              </div>
            )}
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="sbp-empty">
          <div className="sbp-empty-icon-wrap">
            <BookOpen size={48} className="sbp-empty-icon" />
          </div>
          <h2>{emptyTitle}</h2>
          <p>{emptyText}</p>
          <Link to="/books" className="sbp-explore-btn">
            <span>استكشف الكتب الآن</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="sbp-grid">
            {currentItems.map((item) => {
              const formattedBook = {
                id: item.book_id,
                title: item.book_title,
                cover: item.cover_url,
              };

              return (
                <div key={item.id || item.book_id} className="sbp-card-item">
                  <button
                    className="sbp-delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      onToggle({
                        id: item.book_id,
                        title: item.book_title,
                      });
                    }}
                    title={deleteLabel}
                    aria-label={deleteLabel}
                  >
                    <Trash2 size={16} />
                  </button>

                  <Book book={formattedBook} fav={true} />
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="sbp-pagination">
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
