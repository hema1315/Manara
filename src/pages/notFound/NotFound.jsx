import { Link } from "react-router";
import { BookX } from "lucide-react";
import "./notFound.css";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-icon-wrap">
          <BookX size={48} className="notfound-icon" />
        </div>

        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">الصفحة غير موجودة</h2>
        <p className="notfound-desc">
          يبدو إن الصفحة التي تبحث عنها غير موجودة
        </p>

        <Link to="/" className="notfound-btn">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
