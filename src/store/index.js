import { configureStore } from '@reduxjs/toolkit';

import postSlice from './postSlice';
import authSlice from './authSlice';
import notificationSlice from './notificationSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    post: postSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export const authActions = authSlice.actions;
export const postActions = postSlice.actions;
export const notificationActions = notificationSlice.actions;

export default store;
