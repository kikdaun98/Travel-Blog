import { useEffect, useState } from "react";
import {
  getUserProfile,
  saveUserProfile,
  updatePassword,
} from "../api/user";
import { useToast } from "../context/ToastContext";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    city: "",
    about: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const data = getUserProfile();
    if (data) setProfile(data);
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!profile.name.trim()) {
      showToast("Введите ФИО");
      return;
    }

    if (profile.name.length > 255) {
      showToast("ФИО слишком длинное");
      return;
    }

    // пароль
    if (passwords.password || passwords.confirmPassword) {
      if (passwords.password.length < 6) {
        showToast("Пароль минимум 6 символов");
        return;
      }

      if (passwords.password !== passwords.confirmPassword) {
        showToast("Пароли не совпадают");
        return;
      }

      updatePassword(passwords.password);
      showToast("Пароль обновлён");
    }

    saveUserProfile(profile); 
    showToast("Профиль сохранён");
  };

  return (
    <div className="container">
      <div className="profile">
        <h1>Профиль</h1>

        
        <div className="profile__section">
          <label>ФИО</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            maxLength={255}
          />

          <label>Город</label>
          <input
            name="city"
            value={profile.city}
            onChange={handleChange}
          />

          <label>О себе</label>
          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            maxLength={2000}
          />

          <label>Фото профиля</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="avatar"
              className="profile__avatar"
            />
          )}
        </div>

        
        <div className="profile__section">
          <h2>Сменить пароль</h2>

          <input
            type="password"
            name="password"
            placeholder="Новый пароль"
            value={passwords.password}
            onChange={handlePasswordChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтвердите пароль"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <button onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default ProfilePage;