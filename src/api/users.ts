import axios from "axios";

const api = axios.create({
  baseURL: "https://reqres.in/api",
});

interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export const getUsers = async (page: number = 1): Promise<IUser[]> => {
  try {
    const response = await api.get("/users", {
      params: { page, per_page: 8 },
    });
    localStorage.setItem("users", JSON.stringify(response.data.data));
    localStorage.setItem("total_pages", response.data.total_pages.toString());
    return response.data.data;
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    throw error;
  }
};
