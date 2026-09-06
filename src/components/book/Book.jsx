import "./book.css";
import { Link } from "react-router";
import { formatAuthorName } from "../../constants/booksData";

export default function Book({ book, b, fav = false }) {
  const imageUrl = book.cover;
  const authorName = formatAuthorName(book.author);

  return (
    <Link
      style={{ boxShadow: b === "none" ? "none" : "0px 0px 0px black" }}
      to={`/books/${book.id}`}
      className="book"
    >
      <div className="book-divImg">
        <img src={imageUrl} alt={book.title} loading="lazy" />
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        <p
          style={{ display: fav ? "none" : "flex" }}
          className="book-author"
          title={authorName}
        >
          {authorName}
        </p>
      </div>

      <div style={{ display: fav ? "none" : "flex" }} className="book-footer">
        <p className="book-downloads">
          التنزيلات: <span>{book.download_count?.toLocaleString("ar-EG")}</span>
        </p>
      </div>
    </Link>
  );
}
