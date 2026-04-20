import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getUserProfile } from "../api/user";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const profile = getUserProfile();

  const handleLogout = () => {
    logout();
    showToast("Вы вышли из аккаунта");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__container">
        
  
        <div className="header__left">
          <Link to="/posts" className="header__logo">
            TravelBlog
          </Link>

          <span className="header__divider">/</span>

          <Link to="/posts" className="header__link">
            Посты
          </Link>
        </div>

  
        <nav className="header__nav">
          {!user ? (
            <>
              <Link to="/login" className="header__link">
                Вход
              </Link>

              <Link
                to="/register"
                className="header__link header__link--accent"
              >
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <div className="header__user">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="header__avatar-img"
                  />
                ) : (
                  <div className="header__avatar">👤</div>
                )}

                <span className="header__email">
                  {user.email}
                </span>
              </div>

              <Link to="/create-post" className="header__link">
                Создать пост
              </Link>

              <Link to="/profile" className="header__link">
                Профиль
              </Link>

              <button
                onClick={handleLogout}
                className="header__button"
              >
                Выйти
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;