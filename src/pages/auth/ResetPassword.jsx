import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../constants/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import "./auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { clearRecovery, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("يُرجى ملء كلا الحقلين");
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
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("الرابط منتهي الصلاحية أو غير صالح، يُرجى طلب رابط جديد");
      return;
    }

    clearRecovery();
    navigate("/");
  }

  async function handleCancel() {
    clearRecovery();
    await signOut();
    navigate("/login");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">كلمة مرور جديدة</h1>
        <p className="auth-subtitle">اختر كلمة مرور جديدة لحسابك</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>كلمة المرور الجديدة</label>
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

          <button className="auth-submit" disabled={loading}>
            {loading ? "جاري حفظ كلمة المرور..." : "حفظ كلمة المرور"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "16px",
          }}
          onClick={handleCancel}
        >
          إلغاء والعودة إلى تسجيل الدخول
        </button>
      </div>
    </div>
  );
}
