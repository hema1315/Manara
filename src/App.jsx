import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router";
import ScrollToTop from "./components/ScrollToTop";
import PopularBooks from "./pages/popular/PopularBooks";
import Footer from "./components/footer/Footer";
import Category from "./pages/category/Category";
import AllBooks from "./pages/allBooks/AllBooks";
import BookDet from "./pages/bookDet/BookDet";
import Search from "./pages/search/Search";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GuestRoute from "./pages/auth/GuestRoute";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Profile from "./pages/profile/Profile";
import Favorites from "./pages/fav/Favorites";
import Library from "./pages/library/Library";
import NotFound from "./pages/notFound/NotFound";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import RecoveryRoute from "./pages/auth/RecoveryRoute";

function RecoveryGuard() {
  const { isRecovery } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRecovery && location.pathname !== "/reset-password") {
      navigate("/reset-password", { replace: true });
    }
  }, [isRecovery, location.pathname, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RecoveryGuard />
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<PopularBooks />} />
          <Route path="/categories/:id" element={<Category />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/books/:id" element={<BookDet />} />
          <Route path="/search/:search" element={<Search />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <RecoveryRoute>
                <ResetPassword />
              </RecoveryRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
