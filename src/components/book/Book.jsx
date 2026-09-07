import "./book.css";
import { Link } from "react-router";
import { formatAuthorName } from "../../constants/booksData";

export default function Book({ book, shadow = false, fav = false }) {
  const imageUrl = book.cover;
  const authorName = formatAuthorName(book.author);

  return (
    <Link
      to={`/books/${book.id}`}
      className={`book ${shadow ? "book-shadow" : ""}`}
    >
      <div className="book-divImg">
        <img src={imageUrl} alt={book.title} loading="lazy" />
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        {!fav && (
          <p className="book-author" title={authorName}>
            {authorName}
          </p>
        )}
      </div>

      {!fav && (
        <div className="book-footer">
          <p className="book-downloads">
            التنزيلات:{" "}
            <span>{book.download_count?.toLocaleString("ar-EG")}</span>
          </p>
        </div>
      )}
    </Link>
  );
}
