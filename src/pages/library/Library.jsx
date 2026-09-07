import { useLibrary } from "../../contexts/LibraryContext";
import { Bookmark } from "lucide-react";
import UserSavedData from "../../components/userSavedData/UserSavedData";

export default function Library() {
  const { library, toggleLibrary, loading } = useLibrary();

  return (
    <UserSavedData
      items={library}
      loading={loading}
      onToggle={toggleLibrary}
      icon={Bookmark}
      title="مكتبتي"
      subtitle="الكتب المحفوظة  "
      countLabel="كتب في المكتبة"
      loadingText="جاري تجهيز مكتبتك..."
      emptyTitle="مكتبتك فارغة حالياً"
      emptyText="لم تقم بإضافة أي كتاب إلى مكتبتك بعد"
      deleteLabel="إزالة من المكتبة"
    />
  );
}
