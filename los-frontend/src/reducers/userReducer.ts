import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import loginService from '../services/loginService';
import programService from '../services/programService';
import losService from '../services/losService';
import pitchService from '../services/pitchService';
import { AppDispatch } from '../store';
import { setPrograms } from './programReducer';
import { User } from '../types';

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = null;
    },
    updateUserProgramIds(state, action: PayloadAction<number[]>) {
      if (state.user) {
        state.user.programIds = action.payload;
      }
    },
  },
});

export const { loginUser, logoutUser, updateUserProgramIds } = userSlice.actions;

export const setUser = (credentials: { email: string, password: string }) => {
    return async (dispatch: AppDispatch) => {
      const user = await loginService.login(credentials); // Upon successful login, the backend will respond with user data, including JWT . 
      sessionStorage.setItem('loggedUser', JSON.stringify(user)); // Store the user data (including JWT) in sessionStorage for persistence across reloads
      

      // Fetch the associated program(s)
      if (user.programIds) { 
        const programs = await programService.getPrograms();
        dispatch(setPrograms(programs));
      }

      programService.setToken(user.token); // Set the user's token for future authenticated requests
      losService.setToken(user.token); 
      pitchService.setToken(user.token)
      dispatch(loginUser(user)); // Dispatch the loginUser action to update the Redux store with user's data

    };
  }; 

// Used to maintain user data in redux store across page reloads
export const initialiseUser = () => {
  return (dispatch: AppDispatch) => {
    const loggedUserJSON = sessionStorage.getItem('loggedUser'); 
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      programService.setToken(user.token);
      losService.setToken(user.token); 
      pitchService.setToken(user.token)
      dispatch(loginUser(user));
    }
  };
};

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    sessionStorage.clear();
    loginService.logout();
    dispatch(logoutUser());
  };
};

export default userSlice.reducer;
