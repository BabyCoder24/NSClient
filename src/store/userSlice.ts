import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersAPI, createUserAPI } from "../services/userService";
import type { User } from "../types/user";

//fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetchUsersAPI();
  return response;
});

//add user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: any) => {
    const response = await createUserAPI(userData);
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
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      });
  },
});
export default userSlice.reducer;
