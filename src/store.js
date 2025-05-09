import { configureStore, createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'auth',
  initialState: {isAuth: false},
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    }
  }
});

export default configureStore({
  reducer: {
    auth: loginSlice.reducer
  }
})

export const { login, logout } = loginSlice.actions;
