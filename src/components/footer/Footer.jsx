import { Link } from "react-router";
import "./footer.css";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bg-glow"></div>

      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <BookOpen size={22} />
              <span>منارة</span>
            </div>
            <p className="footer-desc">
              مكتبتك الرقمية للكتب الكلاسيكية والفلسفية، اقرأ وحمّل جميع انواع
              الكتب بحرية تامة.
            </p>
            <p className="footer-quote">
              "في كل صفحة نافذة على عالم لم تكتشفه بعد"
            </p>
          </div>

          <div className="footer-links-group">
            <h4>روابط سريعة</h4>
            <Link to="/">الرئيسية</Link>
            <Link to="/books">تصفح الكتب</Link>
            <Link to="/popular">الأكثر رواجاً</Link>
            <Link to="/favorites">المفضلة</Link>
          </div>

          <div className="footer-links-group">
            <h4>الحساب</h4>
            <Link to="/login">تسجيل الدخول</Link>
            <Link to="/signup">إنشاء حساب</Link>
            <Link to="/library">مكتبتي</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} منارة. جميع الحقوق محفوظة.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/terms">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
