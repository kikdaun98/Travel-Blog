import { useEffect, useMemo, useState } from "react";
import { getLikedPosts, toggleLike } from "../utils/likes";
import "../styles/PostCard.css";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
];

const PostCard = ({
  id,
  title,
  description,
  city,
  country,
  image,
  onClick,
  onDelete,
  isMine,
}) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const likedPosts = getLikedPosts();
    setLiked(likedPosts.includes(id));

   
    setCount(Math.floor(Math.random() * 50) + 1);
  }, [id]);

  const finalImage = useMemo(() => {
    if (image) return image;
    return FALLBACK_IMAGES[id % FALLBACK_IMAGES.length];
  }, [image, id]);

  const shortDescription = useMemo(() => {
    if (!description) return "";
    return description.length > 120
      ? description.slice(0, 120) + "..."
      : description;
  }, [description]);

  const handleLike = (e) => {
    e.stopPropagation();

    const updated = toggleLike(id);
    const isNowLiked = updated.includes(id);

    setLiked(isNowLiked);
    setCount((prev) => prev + (isNowLiked ? 1 : -1));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <article className="post-card" onClick={onClick}>
    
      <div className="post-card__image-wrapper">
        <img
          src={finalImage}
          alt={title}
          className="post-card__image"
          loading="lazy"
        />

        <div className="post-card__overlay" />

        <span className="post-card__badge">{country}</span>

        {isMine && (
          <button
            className="post-card__delete"
            onClick={handleDelete}
          >
            ✕
          </button>
        )}
      </div>

    
      <div className="post-card__content">
        <div className="post-card__main">
          <h2 className="post-card__title">{title}</h2>

          {shortDescription && (
            <p className="post-card__description">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="post-card__footer">
          <span className="post-card__location">
            📍 {city}
          </span>

          <div className="post-card__actions">
            <button
              className={`post-card__like ${
                liked ? "is-liked" : ""
              }`}
              onClick={handleLike}
            >
              {liked ? "❤️" : "🤍"}
            </button>

            <span className="post-card__count">{count}</span>

            <span className="post-card__read">
              Читать →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;