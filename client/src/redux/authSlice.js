import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.isAdmin = false;
      state.currentUser = null;
    },
  },
});

export const { setAdmin, setCurrentUser, logout } =
  authSlice.actions;

export default authSlice.reducer;
