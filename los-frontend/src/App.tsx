import ElevatorPitch from "./components/ElevatorPitch"
import Header from "./components/Header"
import Footer from "./components/Footer"
// import { useAppDispatch } from "./hooks"
import { AppDispatch } from "./store"
import { useEffect } from 'react'
import { Pitch } from "./types"
import { setPitch } from "./reducers/pitchReducer"
import pitchService from "./services/pitchService";
import { useDispatch, useSelector } from 'react-redux';
import { initialiseUser } from './reducers/userReducer';
import LoginForm from "./components/Login"
import store from "./store"


function App() {

  const dispatch = useDispatch<AppDispatch>() // ? check relevance of 'useAppDispatch? - when to use?
  const user = useSelector((state: any) => state.user.user); 
  console.log('user:', user)

  console.log(store.getState())


  useEffect(() => {
    dispatch(initialiseUser());

    if (user) {
      const getUserPitch = async () => {
        try {
          const pitch: Pitch = await pitchService.getPitch(user.pitchId);
          dispatch(setPitch(pitch));
        } catch (error) {
          console.error("Failed to fetch user's pitch:", error);
        }
      };
  
      getUserPitch();
    }


  }, [dispatch]);


  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      < Header />
      < ElevatorPitch />
      < Footer />
    </>
  )
}

export default App

