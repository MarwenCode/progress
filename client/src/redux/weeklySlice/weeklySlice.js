import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Fetch weekly Goal

export const getWeeklyGoal = createAsyncThunk(
    "weekly/getWeeklyGoal",
    async (_, { rejectWithValue }) => {
      try {
        console.log("Fetching weekly goals"); // Add this
        const response = await axios.get("http://localhost:5000/api/tasks/weekly");
        console.log("Response:", response.data); // Add this
        return response.data;
      } catch (error) {
        console.error("Error fetching goals:", error); // Add this
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
      const response = await axios.post(
        "http://localhost:5000/api/tasks/weekly",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to create task"
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
      .addCase(getWeeklyGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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
      });
  }
});


export default weeklySlice.reducer;