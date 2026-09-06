import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useFavorites } from "../../contexts/FavoritesContext";
import { Heart, BookOpen, Trash2, ArrowRight } from "lucide-react";
import Book from "../../components/book/Book";
import "./favorites.css";

const ITEMS_PER_PAGE = 8;

export default function Favorites() {
  const { favorites, toggleFavorite, loading } = useFavorites();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE) || 1;

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentFavorites = favorites.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [favorites.length, totalPages, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="fav-loading-container">
          <div className="fav-spinner"></div>
          <p className="fav-loading">جاري تجهيز كتبك المفضلة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <div className="favorites-header-content">
          <div className="favorites-title-row">
            <div className="favorites-title-group">
              <div className="fav-icon-box">
                <Heart size={26} className="fav-header-icon" />
              </div>
              <div>
                <h1>قائمة المفضلة</h1>
                <p className="favorites-subtitle">الكتب المفضلة لديك</p>
              </div>
            </div>

            {favorites.length > 0 && (
              <div className="fav-count-pill">
                <span>{favorites.length}</span> كتب محفوظة
              </div>
            )}
          </div>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon-wrap">
            <BookOpen size={48} className="fav-empty-icon" />
          </div>
          <h2>قائمة المفضلة فارغة حالياً</h2>
          <p>لم تقم بإضافة أي كتاب للمفضلة بعد</p>
          <Link to="/books" className="fav-explore-btn">
            <span>استكشف الكتب الآن</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="fav-grid">
            {currentFavorites.map((item) => {
              const formattedBook = {
                id: item.book_id,
                title: item.book_title,
                cover: item.cover_url,
              };

              return (
                <div key={item.id || item.book_id} className="fav-card-item">
                  <button
                    className="fav-delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite({
                        id: item.book_id,
                        title: item.book_title,
                      });
                    }}
                    title="إزالة من المفضلة"
                    aria-label="إزالة من المفضلة"
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
