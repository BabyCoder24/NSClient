import { BASE_URL } from "../config/baseURL";
import axios from "axios";
import type { User } from "../types/user";

//fetch users
export const fetchUsersAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

//add user
export const createUserAPI = async (userData: User) => {
  try {
    const response = await axios.post(`${BASE_URL}/user`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
