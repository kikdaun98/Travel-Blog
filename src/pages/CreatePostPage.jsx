import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLocalPost } from "../utils/posts";
import { useToast } from "../context/ToastContext";
import "../styles/CreatePost.css";

const CreatePostPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    country: "",
    city: "",
    image: "",
  });

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.country ||
      !form.city ||
      !form.image
    ) {
      showToast("Заполните все поля");
      return;
    }

    if (form.title.length > 255) {
      showToast("Слишком длинный заголовок");
      return;
    }

    if (form.description.length > 2000) {
      showToast("Слишком длинное описание");
      return;
    }

    addLocalPost(form);
    showToast("Пост создан");

    navigate("/posts");
  };

  return (
    <div className="container">
      <div className="create-post">
        <h1>Создать пост</h1>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Заголовок"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Описание"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="country"
            placeholder="Страна"
            value={form.country}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="Город"
            value={form.city}
            onChange={handleChange}
          />

          <input type="file" accept="image/*" onChange={handleFile} />

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="create-post__preview"
            />
          )}

          <button type="submit">Создать</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;