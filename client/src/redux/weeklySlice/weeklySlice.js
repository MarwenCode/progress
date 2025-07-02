import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get auth config
const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: user?.token ? `Bearer ${user.token}` : ''
    }
  };
};

// Replace all hardcoded API URLs with the environment variable
const API_URL = `${import.meta.env.VITE_API_URL}/tasks/weekly`;

//Fetch weekly Goal
export const getWeeklyGoal = createAsyncThunk(
  "weekly/getWeeklyGoal",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching weekly goals");
      const config = getAuthConfig();
      const response = await axios.get(
        API_URL,
        config
      );
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

//create a weekly Goal
export const createWeeklyGoal = createAsyncThunk(
  "weekly/createWeeklyGoal",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Creating weekly goal with data:", data);
      const config = getAuthConfig();
      const response = await axios.post(
        API_URL,
        data,
        config
      );
      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in createWeeklyGoal:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// AsyncThunk for Updating Weekly Goal
// export const updateWeeklyGoal = createAsyncThunk(
//   "weekly/updateWeeklyGoal",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/tasks/weekly/${id}`, data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


export const updateWeeklyGoal = createAsyncThunk(
  "weekly/updateWeeklyGoal",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(
        `${API_URL}/${id}`, 
        updates,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur de mise à jour.");
    }
  }
);


//update notes
export const updateNotes = createAsyncThunk(
  "weekly/updateNotes",
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      console.log("Updating notes with ID:", id);
      console.log("Notes data:", notes);
      const config = getAuthConfig();
      const response = await axios.put(
        `${API_URL}/notes/${id}`,
        { notes },
        config
      );
      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating notes:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//delete a weekly Goal
export const deleteWeeklyGoal = createAsyncThunk(
  "weekly/deleteWeeklyGoal",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Deleting goal with ID:", id);
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/${id}`, config);
      console.log("Successfully deleted goal with ID:", id);
      return id;
    } catch (error) {
      console.error("Error deleting goal:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

// Goal Slice
const weeklySlice = createSlice({
  name: "weekly",
  initialState: {
    weeklyGoal: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Weekly Goal
      .addCase(getWeeklyGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyGoal = action.payload;
        state.error = null;
      })
      .addCase(getWeeklyGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Weekly Goal
      .addCase(createWeeklyGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWeeklyGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyGoal.push(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createWeeklyGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Weekly Goal
      .addCase(updateWeeklyGoal.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        state.weeklyGoal = state.weeklyGoal.map(goal =>
          goal._id === _id ? { ...goal, ...updates } : goal
        );
        console.log("État Redux mis à jour :", state.weeklyGoal);
      })
      // Delete Weekly Goal
      .addCase(deleteWeeklyGoal.fulfilled, (state, action) => {
        state.loading = false;
        const deletedGoalId = action.payload;
        state.weeklyGoal = state.weeklyGoal.filter(goal => goal._id !== deletedGoalId);
      })
      // Handle pending state for updateNotes
      .addCase(updateNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for updateNotes
      .addCase(updateNotes.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGoal = action.payload;
        const goalIndex = state.weeklyGoal.findIndex(
          (goal) => goal._id === updatedGoal._id
        );
        if (goalIndex !== -1) {
          state.weeklyGoal[goalIndex].notes = updatedGoal.notes;
        }
      })
      // Handle rejected state for updateNotes
      .addCase(updateNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update notes";
      });
  },
});

export default weeklySlice.reducer;
