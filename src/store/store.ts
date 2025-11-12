import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import crudMessageReducer from "./createMessageSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    crudMessage: crudMessageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
