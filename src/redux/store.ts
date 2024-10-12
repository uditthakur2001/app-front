// File: redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './progressSlice';
import downloadsReducer from './downloadSlice';

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    downloads: downloadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
