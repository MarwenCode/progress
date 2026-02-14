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

// Rehydrate user from localStorage on app start
export const rehydrateUser = () => (dispatch) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch(login(user));
  }
};

// Register user
// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (userData, thunkAPI) => {
//     try {
//       const response = await axios.post(`${API_URL}/user/register`, userData);
//       if (response.data) {
//         localStorage.setItem("user", JSON.stringify(response.data));
//         thunkAPI.dispatch(login(response.data));
//       }
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || "Unknown error";
//       return thunkAPI.rejectWithValue({ message });
//     }
//   }
// );

// Login user
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (userData, thunkAPI) => {
//     try {
//       const response = await axios.post(`${API_URL}/user/login`, userData);
//       if (response.data) {
//         localStorage.setItem("user", JSON.stringify(response.data));
//         thunkAPI.dispatch(login(response.data));
//       }
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || "Unknown error";
//       return thunkAPI.rejectWithValue({ message });
//     }
//   }
// );

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user =
        state.user.user ||
        state.auth?.user ||
        JSON.parse(localStorage.getItem("user") || "null");
      if (!user || !user.token) {
        throw new Error("No user or token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      let response;
      try {
        response = await axios.put(`${API_URL}/user/update`, userData, config);
      } catch (error) {
        let message = error.message || "Unknown error";
        return thunkAPI.rejectWithValue({ message });
      }

      if (response && response.data && typeof response.data.user !== "undefined") {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue({ message: response?.data?.message || "No user in response" });
      }
    } catch (error) {
      let message = error.message || "Unknown error";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Get user profile
// export const getUserProfile = createAsyncThunk(
//   "user/getProfile",
//   async (_, thunkAPI) => {
//     try {
//       const user = thunkAPI.getState().user.user;
//       if (!user || !user.token) {
//         throw new Error("No user or token found");
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`
//         }
//       };

//       const response = await axios.get(`${API_URL}/user/profile`, config);
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || "Unknown error";
//       return thunkAPI.rejectWithValue({ message });
//     }
//   }
// );

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user =
        state.user.user ||
        state.auth?.user ||
        JSON.parse(localStorage.getItem("user") || "null");
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
      const message = error.response?.data?.message || error.message || "Unknown error";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);



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
    
   
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload && action.payload.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
        state.isError = false;
        state.message = action.payload?.message || "";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Unknown error";
      })
      // Get Profile
      // .addCase(getUserProfile.pending, (state) => {
      //   state.isLoading = true;
      //   state.isError = false;
      // })
      // .addCase(getUserProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.user = { ...state.user, ...action.payload.user };
      //   state.isError = false;
      //   state.message = "";
      // })
      // .addCase(getUserProfile.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload.message;
      // })
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
        state.message = action.payload.message;
      })
      
  },
});

export const { reset, login } = userSlice.actions;
export default userSlice.reducer;
