import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../constants/supabaseClient";
import {
  User,
  Mail,
  LogOut,
  ShieldCheck,
  ShieldQuestion,
  Edit2,
  Check,
  X,
} from "lucide-react";
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
      <div className="member-card">
        <div className="member-panel-photo">
          <div className="member-serial">
           عضو في مكتبة منارة
          </div>

          <div
            className={`avatar-seal ${isEmailConfirmed ? "seal-verified" : "seal-pending"}`}
          >
            <span className="avatar-seal-ring" />
            <span className="avatar-letter">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="member-name-block">
            {isEditing ? (
              <div className="username-edit-row">
                <input
                  type="text"
                  className="profile-edit-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoFocus
                />
                <div className="profile-edit-actions">
                  <button
                    className="icon-btn save-btn"
                    onClick={handleUpdateUsername}
                    disabled={updateLoading}
                    title="حفظ"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="icon-btn cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername(username);
                    }}
                    title="إلغاء"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="member-name">
                {username}
                <button
                  className="icon-btn edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="تعديل اسم المستخدم"
                >
                  <Edit2 size={14} />
                </button>
              </h1>
            )}
            <p className="member-role">صاحب الحساب</p>
          </div>
        </div>


      

        <div className="member-panel-details">
          <div className="detail-row">
            <User size={18} className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">اسم المستخدم</span>
              <span className="detail-value">{username}</span>
            </div>
          </div>

          <div className="detail-row">
            <Mail size={18} className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">البريد الإلكتروني</span>
              <span className="detail-value email-value">{email}</span>
            </div>
          </div>

          <div className="detail-row status-row">
            <div
              className={`status-stamp ${isEmailConfirmed ? "stamp-verified" : "stamp-pending"}`}
            >
              {isEmailConfirmed ? (
                <ShieldCheck size={20} />
              ) : (
                <ShieldQuestion size={20} />
              )}
              <span>{isEmailConfirmed ? "بريد موثّق" : "بانتظار التوثيق"}</span>
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
    </div>
  );
}
