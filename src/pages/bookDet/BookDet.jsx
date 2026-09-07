import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Bookmark, Heart, Download } from "lucide-react";
import "./bookDet.css";

import {
  getBookPage,
  getBooksByTopic,
  formatAuthorName,
} from "../../constants/booksData";

import Book from "../../components/book/Book";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useLibrary } from "../../contexts/LibraryContext";
import { useAuth } from "../../contexts/AuthContext";
import { ALL_CATEGORIES } from "../../constants/categories";

function secureUrl(url) {
  if (!url) return "";
  return url.replace(/^http:\/\//i, "https://").replace(/^\/\//, "https://");
}

export default function BookDet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInLibrary, toggleLibrary } = useLibrary();
  const categoris = ALL_CATEGORIES;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rel, setRel] = useState([]);
  const [relLoading, setRelLoading] = useState(true);

  useEffect(() => {
    async function getBook() {
      try {
        setLoading(true);
        setBook(null);
        setRel([]);

        const data = await getBookPage(id);
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setLoading(false);
      }
    }

    getBook();
  }, [id]);

  useEffect(() => {
    if (!book?.topic) return;

    async function getRelated() {
      try {
        setRelLoading(true);
        const books = await getBooksByTopic(book.topic, 5, book.id);
        setRel(books);
      } catch (error) {
        console.error("Failed to fetch related books:", error);
      } finally {
        setRelLoading(false);
      }
    }

    getRelated();
  }, [book?.topic, book?.id]);

  if (loading) {
    return <p className="bookDetails-loading">جاري التحميل...</p>;
  }

  if (!book) {
    return <p className="bookDetails-loading">الكتاب غير موجود</p>;
  }

  const isFav = isFavorite(book.id);
  const inLibrary = isInLibrary(book.id);
  const coverUrl = secureUrl(book.cover);

  const requireAuth = (action) => {
    if (!user) {
      navigate("/login");
      return;
    }

    action();
  };

  const nameCat = categoris.filter((c) => {
    return c.topic == book?.topic.toLowerCase();
  });
  console.log(nameCat);

  return (
    <div className="bookDetails-page">
      <div className="bookDetails-top">
        <img src={coverUrl} alt={book.title} className="bookDetails-cover" />

        <div className="bookDetails-info">
          <Link to={`/categories/${book.topic}`} className="bookDetails-topic">
            {nameCat[0].label || book.topic}
          </Link>

          <h1 className="bookDetails-title">{book.title}</h1>

          <h3 className="bookDetails-author">
            {formatAuthorName(book.author)}
          </h3>

          <div className="bookDetails-stats">
            <span>عدد التحميلات: {book.download_count?.toLocaleString()}</span>
          </div>

          <div className="bookDetails-actions">
            {book.download_url && (
              <a
                href={book.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                download={`${book.title}.pdf`}
              >
                <Download size={18} />
                <span>تحميل الكتاب (PDF)</span>
              </a>
            )}

            <button
              className={`btn btn-fav ${isFav ? "active" : ""}`}
              onClick={() => requireAuth(() => toggleFavorite(book))}
              title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <Heart size={18} fill={isFav ? "#f5b722" : "none"} />
              <span>{isFav ? "في المفضلة" : "إضافة للمفضلة"}</span>
            </button>

            <button
              className={`btn btn-lib ${inLibrary ? "active" : ""}`}
              onClick={() => requireAuth(() => toggleLibrary(book))}
              title={inLibrary ? "إزالة من المكتبة" : "إضافة للمكتبة"}
            >
              <Bookmark size={18} fill={inLibrary ? "#f5b722" : "none"} />
              <span>{inLibrary ? "في المكتبة" : "إضافة للمكتبة"}</span>
            </button>
          </div>

          <Link to="/books" className="bookDetails-back">
            الرجوع لكل الكتب ←
          </Link>
        </div>
      </div>

      <section className="rel">
        <div className="rel-container">
          <div className="rel-top">
            <div>
              <h2 className="rel-title">قد يعجبك أيضًا</h2>

              <h5 className="rel-desc">رحلة أخرى في نفس العالم الأدبي</h5>
            </div>
          </div>

          <hr />

          <div className="rel-books">
            {relLoading
              ? Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="book-skeleton" />
                ))
              : rel.map((b) => <Book key={b.id} b="none" book={b} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
