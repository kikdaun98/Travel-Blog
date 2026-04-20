import { useEffect, useState } from "react";
import { fetchComments } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/Comments.css";

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    text: "",
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU");
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId);

      
        const formatted = data.slice(0, 5).map((c, index) => ({
          id: `api-${c.id}-${index}`,
          name: c.name,
          text: c.body,
          date: new Date().toISOString(),
        }));

    
        const local =
          JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];

      
        const unique = [...local, ...formatted].filter(
          (item, index, self) =>
            index === self.findIndex((c) => c.id === item.id)
        );

        setComments(unique);
      } catch {
        showToast("Ошибка загрузки комментариев");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const saveToStorage = (data) => {
    localStorage.setItem(`comments-${postId}`, JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.text.trim()) {
      showToast("Заполните все поля");
      return;
    }

    if (form.name.length > 255) {
      showToast("Имя слишком длинное");
      return;
    }

    if (form.text.length > 600) {
      showToast("Комментарий слишком длинный");
      return;
    }

    const newComment = {
      id: `local-${Date.now()}`, 
      name: form.name,
      text: form.text,
      date: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];

    setComments(updated);
    saveToStorage(updated);

    setForm({ name: "", text: "" });
    setShowForm(false);
  };

  return (
    <div className="comments">
      <h2>Отзывы</h2>

      {user && (
        <button onClick={() => setShowForm(!showForm)}>
          Ваше впечатление об этом месте
        </button>
      )}

      {showForm && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            placeholder="Ваше имя"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            placeholder="Напишите комментарий..."
            value={form.text}
            onChange={(e) =>
              setForm({ ...form, text: e.target.value })
            }
          />

          <button type="submit">Отправить</button>
        </form>
      )}

      {loading && <p className="comments__loading">Загрузка...</p>}

      {!loading && comments.length === 0 && (
        <p className="comments__empty">Пока нет отзывов</p>
      )}

      {!loading &&
        comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment__avatar">
              {c.name?.[0]?.toUpperCase() || "?"}
            </div>

            <div className="comment__body">
              <div className="comment__header">
                <span className="comment__name">{c.name}</span>
                <span className="comment__date">
                  {formatDate(c.date)}
                </span>
              </div>

              <div className="comment__text">{c.text}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comments;