import { createSlice } from '@reduxjs/toolkit'
import programService from '../services/programService'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Program } from '../types'
import { AppDispatch } from '../store'


// Define a type for the slice state
interface ProgramState {
    programs: Program[];
}
  
// Define the initial state using that type
const initialState: ProgramState = {
    programs: [],
} 

const programSlice = createSlice({
  name: "programs",
  initialState,
  reducers : {
    setPrograms(state, action: PayloadAction<Program[]>) {
        state.programs = action.payload
      },
    addProgram(state, action: PayloadAction<Program>) {
        if (state.programs) {
            state.programs.push(action.payload);
        } else {
            state.programs = [action.payload];
        }
    },
    removeProgram(state, action: PayloadAction<number>) {
        if (state.programs) {
            state.programs = state.programs.filter(program => program.id !== action.payload);
        }
        }
    }
});


export const { setPrograms, addProgram, removeProgram } = programSlice.actions

export const fetchPrograms = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const programs = await programService.getPrograms();
      dispatch(setPrograms(programs));
    } catch (error) {
      console.error("Failed to fetch programs", error);
    }
  };
};

export const createNewProgram = () => {
    return async (dispatch: AppDispatch) => {
      try {
        const newProgram = await programService.createProgram();
        dispatch(addProgram(newProgram));
        return newProgram
      } catch (error) {
        console.error('Failed to create program', error);
      }
    };
  };


  
export const deleteProgram = (id: number) => {
return async (dispatch: AppDispatch) => {
    try {
    await programService.deleteProgram(id);
    dispatch(removeProgram(id));
    } catch (error) {
    console.error('Failed to delete program', error);
    }
};
};



export default programSlice.reducer
