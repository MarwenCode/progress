// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice/taskSlice.js';
import weeklyReducer from './weeklySlice/weeklySlice.js';
import monthlyReducer from "./monthlySlice/monthlySlice.js";
import floatingNoteReducer from "./floatingNoteSlice/floatingNoteSlice.js";
import authReducer from "./authSlice/authSlice.js";
import userReducer from "./userSlice/userSlice.js";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    weekly: weeklyReducer,
    monthly: monthlyReducer,
    floatingNotes: floatingNoteReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
