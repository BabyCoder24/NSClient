import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  adminResetPasswordAPI,
} from "../services/userService";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../types/user";

//fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetchUsersAPI();
  return response;
});

//add user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: CreateUserRequest) => {
    const response = await createUserAPI(userData);
    return response;
  }
);

//update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: UpdateUserRequest) => {
    const response = await updateUserAPI(userData);
    return response;
  }
);

//delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await deleteUserAPI(id);
    return id;
  }
);

//admin reset password
export const adminResetPassword = createAsyncThunk(
  "users/adminResetPassword",
  async (userId: number) => {
    await adminResetPasswordAPI(userId);
    return userId;
  }
);

//user slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [] as User[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        const userResponse: UserResponse = action.payload;
        const user: User = {
          id: userResponse.id,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          companyName: userResponse.companyName,
          username: "", // Not provided in response
          email: userResponse.email,
          roleId: 1, // Default, not provided
          clientId: undefined,
          isVerified: userResponse.isVerified,
          createdAt: userResponse.createdAt,
          updatedAt: undefined,
          roleName: undefined,
        };
        state.users.push(user);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});
export default userSlice.reducer;
