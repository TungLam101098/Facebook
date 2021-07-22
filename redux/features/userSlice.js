import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  surname: null,
  name: null,
  email: null,
  birthday: null,
  gender: null,
  password: null,
  verification: null,
  AvatarImage: null
};


export const userSlice = createSlice({
  name: 'user',
  initialState,
   reducers: {
    infoUser: (state, action) => {
      state.surname = action.payload.surname;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.birthday = action.payload.birthday;
      state.gender = action.payload.gender;
      state.password = action.payload.password;
      state.verification = action.payload.verification;
      state.AvatarImage = action.payload.AvatarImage;
    },
  },
});

export const { infoUser } = userSlice.actions;

export const selectInfo = (state) => state.user;

export default userSlice.reducer;
