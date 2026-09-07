import { useParams } from "react-router";
import BooksPage from "../BooksPage/BooksPage";
import { ALL_CATEGORIES } from "../../constants/categories";
import { getTopicPage } from "../../constants/booksData";

export default function Category() {
  const { id } = useParams();
  const currentCategory = ALL_CATEGORIES.find((cat) => cat.topic === id);
  const categoryLabel = currentCategory ? currentCategory.label : "تصنيف";

  return (
    <BooksPage
      title={categoryLabel}
      subtitle="التصنيف"
      tagline="تصفح بناءً على ذوقك"
      fetchPage={(page) => getTopicPage(id, page, 12, 5)}
      resetKey={id}
    />
  );
}
