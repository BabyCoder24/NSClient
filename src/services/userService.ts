import { BASE_URL } from "../config/baseURL";
import axios from "axios";

// Get all users
const getAll = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/api/users`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Find users by query (with parameters as query params)
const findByQuery = async (parameters: Record<string, any>) => {
  const token = localStorage.getItem("accessToken");
  try {
    const params = new URLSearchParams();
    Object.entries(parameters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(
      `${BASE_URL}/api/users/query?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Get user by ID
const get = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log(error.status);
    throw error;
  }
};

// Create user
const create = async (data: any) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(`${BASE_URL}/api/users`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Update user
const update = async (id: number, data: any) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${BASE_URL}/api/users/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Delete user
const remove = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(`${BASE_URL}/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status);
    return true;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Admin reset password
const adminResetPassword = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/users/${id}/reset-password`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const fetchUsersAPI = getAll;
export const createUserAPI = create;

// UserService object
const UserService = {
  getAll,
  get,
  create,
  update,
  remove,
  findByQuery,
  adminResetPassword,
};

export default UserService;
