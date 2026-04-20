import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";


export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


export const fetchPostById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
export const fetchComments = async (postId) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  return response.data;
};
export const createPost = async (post) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    post
  );
  return response.data;
};