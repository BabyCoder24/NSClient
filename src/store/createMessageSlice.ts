import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type CrudType = "create" | "update" | "delete" | "error" | null;

interface CrudMessageState {
  open: boolean;
  text: string;
  type: CrudType;
}

const initialState: CrudMessageState = {
  open: false,
  text: "",
  type: null,
};

const crudMessageSlice = createSlice({
  name: "crudMessage",
  initialState,
  reducers: {
    showCrudMessage: (
      state,
      action: PayloadAction<{ text: string; type: CrudType }>
    ) => {
      state.open = true;
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
    closeCrudMessage: (state) => {
      state.open = false;
    },
  },
});

export const { showCrudMessage, closeCrudMessage } = crudMessageSlice.actions;
export default crudMessageSlice.reducer;
