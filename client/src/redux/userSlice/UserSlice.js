import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL de l'API
const API_URL = `${import.meta.env.VITE_API_URL}`;

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};

// Register user
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, userData);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const user = thunkAPI.getState().user.user;
      if (!user || !user.token) {
        throw new Error("No user or token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      const response = await axios.put(`${API_URL}/user/update`, userData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().user.user;
      if (!user || !user.token) {
        throw new Error("No user or token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const response = await axios.get(`${API_URL}/user/profile`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().user.user;
      if (!user || !user.token) {
        throw new Error("No user or token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      await axios.delete(`${API_URL}/user/delete`, config);
      localStorage.removeItem("user");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("user");
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    login: (state, action) => {
      state.user = action.payload;
      state.isSuccess = true;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
        state.message = "";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isSuccess = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isSuccess = false;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, ...action.payload.user };
        state.isError = false;
        state.message = "";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, ...action.payload.user };
        state.isError = false;
        state.message = "";
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      });
  },
});

export const { reset, login } = userSlice.actions;
export default userSlice.reducer;
