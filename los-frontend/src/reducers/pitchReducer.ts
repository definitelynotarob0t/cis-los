import { createSlice } from '@reduxjs/toolkit'
import pitchService from '../services/pitchService'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Pitch } from '../types'
import { AppDispatch } from '../store'

// Define a type for the slice state
interface PitchState {
    pitch: Pitch | null;
}
  
// Define the initial state using that type
const initialState: PitchState = {
    pitch: null,
} 

const pitchSlice = createSlice({
  name: "pitch",
  initialState,
  reducers : {
    setPitch(state, action: PayloadAction<Pitch>) {
        state.pitch = action.payload
      }
  }
})

export const {setPitch } = pitchSlice.actions

export const fetchPitch = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const pitch = await pitchService.getPitch(id);
      dispatch(setPitch(pitch));
    } catch (error) {
      console.error("Failed to fetch pitch", error);
    }
  };
};


export const editPitch = (pitch: Pitch) => {
    return async (dispatch: AppDispatch) => {
        const editedPitch: Pitch = await pitchService.updatePitch(pitch) 
        dispatch(setPitch(editedPitch))
    }
}

export default pitchSlice.reducer
