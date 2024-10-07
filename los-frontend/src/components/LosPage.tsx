// LosPage.tsx
import LosMapper from "./LosMapper";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { Card } from "react-bootstrap";
import { RootState } from "../store";
import  { useState, useEffect, SyntheticEvent } from "react";
import AccordionWidget from "./Accordion";
import { fetchLos, editLos, addLos } from "../reducers/losReducer";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los, Pitch } from "../types";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";


const LosPage = () => {
    const [activityFields, setActivityFields] = useState<string[]>(['',]);
    const [outputFields, setOutputFields] = useState<string[]>(['']);
    const [usageFields, setUsageFields] = useState<string[]>(['']);
    const [outcomeFields, setOutcomeFields] = useState<string[]>(['']);

    const dispatch = useAppDispatch();


    const { pitchId, programId } = useParams<{ pitchId: string; programId: string }>(); 
    let pitchIdNumber = Number(pitchId);
    let programIdNumber = Number(programId)


    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const pitches = useSelector((state: RootState) => state.pitches?.pitches);
    const pitch = pitches.find((pitch: Pitch) => pitch.id === pitchIdNumber);
    const loses = useSelector((state: RootState) => state.loses?.loses);
      // Filter Loses by Program ID
    const filteredLoses = loses.filter((los: Los) => los.programId === programIdNumber);

    
    useEffect(() => {
        if (pitchIdNumber && filteredLoses.length === 0) {
          dispatch(fetchLos(pitchIdNumber)); // Fetch only if there are no filtered loses
        }
      }, [filteredLoses, pitchIdNumber, dispatch]);
    
    // Pre-fill fields when a new Los is selected (fields are not stored until changes are saved - no local storage)
    useEffect(() => {
    if (filteredLoses.length > 0) {
        const los = filteredLoses[0]; // Only the first LoS  for now 
        setActivityFields(los.activities || ['']);
        setOutcomeFields(los.outcomes || ['']);
        setUsageFields(los.usages || ['']);
        setOutputFields(los.outputs || ['']);
    }
    }, [filteredLoses]);

    // Save logic
    const updateLos = async (event: SyntheticEvent) => {
        event.preventDefault();
    
        try {
            if (userId && pitchIdNumber !== undefined) {
                const updatedLos: Los = {
                    id: pitchIdNumber,
                    activities: activityFields,
                    outputs: outputFields,
                    usages: usageFields,
                    outcomes: outcomeFields,
                    userId: userId,
                    programId: programIdNumber
                };
    
                await dispatch(editLos(updatedLos));
                dispatch(notifySuccess("Saved"));
            }
        } catch (error) {
            dispatch(notifyError("Error saving line of sight"));
            console.error("Error while saving line of sight:", error);
        }

    };

    const handleAddLos = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            if (userId && pitchIdNumber !== undefined) {
                const newLos: Omit<Los, 'id'> = {
                    activities: [''],
                    outputs: [''],
                    usages: [''],
                    outcomes: [''],
                    userId: userId,
                    programId: programIdNumber
                };
    
                await dispatch(addLos(newLos));
            }
        } catch (error) {
            dispatch(notifyError("Error adding a new line of sight"));
            console.error("Error while adding a new line of sight:", error);
        }
    }


    
  return (
    <div className="content">
      <Header updateUserInputs={updateLos} />
      <div className="los-container" style={{display: 'flex'}}>
        <div className="accordion-container">
            <AccordionWidget /> 
        </div>

        <div className="user-los-container">
            <Card className="title-card">
                {pitch?.title ? (
                    <div><strong>{pitch?.title}</strong></div>
                ) :
                    <div style={{color: 'gray'}}>Title will apear here </div>
                }
            </Card>

            <Card className="details-card">
                <div style={{ display: 'inline' }}>
                    {pitch?.mainActivity ? (
                        <div>
                            <span>{pitch?.mainActivity}</span>
                            <span>&nbsp;</span>{pitch?.challenge}
                            <span>&nbsp;</span>{pitch?.outcome}
                        </div>
                    ) :
                        <div style={{color: 'lightGray'}}>Elevator pitch will appear here.</div>
                    }
                </div>
            </Card>

            <div>
            {/* Loop through the program's LoSes */}
            {filteredLoses.map((los) => (
                <LosMapper key={los.id} los={los} />
            ))}
            </div>
            <button className="add-los-btn" onClick={handleAddLos}> Add Project  </button>
        </div>
      </div>
       
      <Footer />
    </div>
  );
};

export default LosPage;
