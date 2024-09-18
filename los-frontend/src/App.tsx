import ElevatorPitch from "./components/ElevatorPitch"
import store from "./store"
import SignupForm from "./components/Signup"
import LosMapper from "./components/Los"
import SuccessNotification from "./components/SuccessNotification";
import ErrorNotification from "./components/ErrorNotification";
import { Pitch, Los } from "./types"
import { setPitch } from "./reducers/pitchReducer"
import pitchService from "./services/pitchService";
import { useDispatch, useSelector } from 'react-redux';
import { initialiseUser } from './reducers/userReducer';
import { useEffect } from "react"
import { AppDispatch } from "./store"
import losService from "./services/losService"
import { setLos } from "./reducers/losReducer"
import { Routes, Route, Navigate } from 'react-router-dom'


function App() {
  const user = useSelector((state: any) => state.user.user); 
  const dispatch = useDispatch<AppDispatch>();

  console.log(store.getState())

  useEffect(() => {
    dispatch(initialiseUser());

    // Ensure that pitch and LoS will be rendered upon page refresh
    if (user) {
      const getUserPitch = async () => {
        try {
          const pitch: Pitch = await pitchService.getPitch(user.pitchId);
          dispatch(setPitch(pitch));
        } catch (error) {
          console.error("Failed to fetch user's pitch:", error);
        }
      }

      const getUserLos = async () => {
        try { 
          const los: Los = await losService.getLos(user.pitchId);
          dispatch(setLos(los))
        } catch (error) {
          console.error("Failed to fetch user's los:", error)
        }
      }
  
      getUserPitch();
      getUserLos();
    }

  }, [dispatch]);

  useEffect(() => {
    // Store the current location in local storage before unmounting
    return () => {
      localStorage.setItem('lastVisitedRoute', location.pathname);
    };
  }, [location]);


  return (
    < >
      < ErrorNotification />
      < SuccessNotification />

      <div className="content">
        <Routes>
          <Route path="/login" element={!user ? <SignupForm /> : <Navigate to="/elevator-pitch" />} />
          <Route path="/elevator-pitch" element={user ? <ElevatorPitch /> : <Navigate to="/login" />} />
          <Route path="/line-of-sight" element={user ? <LosMapper /> : <Navigate to="/login" />} />
        </Routes>
      </div>

    </ >
  )
}

export default App

