import "./book.css";

export default function BookSkeleton({ count = 1 }) {
  return Array.from({ length: count }).map((_, index) => (
    <div key={index} className="book book-skeleton-card">
      <div className="skeleton book-skeleton-image" />
      <div className="book-info">
        <div className="skeleton book-skeleton-title" />
        <div className="skeleton book-skeleton-author" />
      </div>
      <div className="book-footer">
        <div className="skeleton book-skeleton-downloads" />
      </div>
    </div>
  ));
}
