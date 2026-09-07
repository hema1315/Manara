import BooksPage from "../BooksPage/BooksPage";
import { getPopularPage } from "../../constants/booksData";

export default function PopularBooks() {
  return (
    <BooksPage
      title="الأكثر قراءة"
      subtitle="الأشهر"
      tagline={
        <>
          الكتب التي اختارها القرّاء
          <br /> حان دورك لاكتشافها
        </>
      }
      fetchPage={(page) => getPopularPage(page, 12, 5)}
    />
  );
}
