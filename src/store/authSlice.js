import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: null,
  reducers: {
    login: (state, actions) => {
      return actions.payload;
    },
    logout: () => {
      return null;
    },
  },
});

export default authSlice;
