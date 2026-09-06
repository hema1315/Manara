import { ArrowLeft } from "lucide-react";
import defaultImg1 from "../../img1.jpg";
import defaultImg2 from "../../img2.jpg";
import "./Hero.css";
import { Link } from "react-router";

export default function Hero({ img1 = defaultImg1, img2 = defaultImg2 }) {
  return (
    <section className="hero-section">
      <div className="hero-bg-glow"></div>
      <div className="hero-bg-pattern"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-headline">
            عَوالِمٌ تُبنى
            <br />
            <span className="headline-highlight">بين طَيّات السُّطور.</span>
          </h1>

          <p className="hero-description">
            حيث يلتقي الشغف بالمعرفة والبحث عن الحقيقة. تصفح واقرأ افضل الكتب
            الفلسفية والأدبية والكلاسيكة ، أونلاين مباشرة أو حمّلها لجهازك.
          </p>

          <div className="hero-cta-group">
            <a href="/books" className="hero-primary-btn">
              <span>ابدأ القراءة مجاناً</span>
              <ArrowLeft size={18} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-composition">
            <div className="tilted-card card-back">
              <div className="card-image-wrap">
                <img
                  src={img2}
                  alt="مجموعة كتب مختارة"
                  className="card-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="card-badge-tag tag-top">
                <span>روائع الأدب</span>
              </div>
            </div>

            <div className="tilted-card card-front">
              <div className="card-image-wrap">
                <img
                  src={img1}
                  alt="كتاب الأسبوع المميز"
                  className="card-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="card-floating-pill">
                <span>قراءة فورية بدون قيود</span>
              </div>
            </div>

            <Link to={"/popular"} className="floating-more-pill">
              <span>الأكثر رواجاً هذا الشهر</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
