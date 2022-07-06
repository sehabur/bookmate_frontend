import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    loadNotifications: (state, { payload }) => {
      return payload;
    },
    deactivateNotification: (state, { payload }) => {
      for (let item of state) {
        if (item._id === payload) {
          item.isActive = false;
          break;
        }
      }
    },
  },
});

export default notificationSlice;
