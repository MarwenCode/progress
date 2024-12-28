// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice/taskSlice';
import weeklyReducer from './weeklySlice/weeklySlice'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    weekly: weeklyReducer
  },
});

export default store;
