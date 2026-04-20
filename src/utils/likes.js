export const getLikedPosts = () => {
  return JSON.parse(localStorage.getItem("likedPosts")) || [];
};

export const toggleLike = (id) => {
  const liked = getLikedPosts();

  let updated;

  if (liked.includes(id)) {
    updated = liked.filter((item) => item !== id);
  } else {
    updated = [...liked, id];
  }

  localStorage.setItem("likedPosts", JSON.stringify(updated));
  return updated;
};