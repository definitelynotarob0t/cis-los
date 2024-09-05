import { createSlice } from '@reduxjs/toolkit'
import pitchService from '../services/pitchService'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Pitch, Content } from '../types'
import { AppDispatch } from '../store'
import userService from '../services/userService'

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
      },
    removePitch(state) {
        state.pitch = null
    }

  }
})

export const {setPitch, removePitch } = pitchSlice.actions

export const createPitch = (content: Content) => {
  return async (dispatch: AppDispatch) => {
    const newPitch: Pitch = await pitchService.createNew(content)
    dispatch(setPitch(newPitch))
    await userService.updateUser(newPitch) 
  }
}

// export const editPitch = (pitch: Pitch) => {
//     return async (dispatch: AppDispatch) => {
//         const editedPitch: Pitch = await pitchService.updatePitch(pitch) 
//         dispatch(updatePitch(editedPitch))
//     }
// }

export const remove = (pitch: Pitch) => {
  return async (dispatch: AppDispatch) => {
    const pitchDeleted = await pitchService.deletePitch(pitch)
    dispatch(removePitch(pitchDeleted))
  }
}

export default pitchSlice.reducer
