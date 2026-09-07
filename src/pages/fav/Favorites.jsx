import { useFavorites } from "../../contexts/FavoritesContext";
import { Heart } from "lucide-react";
import UserSavedData from "../../components/userSavedData/UserSavedData";

export default function Favorites() {
  const { favorites, toggleFavorite, loading } = useFavorites();

  return (
    <UserSavedData
      items={favorites}
      loading={loading}
      onToggle={toggleFavorite}
      icon={Heart}
      title="قائمة المفضلة"
      subtitle="الكتب المفضلة لديك"
      countLabel="كتب محفوظة"
      loadingText="جاري تجهيز كتبك المفضلة..."
      emptyTitle="قائمة المفضلة فارغة حالياً"
      emptyText="لم تقم بإضافة أي كتاب للمفضلة بعد"
      deleteLabel="إزالة من المفضلة"
    />
  );
}
