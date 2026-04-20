

export const getLocalPosts = () => {
  return JSON.parse(localStorage.getItem("posts")) || [];
};

export const addLocalPost = (post) => {
  const posts = getLocalPosts();

  const newPost = {
    id: Date.now(),

    title: post.title || "Без названия",
    description: post.description || "",
    city: post.city || "Неизвестно",
    country: post.country || "—",
    image: post.image || null,

    isMine: true,
  };

  const updated = [newPost, ...posts];

  localStorage.setItem("posts", JSON.stringify(updated));

  return newPost;
};


export const getLocalPostById = (id) => {
  const posts = getLocalPosts();

  return posts.find(
    (post) => Number(post.id) === Number(id)
  );
};