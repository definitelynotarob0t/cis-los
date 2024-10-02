import Header from "./Header"
import Footer from "./Footer"
import { useAppDispatch } from "../hooks";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { setPrograms, createNewProgram, deleteProgram } from "../reducers/programReducer";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from '../reducers/notificationReducer';
import { notifyError } from '../reducers/errorReducer';
import { useEffect, useState } from "react";
import programService from "../services/programService";
import { Program } from "../types";
import { updateUserProgramIds } from "../reducers/userReducer";

const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); 

    const user = useSelector((state: RootState) => state.user.user);
    const userName = user?.name
    const allPitches = useSelector((state: RootState) => state.pitches?.pitches)
    const userPitches = allPitches.filter((pitch) => pitch.userId == user?.id)
    const programTitles = userPitches?.map(pitch => pitch.title);

    const [userPrograms, setUserPrograms] = useState<Program[]>([]);


    // Fetch user's current programs
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                if (user?.id) {
                    const fetchedUserPrograms = await programService.getUserPrograms(user.id);
                    dispatch(setPrograms(fetchedUserPrograms));
                    setUserPrograms(fetchedUserPrograms)
                }
            } catch (error) {
                console.error("Failed to fetch user programs:", error);
            }
        };
        fetchPrograms();
    }, [dispatch]);


    const handleEditProgram = (pitchId: number, programId: number) => {
        navigate(`/programs/${programId}/elevator-pitch/${pitchId}`); 
    };


    const handleAddProgram = async() => {
        try {
            // Step 1: Create the new program and receive the new program's details (including its ID)
            const newProgram = await dispatch(createNewProgram());  
    
            // Step 2: Update user's programIds in the Redux store by adding the new program's ID
            const updatedProgramIds = [...(user?.programIds || []), newProgram.id];
            dispatch(updateUserProgramIds(updatedProgramIds)); 
    
            // Step 3: Add the new program to both userPrograms and Redux state
            if (user) {
                const fetchedUserPrograms = await programService.getUserPrograms(user.id);
                setUserPrograms(fetchedUserPrograms); 
                dispatch(setPrograms(fetchedUserPrograms)); 
            }
  
            dispatch(notifySuccess('New program added'));
        } catch (error) {
            dispatch(notifyError('Error adding new program'));
        }
    };

    
    const handleDeleteProgram = async (id: number) => {
        try {
            // Step 1: Dispatch the delete action
            await dispatch(deleteProgram(id));

            // Step 2: Update user program IDs
            const updatedProgramIds = user?.programIds?.filter(programId => programId !== id);
            dispatch(updateUserProgramIds(updatedProgramIds || []));

            // Step 3: Fetch updated programs and update local state
            if (user) {
                const updatedUserPrograms = await programService.getUserPrograms(user.id);
                setUserPrograms(updatedUserPrograms);  
                dispatch(setPrograms(userPrograms));  // Set updated programs    
            }

            dispatch(notifySuccess('Program deleted'));
        } catch (error) {
            dispatch(notifyError('Error deleting program'));
        }
    };




    return (
        <div className="content">
            <Header />
            <h2 style={{margin: "8px"}}><strong>Welcome {userName},</strong></h2>
            <p style={{margin: "8px"}}>You currently have {userPrograms && (  
                userPrograms.length
            )} {userPrograms && userPrograms.length === 1? (
               <span>program:</span> 
            ) : ( 
                <span>programs:</span>
            )} </p>
            {userPrograms && userPrograms.length > 0 ? userPrograms.map((program, index) => (
            <ul key={index}>
                <li key={index}>
                    <span style={{ opacity: programTitles[index] ? 1 : 0.5 }}>
                        {programTitles[index] || "Untitled"}
                    </span>
                    <button onClick={() => handleEditProgram(program.pitchId, program.id)} className="edit-delete-program-btn" > edit</button> 
                    <button onClick={() => handleDeleteProgram(program.id)} className="edit-delete-program-btn"> delete</button>
                </li>
            </ul>
            
        )) : <p>No programs available.</p>}

            <button onClick={handleAddProgram} className="new-program-button"> Create new program </button>
            <Footer />
        </div >
    )
}

export default Home