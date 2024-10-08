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
import pitchService from "../services/pitchService";
import { Pitch } from "../types";
import { Modal, Button } from "react-bootstrap";

const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); 

    const user = useSelector((state: RootState) => state.user.user);
    const userName = user?.name;
    const userId = user?.id;
    const [userPrograms, setUserPrograms] = useState<Program[]>([]);
    const [programTitles, setProgramTitles] = useState<string[]>([]); 
    const [showModal, setShowModal] = useState(false);
    const [programToDelete, setProgramToDelete] = useState<{id: number, title: string} | null>(null);


    // Fetch and set user's programs
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                if (user?.id) {
                    const fetchedUserPrograms = await programService.getUserPrograms(user.id);
                    // Sort programs by id in ascending order
                    const sortedPrograms = fetchedUserPrograms.sort((a: Program, b: Program) => a.id - b.id);

                    dispatch(setPrograms(sortedPrograms));
                    setUserPrograms(sortedPrograms);

                }
            } catch (error) {
                console.error("Failed to fetch user programs:", error);
            }
        };
        fetchPrograms();
    }, [dispatch]);

    // Fetch and set user's program titles
    useEffect(() => {
        const getProgramTitles = async () => {
            if (userId) {
                try {
                    const userPitches = await pitchService.getUserPitches(userId);
                    const sortedPitches = userPitches.sort((a: Pitch, b: Pitch) => a.id - b.id);
                    const titles = sortedPitches.map((pitch: Pitch) => pitch.title);
                    setProgramTitles(titles);  
                } catch (error) {
                    console.error("Failed to fetch program titles:", error);
                }
            }
        };
        getProgramTitles();
    }, [userId]);


    const handleEditProgram = (pitchId: number, programId: number) => {
        navigate(`/projects/${programId}/elevator-pitch/${pitchId}`); 
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
                const sortedPrograms = fetchedUserPrograms.sort((a: Program, b: Program) => a.id - b.id);

                setUserPrograms(sortedPrograms); 
                dispatch(setPrograms(sortedPrograms)); 
            }
  
            dispatch(notifySuccess('New project created'));
        } catch (error) {
            dispatch(notifyError('Error adding new project'));
        }
    };


    const handleDelete = (id: number, index: number) => {
        const title = programTitles[index] || "Untitled";
        setProgramToDelete({id, title}); 
        setShowModal(true);
    };


    const cancelDelete = () => {
        setShowModal(false);
        setProgramToDelete(null); 
    };

    
    const confirmDelete = async () => {
        if (programToDelete !== null) {
            try {
                // Step 1: Dispatch the delete action
                await dispatch(deleteProgram(programToDelete.id));

                // Step 2: Update user program IDs
                const updatedProgramIds = user?.programIds?.filter(programId => programId !== programToDelete.id);
                dispatch(updateUserProgramIds(updatedProgramIds || []));

                // Step 3: Fetch updated programs and update local state
                if (user) {
                    const updatedUserPrograms = await programService.getUserPrograms(user.id);
                    const sortedPrograms = updatedUserPrograms.sort((a: Program, b: Program) => a.id - b.id);


                    setUserPrograms(sortedPrograms);  
                    dispatch(setPrograms(sortedPrograms));     
                }

                dispatch(notifySuccess('Project deleted'));
                setShowModal(false);
                setProgramToDelete(null);

            } catch (error) {
                dispatch(notifyError('Error deleting project'));
            }
        }
    };




    return (
        <div className="content">
            <Header />
            <div className="home-content">
                <h2 style={{margin: "8px"}}><strong>Welcome {userName},</strong></h2>
                <p style={{margin: "8px"}}>You currently have {userPrograms && (  
                    userPrograms.length
                )} {userPrograms && userPrograms.length === 1? (
                <span>project:</span> 
                ) : ( 
                    <span>projects:</span>
                )} </p>
                {userPrograms && userPrograms.length > 0 ? userPrograms.map((program, index) => (
                <ul key={index}>
                    <li key={index}>
                        <span style={{ opacity: programTitles[index] ? 1 : 0.5 }}>
                            {programTitles[index] || "Untitled"}
                        </span>
                        <button onClick={() => handleEditProgram(program.pitchId, program.id)} className="edit-delete-project-btn" > edit</button> 
                        <button onClick={() => handleDelete(program.id, index)}  className="edit-delete-project-btn"> delete</button>
                    </li>
                </ul>
                
            )) : <p>No projects available.</p>}

                <button onClick={handleAddProgram} className="new-program-button"> Create new project </button>
            </div>
            <Footer />
            <Modal show={showModal} onHide={cancelDelete}>
                <Modal.Header>
                    <Modal.Title>Are you sure you want to delete '{programToDelete?.title}'?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
        
    )
}

export default Home