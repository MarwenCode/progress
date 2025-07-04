// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice/taskSlice';
import weeklyReducer from './weeklySlice/weeklySlice';
import monthlyReducer from "./monthlySlice/monthlySlice";
import floatingNoteReducer from "./floatingNoteSlice/floatingNoteSlice";
import authReducer from "./authSlice/authSlice";
import userReducer from "./userSlice/userSlice";

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
