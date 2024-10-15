import { configureStore } from "@reduxjs/toolkit";
import pitchReducer from "./reducers/pitchReducer";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import losReducer from "./reducers/losReducer";
import errorReducer from "./reducers/errorReducer";
import programReducer from "./reducers/programReducer";


const store = configureStore({
	reducer: {
		user: userReducer,
		notification: notificationReducer, //for success notifications
		error: errorReducer, // for error notifications
		pitches: pitchReducer,
		loses: losReducer,
		programs: programReducer
	}
});
  

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;