import { useEffect, useState } from "react";
import Book from "../book/Book";
import "./history.css";
import { Link } from "react-router";
import { getBooksByTopic } from "../../constants/booksData";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHistory() {
      try {
        setLoading(true);
        const books = await getBooksByTopic("history", 5);
        setHistory(books);
      } catch (error) {
        console.error("Failed to fetch popular books:", error);
      } finally {
        setLoading(false);
      }
    }
    getHistory();
  }, []);

  return (
    <section className="History">
      <div className="History-container">
        <div className="his-top">
          <div>
            <h2 className="his-title"> التاريخ</h2>
            <h5 className="his-desc"> أسرار التاريخ وحكايات الأمم بين يديك</h5>
          </div>

          <Link to={"/categories/history"} className="his-link">
            عرض المزيد ←
          </Link>
        </div>

        <div className="his-books">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="book-skeleton" />
              ))
            : history.map((b) => <Book key={b.id} b={"none"} book={b} />)}
        </div>
      </div>
    </section>
  );
}
