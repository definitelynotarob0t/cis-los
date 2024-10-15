import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import loginService from "../services/loginService";
import programService from "../services/programService";
import pitchService from "../services/pitchService";
import losService from "../services/losService";
import tokenService from "../services/tokenService";
import { AppDispatch } from "../store";
import { setPrograms } from "./programReducer";
import { setPitches } from "./pitchReducer";
import { setLoses } from "./losReducer";
import { User } from "../types/types";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
	user: null,
};

const userSlice = createSlice({
	name: "user",
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

// Authenticates user, fetches user's data, stores user state and token
export const setUser = (credentials: { email: string, password: string }) => {
	return async (dispatch: AppDispatch) => {
		const user = await loginService.login(credentials); // Upon successful login, the backend will respond with user data, including JWT . 
		sessionStorage.setItem("loggedUser", JSON.stringify(user)); // Store the user data (including JWT) in sessionStorage for persistence across reloads
      

		// Fetch the data associated with user
		if (user.programIds && user.pitchIds && user.losIds) { 
			const programs = await programService.getPrograms();
			const pitches = await pitchService.getPitches();
			const loses = await losService.getLoses();

			dispatch(setPrograms(programs));
			dispatch(setPitches(pitches));
			dispatch(setLoses(loses));
		}

		tokenService.setToken(user.token); 
		dispatch(loginUser(user)); // Dispatch the loginUser action to update the Redux store with user's data

	};
}; 

// Used to maintain user data in redux store across page reloads by checking stored data
export const initialiseUser = () => {
	return (dispatch: AppDispatch) => {
		const loggedUserJSON = sessionStorage.getItem("loggedUser"); 
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			tokenService.setToken(user.token); 
			dispatch(loginUser(user));
		}
	};
};

export const logout = () => {
	return async (dispatch: AppDispatch) => {
		loginService.logout();
		dispatch(logoutUser());
	};
};

export default userSlice.reducer;
