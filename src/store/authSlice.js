import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: null,
  reducers: {
    login: (state, actions) => {
      return actions.payload;
    },
    updateUserLocation: (state, actions) => {
      return {
        ...state,
        division: actions.payload.division,
        district: actions.payload.district,
        area: actions.payload.area,
      };
    },
    logout: () => {
      return null;
    },
  },
});

export default authSlice;
