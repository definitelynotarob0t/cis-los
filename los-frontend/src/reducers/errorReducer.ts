import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface NotificationState {
  error: string | null
}

const initialState: NotificationState = {
  error: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    hideNotification(state) {
      state.error = null;
    },
  },
});

export const { showNotification, hideNotification } = errorSlice.actions;

export const notifyError = (message: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(showNotification(message)) 
        setTimeout(() => {
            dispatch(hideNotification())
          }, 5000)
    }
}

export default errorSlice.reducer