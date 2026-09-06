import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  Bookmark,
  User,
  Menu,
  X,
  Compass,
  ChevronLeft,
} from "lucide-react";
import "./navbar.css";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "/img1.png";
import { ALL_CATEGORIES } from "../../constants/categories";
import { searchBooks } from "../../constants/booksData";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".nav-search-wrapper") &&
        !e.target.closest(".mobile-search-wrapper")
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function truncate(text, max) {
    return text.length > max ? "..." + text.slice(0, max) : text;
  }
  useEffect(() => {
    setQuery("");
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const results = await searchBooks(value);
    setSuggestions(results);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    setMobileMenuOpen(false);
    navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  const handleSelectBook = (book) => {
    setShowSuggestions(false);
    setMobileMenuOpen(false);
    setQuery("");
    navigate(`/books/${book.id}`);
  };

  const renderSuggestions = () =>
    showSuggestions &&
    query.trim() && (
      <div className="search-dropdown">
        {suggestions.length > 0 ? (
          <ul className="dropdown-list">
            {suggestions.map((book) => (
              <li
                key={book.id}
                className="dropdown-item"
                onClick={() => handleSelectBook(book)}
              >
                <img
                  src={`https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`}
                  alt={book.title}
                  className="dropdown-book-thumb"
                  onError={(e) => {
                    e.target.src = "/fallback-cover.png";
                  }}
                />
                <div className="dropdown-book-info">
                  <span className="dropdown-book-title">
                    {truncate(book.title, 25)}
                  </span>
                </div>
                <ChevronLeft size={16} className="dropdown-arrow" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="dropdown-header">لا توجد نتائج</div>
        )}
      </div>
    );

  return (
    <>
      <header className="nav-wrapper">
        <div className="nav-container">
          <div className="nav-pill">
            <Link to={"/"} className="nav-brand">
              <img src={logo} alt="منارة" className="nav-logo-img" />
            </Link>

            <button
              className="nav-category-trigger"
              onClick={() => setIsSidebarOpen(true)}
              title="تصفح الأقسام والتصنيفات"
            >
              <Compass size={17} />
              <span>التصنيفات</span>
            </button>

            <nav className="nav-links">
              <Link
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                الرئيسية
              </Link>

              <Link
                to="/books"
                className={`nav-link ${
                  location.pathname === "/books" ? "active" : ""
                }`}
              >
                تصفح الكتب
              </Link>

              <Link
                to="/popular"
                className={`nav-link ${
                  location.pathname === "/popular" ? "active" : ""
                }`}
              >
                الأكثر قراءة
              </Link>
            </nav>

            <div className="nav-search-wrapper desktop-search">
              <form onSubmit={handleSearchSubmit} className="nav-search-bar">
                <Search
                  size={18}
                  className="search-icon"
                  onClick={handleSearchSubmit}
                />

                <input
                  type="text"
                  placeholder="ابحث عن كتاب، كاتب، أو موضوع..."
                  value={query}
                  maxLength={50}
                  onChange={handleSearchChange}
                  onFocus={() => query.trim() && setShowSuggestions(true)}
                />
              </form>
              {renderSuggestions()}
            </div>
            <div className="nav-actions">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/favorites"
                    className="nav-action-btn"
                    title="المفضلة"
                  >
                    <Heart size={19} />
                  </Link>

                  <Link to="/library" className="nav-action-btn" title="مكتبتي">
                    <Bookmark size={19} />
                  </Link>

                  <Link
                    to="/profile"
                    className="nav-action-btn nav-profile-btn"
                    title="حسابي"
                  >
                    <User size={19} />
                  </Link>
                </>
              ) : (
                <Link to="/login" className="nav-cta-btn desktop-cta">
                  تسجيل الدخول
                </Link>
              )}

              <button
                className="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-content">
            <div className="mobile-search-area mobile-search-wrapper">
              <form onSubmit={handleSearchSubmit} className="nav-search-bar">
                <Search
                  size={18}
                  className="search-icon"
                  onClick={handleSearchSubmit}
                />

                <input
                  type="text"
                  placeholder="ابحث عن كتاب أو كاتب..."
                  value={query}
                  maxLength={50}
                  onChange={handleSearchChange}
                  onFocus={() => query.trim() && setShowSuggestions(true)}
                />
              </form>
              {renderSuggestions()}
            </div>
            <div className="mobile-links-list">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                الرئيسية
              </Link>

              <Link to="/books" onClick={() => setMobileMenuOpen(false)}>
                تصفح الكتب
              </Link>

              <Link to="/popular" onClick={() => setMobileMenuOpen(false)}>
                الأكثر قراءة
              </Link>

              <button
                className="mobile-categories-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSidebarOpen(true);
                }}
              >
                <span>استعراض التصنيفات</span>
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="mobile-footer-actions">
              <Link to={"/login"} className="nav-cta-btn full-width">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      )}

      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`categories-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-title-group">
            <Compass size={22} className="sidebar-icon" />

            <div>
              <h3>تصنيفات الكتب</h3>
              <p>استكشف آلاف الكتب المتنوعة</p>
            </div>
          </div>

          <button
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-body">
          <div className="categories-grid">
            {ALL_CATEGORIES.map((cat) => (
              <Link
                to={`/categories/${cat.topic}`}
                key={cat.label}
                className="category-card-item"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="cat-card-text">
                  <h4>{cat.label}</h4>
                </div>

                <ChevronLeft size={16} className="cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
