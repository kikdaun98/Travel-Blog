export const getUserProfile = () => {
  return JSON.parse(localStorage.getItem("profile")) || null;
};

export const saveUserProfile = (data) => {
  localStorage.setItem("profile", JSON.stringify(data));
};
export const updatePassword = (newPassword) => {
  
  console.log("Пароль обновлён:", newPassword);

  
  localStorage.setItem("password", newPassword);
};