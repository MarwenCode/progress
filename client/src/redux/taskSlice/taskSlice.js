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

// Fetch tasks
export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (_, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get("http://localhost:5000/api/tasks/daily", config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Create a task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(
        "http://localhost:5000/api/tasks/daily",
        task,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// Update task (checkbox toggle functionality)
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, progress }, thunkAPI) => {
    try {
      console.log("Dispatching updateTask with ID:", id);
      console.log("Progress value being updated:", progress);

      const config = getAuthConfig();
      const response = await axios.put(
        `http://localhost:5000/api/tasks/daily/${id}`,
        { progress },
        config
      );
      console.log("Response from server:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error in updateTask:", error);
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      }
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

//delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      console.log("Deleting task with ID:", id);
      const config = getAuthConfig();
      const response = await axios.delete(
        `http://localhost:5000/api/tasks/daily/${id}`,
        config
      );
      console.log("Task deleted:", response.data);
      return id;
    } catch (error) {
      console.error("Error deleting task:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        console.log(`Task with ID ${action.payload} removed from state.`);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
        console.error("Failed to delete task:", action.payload);
      });
  },
});

export default taskSlice.reducer;
