import { useEffect, useMemo, useState } from "react";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";
import "../styles/PostsPage.css";
import { getLocalPosts } from "../utils/posts";

const DEMO_POSTS = [
  {
    id: 1,
    title: "Париж — город любви",
    description:
      "Прогулка по вечернему Парижу, Эйфелева башня и уютные кафе создают незабываемую атмосферу.",
    city: "Париж",
    country: "Франция",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    lat: 48.8566,
    lng: 2.3522,
    isMine: false,
  },
  {
    id: 2,
    title: "Сказочный Ротенбург",
    description:
      "Маленький немецкий город с фахверковыми домами и атмосферой средневековья.",
    city: "Ротенбург",
    country: "Германия",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
    lat: 49.378,
    lng: 10.179,
    isMine: false,
  },
  {
    id: 3,
    title: "Лондон и Биг-Бен",
    description:
      "Классический Лондон: Темза, мосты и знаменитая башня Биг-Бен.",
    city: "Лондон",
    country: "Великобритания",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    lat: 51.5074,
    lng: -0.1278,
    isMine: false,
  },
  {
    id: 4,
    title: "Рим — вечный город",
    description:
      "Колизей, узкие улочки и дух древней истории на каждом шагу.",
    city: "Рим",
    country: "Италия",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    lat: 41.9028,
    lng: 12.4964,
    isMine: false,
  },
  {
    id: 5,
    title: "Прага — сердце Европы",
    description:
      "Карлов мост, старый город и невероятная архитектура.",
    city: "Прага",
    country: "Чехия",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d",
    lat: 50.0755,
    lng: 14.4378,
    isMine: false,
  },
];

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("new");

  useEffect(() => {
    const local = getLocalPosts();
    setPosts([...local, ...DEMO_POSTS]);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) =>
        city
          ? p.city?.toLowerCase().includes(city.toLowerCase())
          : true
      )
      .sort((a, b) => {
        if (sort === "new") return Number(b.id) - Number(a.id);
        if (sort === "old") return Number(a.id) - Number(b.id);
        return 0;
      });
  }, [posts, search, city, sort]);

  return (
    <div className="container">
      <div className="posts-page">
       
        <section className="hero">
          <h1>Там, где мир начинается с путешествий</h1>
          <p>Делитесь историями и находите вдохновение</p>
        </section>

        
        <section className="toolbar">
          <input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            placeholder="Город..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">Сначала новые</option>
            <option value="old">Сначала старые</option>
          </select>
        </section>

        
        {loading && (
          <div className="posts-page__skeletons">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="empty">
            <p>Ничего не найдено 😢</p>
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="posts-page__grid">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onClick={() => setSelectedPost(post)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

       
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PostsPage;