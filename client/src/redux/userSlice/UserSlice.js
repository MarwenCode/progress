import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL de l'API
const API_URL = "http://localhost:5000/api/tasks/user";

// Action pour s'inscrire
export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Action pour se connecter
export const loginUser = createAsyncThunk("user/login", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    // Sauvegarder les informations utilisateur (y compris l'image de profil)
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // Assurer la mise à jour de l'utilisateur dans localStorage
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Action pour récupérer le profil utilisateur
export const getUserProfile = createAsyncThunk("user/getProfile", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.get(`${API_URL}/profile`, config);
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur inconnue");
  }
});

// Action pour mettre à jour le profil
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.put(`${API_URL}/update`, userData, config);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur inconnue");
    }
  }
);

// Action pour supprimer le profil
export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_URL}/delete`, config);
      localStorage.removeItem("token");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur inconnue");
    }
  }
);

// Définition du slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      // Supprimer les données de l'utilisateur dans Redux
      state.user = null;
      state.token = null;

      // Supprimer les informations de l'utilisateur du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Inscription
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
        state.error = null;
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
      })

      // Récupération du profil
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mise à jour du profil
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
