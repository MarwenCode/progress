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
      console.log("Creating weekly goal with data:", data); // Log the data being sent
      const response = await axios.post("http://localhost:5000/api/tasks/weekly", data);
      console.log("Response from server:", response.data); // Log the server's response
      return response.data;
    } catch (error) {
      console.error("Error in createWeeklyGoal:", error.response || error.message); // Log any errors
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);


export const updateWeeklyGoal = createAsyncThunk(
  "weekly/updateWeeklyGoal",
  async ({ id, selectedDays }, thunkAPI) => {
    try {
      console.log("Updating goal with ID:", id); // Debugging log
      const response = await axios.put(`http://localhost:5000/api/tasks/weekly/${id}`, {
        selectedDays,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating weekly goal:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



//delete a weekly Goal
export const deleteWeeklyGoal = createAsyncThunk(
  "weekly/deleteWeeklyGoal",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Deleting goal with ID:", id);
      await axios.delete(`http://localhost:5000/api/tasks/weekly/${id}`);
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
      })
      .addCase(updateWeeklyGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload;
        const index = state.weeklyGoal.findIndex(goal => goal._id === updatedGoal._id);
        if (index !== -1) {
          state.weeklyGoal[index] = updatedGoal; // Update the specific goal
        }
      })
      
      .addCase(deleteWeeklyGoal.fulfilled, (state, action) => {
        console.log("Reducer payload:", action.payload);
        state.weeklyGoal = state.weeklyGoal.filter(
          (goal) => goal._id !== action.payload
        );
        console.log("Updated state:", state.weeklyGoal);
      });
  }
});


export default weeklySlice.reducer;