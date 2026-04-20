import { useEffect, useRef, useState, useMemo } from "react";
import Comments from "./Comments";
import Map from "./Map";
import "../styles/PostModal.css";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
];

const PostModal = ({ post, onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);

  const finalImage = useMemo(() => {
    if (!post) return "";
    return post.image || FALLBACK_IMAGES[post.id % FALLBACK_IMAGES.length];
  }, [post]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };


  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll(
      "button, input, textarea"
    );

    if (!focusable?.length) return;

    focusable[0].focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  if (!post) return null;

  return (
    <div
      className={`modal-overlay ${closing ? "is-closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal ${closing ? "is-closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {!loaded && <div className="modal__skeleton" />}

        <img
          src={finalImage}
          alt={post.title}
          className={`modal__image ${loaded ? "is-loaded" : ""}`}
          onLoad={() => setLoaded(true)}
        />

        <div className="modal__content">
          <h2 className="modal__title">{post.title}</h2>

          <p className="modal__description">
            {post.description}
          </p>

          <div className="modal__location">
            📍 {post.city}, {post.country}
          </div>

          <Map
            lat={post.lat}
            lng={post.lng}
            title={post.title}
          />

          <Comments postId={post.id} />

          <button
            className="modal__button"
            onClick={handleClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;