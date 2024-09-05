import { configureStore } from '@reduxjs/toolkit'
import pitchReducer from './reducers/pitchReducer'
import userReducer from './reducers/userReducer'


const store = configureStore({
    reducer: {
        pitch: pitchReducer,
        user: userReducer
    //   logicOverview: logicOverviewReducer,
    //   logic: logicReducer
    }
  })
  
console.log(store.getState())

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store