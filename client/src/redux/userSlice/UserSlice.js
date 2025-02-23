import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL de l'API
const API_URL = "http://localhost:5000/api/tasks/user";

// 🔹 Action pour s'inscrire
export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// 🔹 Action pour se connecter
export const loginUser = createAsyncThunk("user/login", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// 🔹 Définition du slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Inscription
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Connexion
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
