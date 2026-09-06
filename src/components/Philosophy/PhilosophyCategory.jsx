import { useEffect, useState } from "react";
import Book from "../book/Book";
import "./PhilosophyCategory.css";
import { Link } from "react-router";
import { getBooksByTopic } from "../../constants/booksData";

export default function PhilosophyCategory() {
  const [Philosophy, setPhilosophy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPhilosophy() {
      try {
        setLoading(true);
        const books = await getBooksByTopic("philosophy", 5);
        setPhilosophy(books);
      } catch (error) {
        console.error("Failed to fetch popular books:", error);
      } finally {
        setLoading(false);
      }
    }
    getPhilosophy();
  }, []);

  return (
    <section className="Philosophy">
      <div className="Philosophy-container">
        <div className="phil-top">
          <div>
            <h2 className="phil-title"> الفلسفة</h2>
            <h5 className="phil-desc">استكشف أعمق الكتب والأفكار الفلسفية</h5>
          </div>

          <Link to={"/categories/philosophy"} className="phil-link">
            عرض المزيد ←
          </Link>
        </div>
        <hr />

        <div className="phil-books">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="book-skeleton" />
              ))
            : Philosophy.map((b) => <Book key={b.id} b={"need"} book={b} />)}
        </div>
      </div>
    </section>
  );
}
