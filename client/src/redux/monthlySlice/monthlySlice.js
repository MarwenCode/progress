import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createWeeklyGoal } from "../weeklySlice/weeklySlice";

const API_URL = "http://localhost:5000/api/tasks/monthly";

// Fetch all monthly goals
export const fetchMonthlyGoals = createAsyncThunk(
  "monthly/fetchGoals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      console.log("Fetched Goals:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch goals");
    }
  }
);

// Create a new monthly goal
export const addMonthlyGoal = createAsyncThunk(
  "monthly/addGoal",
  async ({ month, goalName, goalDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        month,
        goalName,
        goalDetails,
        tasks: [], // Initialize tasks as an empty array
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add goal");
    }
  }
);

export const deleteMonthlyGoal = createAsyncThunk("monthly/deleteGoal", async (id, { rejectWithValue }) => {
  try {
    console.log("Deleting goal with ID:", id);
    await axios.delete(`http://localhost:5000/api/tasks/monthly/${id}`);
    console.log("Successfuly deleted goal with ID : ", id);
    return id;

  } catch (error) {
    console.log("Error deleting goal:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to delete task");

  }

}


)





// Add a task to a monthly goal
export const addTaskToGoal = createAsyncThunk(
  "monthly/addTask",
  async ({ goalId, task }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${goalId}/tasks`, {
        text: task.text,
      });
      console.log("API Response:", response.data); // 🛠️ Vérifier le format renvoyé
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add task");
    }
  }
);

// Update task completion status
export const updateTaskCompletion = createAsyncThunk(
  "monthly/updateTaskCompletion",
  async ({ goalId, taskId, completed }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${goalId}/tasks/${taskId}`,
        { completed },
        { headers: { "Content-Type": "application/json" } } // Ensure correct headers
      );

      console.log("Updated Goal Response:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Update Task Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to update task status");
    }
  }
);


// Initial state
const initialState = {
  goals: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Create the slice
const monthlySlice = createSlice({
  name: "monthly",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Goals
      .addCase(fetchMonthlyGoals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonthlyGoals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload;
      })
      .addCase(fetchMonthlyGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Goal
      .addCase(addMonthlyGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })

      // delete goal
      .addCase(deleteMonthlyGoal.fulfilled,( state, action) => {
        const deleteGoalId = action.payload;
        state.goals = state.goals.filter((goal) => goal._id !== deleteGoalId);
        console.log(` goalwith ID ${action.payload} removed`);
      })

      // Add Task
      // Add Task
      .addCase(addTaskToGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload; // The updated goal returned by the backend
        const goalIndex = state.goals.findIndex(
          (goal) => goal._id === updatedGoal._id
        );

        if (goalIndex !== -1) {
          // Replace the existing goal with the updated goal
          state.goals[goalIndex] = updatedGoal;
        }
      })
      .addCase(updateTaskCompletion.fulfilled, (state, action) => {
        const updatedGoal = action.payload;
        const goalIndex = state.goals.findIndex((goal) => goal._id === updatedGoal._id);
        if (goalIndex !== -1) {
          state.goals[goalIndex] = updatedGoal;
        }
      });
  },
});

export default monthlySlice.reducer;
