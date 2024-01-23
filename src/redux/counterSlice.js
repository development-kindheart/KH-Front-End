import { createSlice, current } from "@reduxjs/toolkit";
import { json, useNavigate } from "react-router-dom";
import colors, { layoutColors } from "../config/colors";

const initialState = {
  token: localStorage.getItem(process.env.REACT_APP_TOKEN_KEY) || null,
  role: localStorage.getItem(process.env.REACT_APP_USER_TYPE) || null,
  active: localStorage.getItem(process.env.REACT_APP_USER_ACTIVE) || null,
  userId: localStorage.getItem(process.env.REACT_APP_USER_ID) || null,
  isLoggedIn: !!localStorage.getItem(process.env.REACT_APP_TOKEN_KEY),
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      console.log(payload, "test");
      localStorage.setItem(process.env.REACT_APP_TOKEN_KEY, payload?.token);
      localStorage.setItem(process.env.REACT_APP_USER_ID, payload?.userId);
      localStorage.setItem(process.env.REACT_APP_USER_TYPE, payload?.role);
      localStorage.setItem(process.env.REACT_APP_USER_ACTIVE, payload?.active);
      state.token = payload?.token;
      state.isLoggedIn = true;
      state.user = payload?.user;
      state.userId = payload?.userId;
      state.role = payload?.role;
      state.active = payload?.active;
    },
    logout: (state) => {
      state.token = null;
      state.userType = null;
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
      localStorage.removeItem(process.env.REACT_APP_USER_TYPE);
      localStorage.removeItem(process.env.REACT_APP_USER_ID);
      localStorage.removeItem(process.env.REACT_APP_USER_TYPE);
      localStorage.removeItem(process.env.REACT_APP_USER_ACTIVE);
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = counterSlice.actions;

export default counterSlice.reducer;
