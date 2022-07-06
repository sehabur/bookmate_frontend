import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post',
  initialState: null,
  reducers: {
    loadPosts: (state, actions) => {
      return actions.payload;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
  },
});

export default postSlice;
