// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice/taskSlice';
import weeklyReducer from './weeklySlice/weeklySlice';
import monthlyReducer from "./monthlySlice/monthlySlice";
import floatingNoteReducer from "./floatingNoteSlice/floatingNoteSlice";
import userReducer from "./userSlice/UserSlice";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    weekly: weeklyReducer,
    monthly: monthlyReducer,
    user : userReducer,
    floatingNotes: floatingNoteReducer,
  },
});

export default store;
