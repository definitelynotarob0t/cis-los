import { createSlice } from '@reduxjs/toolkit'
import losService from '../services/losService'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Los } from '../types'
import { AppDispatch } from '../store'

// Define a type for the slice state
interface LosState {
    loses: Los[] | [];
}
  
// Define the initial state using that type
const initialState: LosState = {
    loses: [],
} 

const losSlice = createSlice({
  name: "loses",
  initialState,
  reducers : {
    setLoses(state, action: PayloadAction<Los[]>) {
        state.loses = action.payload
      },
    updateLos(state, action: PayloadAction<Los>) {
      const updatedLos = action.payload
      if (state.loses) {
        const index = state.loses.findIndex(los => los.id === updatedLos.id);
        if (index !== -1) {
            state.loses[index] = updatedLos;
        }
    }
    },
    addLosToState(state, action: PayloadAction<Los>) {
      state.loses = [...state.loses, action.payload];
    },
    removeLosFromState(state, action: PayloadAction<number>) {
      state.loses = state.loses.filter((los) => los.id !== action.payload);
    }
  }
})

export const { setLoses, updateLos, addLosToState, removeLosFromState } = losSlice.actions

export const fetchLoses = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const loses = await losService.getLoses();
      dispatch(setLoses(loses));
    } catch (error) {
      console.error("Failed to fetch line of sights", error);

    }
  }
}

export const fetchLos = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const los = await losService.getLos(id);
      dispatch(setLoses(los));
    } catch (error) {
      console.error("Failed to fetch line of sight", error);
    }
  };
};


export const editLos = (los: Los) => {
  return async (dispatch: AppDispatch) => {
      try {
          const editedLos: Los = await losService.updateLos(los);
          dispatch(updateLos(editedLos)); 
      } catch (error) {
          console.error("Failed to update line of sight", error);
      }
  };
};


export const addLos = (newLos: Omit<Los, 'id'>) => {
  return async (dispatch: AppDispatch) => {
    try {
      const createdLos = await losService.createLos(newLos);  
      dispatch(addLosToState(createdLos));  
    } catch (error) {
      console.error("Failed to create a new line of sight", error);
    }
  };
}

export const removeLos = (losId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      await losService.deleteLos(losId);
      dispatch(removeLosFromState(losId));
    }
    catch (error) {
      console.log("Failed to delete line of sight", error);
    }
  }
}

export default losSlice.reducer
