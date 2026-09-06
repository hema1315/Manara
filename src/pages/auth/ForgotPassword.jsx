import { useState } from "react";
import { Link } from "react-router";
import { supabase } from "../../constants/supabaseClient";
import "./auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("يُرجى كتابة بريدك الإلكتروني");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      setError("حدثت مشكلة، يُرجى المحاولة مرة أخرى بعد قليل");
      return;
    }

    setInfo(
      "إذا كان هذا البريد الإلكتروني مسجلاً لدينا، سيصلك رابط لإعادة تعيين كلمة المرور",
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">نسيت كلمة المرور؟</h1>
        <p className="auth-subtitle">
          اكتب بريدك الإلكتروني وسنرسل إليك رابطًا لإنشاء كلمة مرور جديدة
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال الرابط"}
          </button>
        </form>

        <p className="auth-switch">
          تتذكر كلمة المرور؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
