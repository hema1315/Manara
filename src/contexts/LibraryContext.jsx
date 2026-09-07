import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../constants/supabaseClient";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLibrary = useCallback(async () => {
    if (!user?.id) {
      setLibrary([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("library")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setLibrary(data);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchLibrary();
  }, [user?.id, fetchLibrary]);

  const isInLibrary = (bookId) => {
    return library.some((item) => String(item.book_id) === String(bookId));
  };

 const toggleLibrary = async (book) => {
   if (!user) {
     return;
   }
   const bookIdStr = String(book.id);
   const exists = isInLibrary(bookIdStr);

   if (exists) {
     setLibrary((prev) =>
       prev.filter((item) => String(item.book_id) !== bookIdStr),
     );

     const { error } = await supabase
       .from("library")
       .delete()
       .eq("user_id", user.id)
       .eq("book_id", bookIdStr);

     if (error) {
       fetchLibrary();
     }
   } else {
      const coverUrl =
        book.cover ||
        `https://downloads.hindawi.org/covers/svg/270x360/${book.id}.svg`;
      const newItem = {
        user_id: user.id,
        book_id: bookIdStr,
        book_title: book.title,
        cover_url: coverUrl,
      };

     const { data, error } = await supabase
       .from("library")
       .insert([newItem])
       .select();

     if (!error && data) {
       setLibrary((prev) => [...prev, data[0]]);
     }
   }
 };

  return (
    <LibraryContext.Provider
      value={{
        library,
        libraryCount: library.length,
        isInLibrary,
        toggleLibrary,
        loading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);
