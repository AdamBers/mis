import axios from "axios";
import { items_per_page } from "../constants";
import { IUser } from "../types";

const api = axios.create({
  baseURL: "https://reqres.in/api/",
});

export const getUsers = async (page: number = 1) => {
  try {
    const response = await api.get("users", {
      params: { page, per_page: items_per_page },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserRemote = async (id: number) => {
  try {
    const response = await api.put(`users/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Ошибка при обновлении пользователя");
  }
};

export const deleteUsersRemote = async (id: number) => {
  try {
    const response = await api.delete(`users/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.responce?.data?.message || "Ошибка при удалении пользователя");
  }
};

export const addUserRemote = async (user: IUser) => {
  try {
    const response = await api.post(`users/register/`, user);
    return response;
  } catch (error: any) {
    throw new Error(error.responce?.data?.message || "Ошибка при добавлении пользователя");
  }
};
