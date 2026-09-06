import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../constants/supabaseClient";
import { User, Mail, LogOut, ShieldCheck, Edit2, Check, X } from "lucide-react";
import "./profile.css";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const defaultUsername =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "مستخدم";

  const [username, setUsername] = useState(defaultUsername);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const email = user?.email;
  const isEmailConfirmed = !!user?.email_confirmed_at;

  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || newUsername === username) {
      setIsEditing(false);
      return;
    }

    setUpdateLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { username: newUsername.trim() },
    });

    setUpdateLoading(false);

    if (error) {
      alert("حدث خطأ أثناء تحديث الاسم: " + error.message);
    } else {
      setUsername(newUsername.trim());
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-page-wrapper">
      <div className="auth-card profile-card">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        <h1 className="auth-title">{username}</h1>
        <p className="auth-subtitle">مرحباً بك في ملفك الشخصي</p>

        <div className="profile-info-group">
          <div className="profile-item profile-item-username">
            <div className="profile-item-main">
              <User size={20} className="profile-item-icon" />
              <div className="profile-item-details">
                <span className="profile-item-label">اسم المستخدم</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-edit-input"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="profile-item-value">{username}</span>
                )}
              </div>
            </div>

            <div className="profile-edit-actions">
              {isEditing ? (
                <>
                  <button
                    className="icon-btn save-btn"
                    onClick={handleUpdateUsername}
                    disabled={updateLoading}
                    title="حفظ"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    className="icon-btn cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername(username);
                    }}
                    title="إلغاء"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  className="icon-btn edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="تعديل اسم المستخدم"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          <hr style={{ borderColor: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

          <div className="profile-item">
            <Mail size={20} className="profile-item-icon" />
            <div className="profile-item-details">
              <span className="profile-item-label">البريد الإلكتروني</span>
              <span className="profile-item-value email-value">{email}</span>
            </div>
          </div>

          <hr style={{ borderColor: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

          <div className="profile-item">
            <ShieldCheck size={20} className="profile-item-icon" />
            <div className="profile-item-details">
              <span className="profile-item-label">حالة الحساب</span>
              <span
                className="profile-item-value"
                style={{ color: isEmailConfirmed ? "#16a34a" : "#ea580c" }}
              >
                {isEmailConfirmed ? "بريد إلكتروني مؤكّد" : "غير مؤكد"}
              </span>
            </div>
          </div>
        </div>

        <button
          className="profile-signout-btn"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut size={18} />
          <span>{loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}</span>
        </button>
      </div>
    </div>
  );
}
