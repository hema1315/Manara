import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../constants/supabaseClient";

const AuthContext = createContext();
const RECOVERY_KEY = "isRecovery";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRecovery, setIsRecovery] = useState(
    sessionStorage.getItem(RECOVERY_KEY) === "true",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          sessionStorage.setItem(RECOVERY_KEY, "true");
          setIsRecovery(true);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const clearRecovery = () => {
    sessionStorage.removeItem(RECOVERY_KEY);
    setIsRecovery(false);
  };

  const signUp = (email, password, username) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => {
    sessionStorage.removeItem(RECOVERY_KEY);
    setIsRecovery(false);
    return supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    isRecovery,
    clearRecovery,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
