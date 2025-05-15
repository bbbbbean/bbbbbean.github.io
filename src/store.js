import { configureStore, createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false },
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    },
    setIsAuth(state, action){
      state.isAuth = action.payload; 
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { userName: "" },
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload;
    }
  }
});

const store = configureStore({
  reducer: {
    auth: loginSlice.reducer,
    user: userSlice.reducer
  }
})

export const { login, logout, setIsAuth } = loginSlice.actions;
export const { setUserName } = userSlice.actions;

export default store;