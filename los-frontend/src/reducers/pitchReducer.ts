import { createSlice } from "@reduxjs/toolkit";
import pitchService from "../services/pitchService";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pitch } from "../types";
import { AppDispatch } from "../store";

// Define a type for the slice state
interface PitchState {
    pitches: Pitch[];
}
  
// Define the initial state using that type
const initialState: PitchState = {
	pitches: [],
}; 

const pitchSlice = createSlice({
	name: "pitches",
	initialState,
	reducers : {
		setPitches(state, action: PayloadAction<Pitch[]>) {
			state.pitches = action.payload;
		},
		updatePitch(state, action: PayloadAction<Pitch>) {
			const updatedPitch = action.payload;
			if (state.pitches) {
				const index = state.pitches.findIndex(pitch => pitch.id === updatedPitch.id);
				if (index !== -1) {
					state.pitches[index] = updatedPitch;
				}
			}
		},
	}
});

export const {setPitches, updatePitch } = pitchSlice.actions;

export const fetchPitch = (id: number) => {
	return async (dispatch: AppDispatch) => {
		try {
			const pitch = await pitchService.getPitch(id);
			dispatch(setPitches(pitch));
		} catch (error) {
			console.error("Failed to fetch pitch", error);
			throw error;
		}
	};
};


export const editPitch = (pitch: Pitch) => {
	return async (dispatch: AppDispatch) => {
		try {
			const editedPitch: Pitch = await pitchService.updatePitch(pitch);
			dispatch(updatePitch(editedPitch)); 
		} catch (error) {
			console.error("Failed to update pitch", error);
			throw error;
		}
	};
};


export default pitchSlice.reducer;
