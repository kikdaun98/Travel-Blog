import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import { getLocalPostById } from "../utils/posts";
import { getUserProfile } from "../api/user";
import { getLikedPosts, toggleLike } from "../utils/likes";
import Comments from "../components/Comments";
import "../styles/PostDetailPage.css";

const PostDetailPage = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const author = getUserProfile();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const localPost = getLocalPostById(Number(id));

        if (localPost) {
          setPost(localPost);
          return;
        }

        const data = await fetchPostById(id);

        setPost({
          id: data.id,
          title: data.title?.slice(0, 255),
          description: data.body?.slice(0, 2000),
          city: "Неизвестно",
          country: "—",
          image: null,
        });
      } catch (error) {
        console.error("Ошибка загрузки поста:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    if (!post) return;

    const likedPosts = getLikedPosts();
    setLiked(likedPosts.includes(post.id));
  }, [post]);

  const handleLike = () => {
    const updated = toggleLike(post.id);
    setLiked(updated.includes(post.id));
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  if (!post) {
    return <div className="container">Пост не найден</div>;
  }

  return (
    <div className="container">
      <div className="post-detail">
        
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="post-detail__image"
          />
        ) : (
          <div className="post-detail__image placeholder" />
        )}

        
        <div className="post-author">
          {author?.avatar ? (
            <img src={author.avatar} alt="avatar" />
          ) : (
            <div className="post-author__placeholder">👤</div>
          )}

          <div>
            <strong>{author?.name || "Автор"}</strong>
            <p className="post-author__city">
              {author?.city || "Город не указан"}
            </p>
          </div>
        </div>

        
        <h1>{post.title}</h1>

        
        <div className="post-detail__actions">
          <button
            onClick={handleLike}
            style={{
              margin: "10px 0",
              padding: "10px 14px",
              borderRadius: "20px",
              border: "1px solid #555",
              background: "transparent",
              color: liked ? "#a855f7" : "#fff",
              cursor: "pointer"
            }}
          >
            {liked ? "❤️ Нравится" : "🤍 Нравится"}
          </button>
        </div>

       
        <p className="post-detail__location">
          📍 {post.city}, {post.country}
        </p>

       
        <p className="post-detail__description">
          {post.description}
        </p>

        
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetailPage;