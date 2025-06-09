import { createSlice, createAsyncThunk }from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = 'http://localhost:5000/api/tasks/floating-notes';

// Fetch all floating notes
export const fetchFloatingNotes = createAsyncThunk(
  'floatingNotes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notes');
    }
  }
);

//create a new floating note
export const addFloatingNote = createAsyncThunk(
  'floatingNotes/addNote',
  async ({ title }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { title });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add note');
    }
  }
);

//delete a floating note
export const deleteFloatingNote = createAsyncThunk(
  'floatingNotes/deleteNote',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete note');
    }
  }
);

const initialState = {
  notes: [],
  error: null,
};

//create the floating note slice
const floatingNoteSlice = createSlice({
  name: 'floatingNotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFloatingNotes.pending, (state) => {
       
        state.error = null;
      })
      .addCase(fetchFloatingNotes.fulfilled, (state, action) => {
      
        state.notes = action.payload;
      })
      .addCase(fetchFloatingNotes.rejected, (state, action) => {
      
        state.error = action.payload;
      })
      .addCase(addFloatingNote.pending, (state) => {
       
        state.error = null;
      })
      .addCase(addFloatingNote.fulfilled, (state, action) => {
       
        state.notes.push(action.payload);
      })
      .addCase(addFloatingNote.rejected, (state, action) => {
       
        state.error = action.payload;
      })
      .addCase(deleteFloatingNote.pending, (state) => {
        
        state.error = null;
      })
      .addCase(deleteFloatingNote.fulfilled, (state, action) => {
      
        state.notes = state.notes.filter(note => note._id !== action.payload);
      })
      .addCase(deleteFloatingNote.rejected, (state, action) => {
      
        state.error = action.payload;
      });
  },
});

export default floatingNoteSlice.reducer;
