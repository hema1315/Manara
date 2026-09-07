import { useParams } from "react-router";
import BooksPage from "../BooksPage/BooksPage";
import { searchBooksFull } from "../../constants/booksData";

export default function Search() {
  const { search } = useParams();
  const query = decodeURIComponent(search || "");

  return (
    <BooksPage
      title={
        <>
          نتائج البحث عن <span className="blp-query">{query}</span>
        </>
      }
      tagline="البحث أول طريق المعرفة"
      fetchPage={(page) => searchBooksFull(query, page, 8, 5)}
      resetKey={query}
      emptyMessage={<p>لا يوجد كتب</p>}
    />
  );
}
