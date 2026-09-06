import { useEffect, useState } from "react";
import Book from "../book/Book";
import "./popular.css";
import { Link } from "react-router";
import { getPopularBooksFlat } from "../../constants/booksData";

export default function Popular() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPopular() {
      try {
        setLoading(true);
        const books = await getPopularBooksFlat(5);
        setPopular(books);
      } catch (error) {
        console.error("Failed to fetch popular books:", error);
      } finally {
        setLoading(false);
      }
    }
    getPopular();
  }, []);

  return (
    <section className="popular">
      <div className="popular-container">
        <div className="pop-top">
          <h2 className="pop-title">الأكثر رواجاً</h2>
          <Link to={"/popular"} className="pop-link">
            عرض المزيد ←
          </Link>
        </div>

        <div className="pop-books">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="book-skeleton" />
              ))
            : popular.map((b) => <Book key={b.id} b={"none"} book={b} />)}
        </div>
      </div>
    </section>
  );
}
