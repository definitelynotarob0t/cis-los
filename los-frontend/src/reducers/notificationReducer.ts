import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";

interface NotificationState {
  notification: string | null
}

const initialState: NotificationState = {
	notification: null,
};

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		showNotification(state, action: PayloadAction<string>) {
			state.notification = action.payload;
		},
		hideNotification(state) {
			state.notification = null;
		},
	},
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export const notifySuccess = (message: string) => {
	return async (dispatch: AppDispatch) => {
		dispatch(showNotification(message)); 
		setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);
	};
};

export default notificationSlice.reducer;