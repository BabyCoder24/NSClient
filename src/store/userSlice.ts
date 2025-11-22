import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  adminResetPasswordAPI,
  resendVerificationAPI,
  resendPasswordResetAPI,
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
    const response = await deleteUserAPI(id);
    return { id, message: response };
  }
);

//admin reset password
export const adminResetPassword = createAsyncThunk(
  "users/adminResetPassword",
  async (userId: number) => {
    const response = await adminResetPasswordAPI(userId);
    return response;
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "users/resendVerification",
  async (userId: number) => {
    const response = await resendVerificationAPI(userId);
    return response;
  }
);

export const resendPasswordResetEmail = createAsyncThunk(
  "users/resendPasswordReset",
  async (userId: number) => {
    const response = await resendPasswordResetAPI(userId);
    return response;
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
          roleId: 2, // Default to Standard User
          clientId: undefined,
          isVerified: userResponse.isVerified,
          isActive: userResponse.isActive,
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
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })
      .addCase(adminResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(adminResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reset password";
      })
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to resend verification";
      })
      .addCase(resendPasswordResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendPasswordResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to resend password reset email";
      });
  },
});
export default userSlice.reducer;
