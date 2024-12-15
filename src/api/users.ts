import axios from "axios";
import { items_per_page } from "../constants";

interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const api = axios.create({
  baseURL: "https://reqres.in/api",
});

export const getUsers = async (page: number = 1): Promise<IUser[]> => {
  try {
    const response = await api.get("/users", {
      params: { page, per_page: items_per_page },
    });
    localStorage.setItem("users", JSON.stringify(response.data.data));
    localStorage.setItem("total_pages", response.data.total_pages.toString());
    return response.data.data;
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    throw error;
  }
};
