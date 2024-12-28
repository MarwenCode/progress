import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch tasks
export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/daily");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch tasks"
      );
    }
  }
);

// Create a task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks/daily",
        task
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to create task"
      );
    }
  }
);

// Update task (checkbox toggle functionality)
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, progress }, thunkAPI) => {
    try {
      console.log("Dispatching updateTask with ID:", id); // Log task ID
      console.log("Progress value being updated:", progress); // Log progress value

      const response = await axios.put(
        `http://localhost:5000/api/tasks/daily/${id}`,
        { progress }
      );
      console.log("Response from server:", response.data); // Log server response

      return response.data;
    } catch (error) {
      console.error("Error in updateTask:", error); // Log error if any
      if (error.response) {
        console.error("Error response from server:", error.response.data); // Log error response from the server
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
      const response = await axios.delete(
        `http://localhost:5000/api/tasks/daily/${id}`
      );
      console.log("Task deleted:", response.data);
      return id; // Return the ID of the deleted task
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
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
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
        // Filter out the deleted task by ID
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        console.log(`Task with ID ${action.payload} removed from state.`);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload; // Capture error message
        console.error("Failed to delete task:", action.payload);
      });

      
  },
});

export default taskSlice.reducer;
