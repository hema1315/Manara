import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Bookmark, Heart } from "lucide-react";
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

function secureUrl(url) {
  return url?.replace(/^http:\/\//i, "https://");
}

async function downloadReadableHtml(url, filename) {
  try {
    const secureReadUrl = secureUrl(url);
    const res = await fetch(secureReadUrl);

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    let html = await res.text();
    const baseTag = `<base href="${secureReadUrl}">`;

    html = html.includes("<head>")
      ? html.replace("<head>", `<head>${baseTag}`)
      : baseTag + html;

    const blobUrl = URL.createObjectURL(
      new Blob([html], { type: "text/html" }),
    );

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download book:", error);
    window.open(secureUrl(url), "_blank");
  }
}

export default function BookDet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInLibrary, toggleLibrary } = useLibrary();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingType, setDownloadingType] = useState(null);
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

  useEffect(() => {
    document.body.style.overflow = showPreview ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPreview]);

  async function handleReadableDownload() {
    setDownloadingType("html");
    await downloadReadableHtml(book.read_url, `${book.title}.html`);
    setDownloadingType(null);
  }

  if (loading) {
    return <p className="bookDetails-loading">جاري التحميل...</p>;
  }

  if (!book) {
    return <p className="bookDetails-loading">الكتاب غير موجود</p>;
  }

  const isFav = isFavorite(book.id);
  const inLibrary = isInLibrary(book.id);
  const previewUrl = secureUrl(book.read_url);

  const requireAuth = (action) => {
    if (!user) {
      navigate("/login");
      return;
    }

    action();
  };

  return (
    <div className="bookDetails-page">
      <div className="bookDetails-top">
        <img src={book.cover} alt={book.title} className="bookDetails-cover" />

        <div className="bookDetails-info">
          <Link to={`/categories/${book.topic}`} className="bookDetails-topic">
            {book.topic}
          </Link>

          <h1 className="bookDetails-title">{book.title}</h1>

          <h3 className="bookDetails-author">
            {formatAuthorName(book.author)}
          </h3>

          <div className="bookDetails-stats">
            <span>عدد التحميلات: {book.download_count?.toLocaleString()}</span>
          </div>

          <div className="bookDetails-actions">
            {book.read_url && (
              <>
                <button
                  className="btn btn-gold"
                  disabled={downloadingType === "html"}
                  onClick={handleReadableDownload}
                >
                  {downloadingType === "html"
                    ? "جاري التحميل..."
                    : "تحميل نسخة للقراءة"}
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => setShowPreview(true)}
                >
                  معاينة الكتاب
                </button>
              </>
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

      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="preview-close"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>

            <iframe
              src={previewUrl}
              title={book.title}
              className="preview-frame"
            />
          </div>
        </div>
      )}
    </div>
  );
}
