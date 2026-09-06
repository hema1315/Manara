import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.jsx";
import { LibraryProvider } from "./contexts/LibraryContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>,
);
