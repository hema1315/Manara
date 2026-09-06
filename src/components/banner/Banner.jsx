import { ArrowLeft } from "lucide-react";
import img from "./img.jpg";
import { Link } from "react-router";
import "./banner.css";

export default function Banner() {
  return (
    <section className="cta-section">
      <div className="cta-bg-glow"></div>
      <div className="cta-bg-pattern"></div>

      <div className="container cta-container">
        <div className="cta-content">
          <h2 className="cta-headline">
            رحلتك القادمة بين الكتب{" "}
            <span className="headline-highlight">تبدأ من هنا.</span>
          </h2>

          <Link to="/books" className="cta-primary-btn">
            <span>اكتشف مكتبتك الآن</span>
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="cta-visual">
          <div className="cta-tilted-card">
            <div className="cta-image-wrap">
              <img
                src={img}
                alt="اقرأ الآن"
                className="cta-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="cta-floating-pill">
              <span>الكثير من الكتب في انتظارك </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
