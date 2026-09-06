import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../constants/supabaseClient";
import "./auth.css";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("يُرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (password.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setError("البريد الإلكتروني مُسجل بالفعل، يُرجى تسجيل الدخول");
      } else if (error.message.includes("Password")) {
        setError("كلمة المرور ضعيفة، يُرجى استخدام كلمة مرور أقوى");
      } else {
        setError("حدث خطأ ما، يُرجى المحاولة مرة أخرى");
      }
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      setInfo(
        "تم إنشاء حسابك بنجاح. يُرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">إنشاء حساب جديد</h1>
        <p className="auth-subtitle">انضم إلى مكتبتك الخاصة وابدأ رحلتك</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              autoComplete="username"
            />
          </div>

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

          <div className="auth-field">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label>تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="auth-switch">
          تمتلك حسابًا بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
