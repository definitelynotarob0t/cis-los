import { createSlice } from '@reduxjs/toolkit'
import losService from '../services/losService'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Los } from '../types'
import { AppDispatch } from '../store'

// Define a type for the slice state
interface LosState {
    los: Los | null;
}
  
// Define the initial state using that type
const initialState: LosState = {
    los: null,
} 

const losSlice = createSlice({
  name: "los",
  initialState,
  reducers : {
    setLos(state, action: PayloadAction<Los>) {
        state.los = action.payload
      }
  }
})

export const { setLos } = losSlice.actions

export const fetchLos = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const los = await losService.getLos(id);
      dispatch(setLos(los));
    } catch (error) {
      console.error("Failed to fetch line-of-sight", error);
    }
  };
};


export const editLos = (los: Los) => {
    return async (dispatch: AppDispatch) => {
        const editedLos: Los = await losService.updateLos(los) 
        dispatch(setLos(editedLos))
    }
}

export default losSlice.reducer
