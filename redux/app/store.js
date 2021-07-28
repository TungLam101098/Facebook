import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import friendReducer from '../features/friendSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    friend: friendReducer
  },
});
