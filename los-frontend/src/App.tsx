import ElevatorPitch from "./components/ElevatorPitch"
import SignupForm from "./components/Signup"
import LosPage from "./components/LosPage";
import SuccessNotification from "./components/SuccessNotification";
import ErrorNotification from "./components/ErrorNotification";
import { setPitches } from "./reducers/pitchReducer"
import pitchService from "./services/pitchService";
import { useDispatch, useSelector } from 'react-redux';
import { initialiseUser } from './reducers/userReducer';
import { useEffect } from "react"
import { AppDispatch, RootState } from "./store"
import losService from "./services/losService"
import { setLoses } from "./reducers/losReducer"
import { Routes, Route, Navigate } from 'react-router-dom'
import ForgotPasswordForm from "./components/ForgotPassword";
import PasswordResetForm from './components/PasswordReset'
import Home from "./components/Home";
import { setPrograms } from "./reducers/programReducer";
import programService from "./services/programService";


function App() {  
  const user = useSelector((state: RootState) => state.user.user); 
  const dispatch = useDispatch<AppDispatch>();


  // Fetch user only on component mount
  useEffect(() => {
    dispatch(initialiseUser()); // This only runs once
  }, [dispatch]);

  // Fetch programs, pitch, and LoS once user is defined
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        
        try {
          // 1. Fetch user's programs
          const userPrograms = await programService.getUserPrograms(user.id);
          await dispatch(setPrograms(userPrograms));

          // 2. Fetch the pitch associated with the user's programs
          const userPitches = await pitchService.getUserPitches(user.id)
          await dispatch(setPitches(userPitches));

          // 3. Fetch the LoS associated with the user's pitch
          const userLoses = await losService.getUserLoses(user.id)
          await dispatch(setLoses(userLoses))

        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    // Run the fetchData only when the user is set
    if (user) {
      fetchData();
    }

  }, [dispatch, user]); // Trigger the effect only when user changes (upon mount) and is not null


  return (
    <>
      < ErrorNotification />
      < SuccessNotification />

      <div>
        <Routes>
          {/* Make  /line-of-sight and /elevator-pitch routes that instructs users to add a program?  */}
          {/* Add a fallback route */}
          {/* Add a loading state */}
          <Route path="/login" element={!user ? <SignupForm /> : <Navigate to="/home" />} />
          <Route path="/home" element={user? <Home /> : <Navigate to="/login" />} />
          <Route path="/projects/:programId/elevator-pitch/:pitchId" element={user ? <ElevatorPitch /> : <Navigate to="/login" />} />
          <Route path="/projects/:programId/line-of-sight/:pitchId" element={user ? <LosPage /> : <Navigate to="/login" />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />}/>
          <Route path="/reset-password" element={<PasswordResetForm />} />
        </Routes>
      </div>
    </>
  )
}

export default App

