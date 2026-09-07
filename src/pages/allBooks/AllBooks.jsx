import BooksPage from "../BooksPage/BooksPage";
import { getAllBooksPage } from "../../constants/booksData";

export default function AllBooks() {
  return (
    <BooksPage
      title="جميع الكتب"
      subtitle="تصفح وكأنك في مكتبة"
      fetchPage={(page) => getAllBooksPage(page, 12, 12)}
    />
  );
}
