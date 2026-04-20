import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import { getLocalPostById } from "../utils/posts";
import { getUserProfile } from "../api/user";
import Comments from "../components/Comments";
import "../styles/PostDetailPage.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

 if (!post) {
  return <div className="container">Пост не найден</div>;
}

  return (
    <div className="container">
      <div className="post-detail">
        {/* IMAGE */}
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