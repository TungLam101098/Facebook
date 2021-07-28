import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friendId: null,
};


export const friendSlice = createSlice({
  name: 'friend',
  initialState,
   reducers: {
    infoFriendId: (state, action) => {
      state.friendId = action.payload.friendId;
    },
  },
});

export const { infoFriendId } = friendSlice.actions;

export const selectFriendId = (state) => state.friend.friendId;

export default friendSlice.reducer;
