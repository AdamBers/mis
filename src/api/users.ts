// users.ts
import axios from "axios";
import { items_per_page } from "../constants";

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  gender?: string;
  role?: string;
  dob?: Date | string;
  university?: string;
  workplace?: string;
  jobDescription?: string;
}

export interface GetUsersResponse {
  data: IUser[];
  total_pages: number;
}

const api = axios.create({
  baseURL: "https://reqres.in/api",
});

export const getUsers = async (page: number = 1): Promise<GetUsersResponse> => {
  try {
    const response = await api.get("/users", {
      params: { page, per_page: items_per_page },
    });
    return response.data; // Возвращаем весь объект с data и total_pages
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    throw error;
  }
};
