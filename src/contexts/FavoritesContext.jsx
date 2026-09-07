import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../constants/supabaseClient";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setFavorites(data);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [user?.id, fetchFavorites]);

  const isFavorite = (bookId) => {
    return favorites.some((item) => String(item.book_id) === String(bookId));
  };

 const toggleFavorite = async (book) => {
   if (!user) {
     return;
   }

   const bookIdStr = String(book.id);
   const exists = isFavorite(bookIdStr);

   if (exists) {
     setFavorites((prev) =>
       prev.filter((item) => String(item.book_id) !== bookIdStr),
     );

     const { error } = await supabase
       .from("favorites")
       .delete()
       .eq("user_id", user.id)
       .eq("book_id", bookIdStr);

     if (error) {
       fetchFavorites();
     }
   } else {
      const coverUrl =
        book.cover ||
        `https://downloads.hindawi.org/covers/svg/270x360/${book.id}.svg`;
      const newFav = {
        user_id: user.id,
        book_id: bookIdStr,
        book_title: book.title,
        cover_url: coverUrl,
      };

     const { data, error } = await supabase
       .from("favorites")
       .insert([newFav])
       .select();

     if (!error && data) {
       setFavorites((prev) => [...prev, data[0]]);
     }
   }
 };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
