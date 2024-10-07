import { useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import React, { useState, useEffect, SyntheticEvent } from "react";
import AccordionWidget from "./Accordion";
import { fetchLos, editLos, addLos, removeLos } from "../reducers/losReducer";
import { useAppDispatch } from "../hooks";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los, Pitch } from "../types";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

// Reusable component for dynamic input sections
const InputSection = ({ title, fields, setFields, addField}: 
    { title: string, fields: string[] | null, setFields: React.Dispatch<React.SetStateAction<string[]>>, addField: () => void}) => {

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Ensure fields is always an array
    const fieldArray = fields ?? [''];

    const handleInputBlur = (index: number, event: React.FocusEvent<HTMLDivElement>) => {
        const updatedFields = [...fieldArray];
        updatedFields[index] = event.currentTarget.innerText; // Store the text on blur
        setFields(updatedFields);
        setFocusedIndex(null); // Reset focus when blur happens
    };

    const handleInputFocus = (index: number) => {
        setFocusedIndex(index); // Set the focused input index
      };


    return (
        <Container>
            <div className="input-titles">{title}</div>
            <Card style={{ border: 'none'}}>
                {fieldArray.map((field, index) => (
                     <div key={index} className="input-section-container page-break">
                        <div
                            contentEditable
                            onBlur={(e) => handleInputBlur(index, e)}
                            onFocus={() => handleInputFocus(index)}
                            suppressContentEditableWarning
                            className="input-contenteditable"   
                            ref={(el) => { if (el) el.textContent = field }}
                        />
                    {field === '' && focusedIndex !== index &&  (
                            <button
                                onClick={() => setFields(fieldArray.filter((_, i) => i !== index))}
                                className="delete-input"
                            >
                                x
                            </button>
                    )}
                    </div>
                ))}
                <button onClick={addField} className="add-input-button" >
                    +
                </button>
            </Card>
        </Container>
    );
};

const LosMapper = () => {
    const [inputFields, setInputFields] = useState<string[]>(['']);
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
        setInputFields(los.inputs || ['']);
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
                    inputs: inputFields,
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
                    inputs: [''],
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

    const handleDeleteLos = async (losId: number) => {
        try {
            await dispatch(removeLos(losId))
        } catch (error) {
            dispatch(notifyError("Error deleting project"))
        }
    }

    return (
        <div className="content">
        <Header updateUserInputs={updateLos} />
        <div className="los-container" style={{display: "flex"}}>
            {/* Column 1 */}
            <div className="accordion-container">
                <AccordionWidget/>
            </div> 

            {/* Column 2 */}
            <div className="user-los-container">
                {/* Column 2 row 1 */}
                <Card className="title-card">
                    {pitch?.title ? (
                        <div><strong>{pitch?.title}</strong></div>
                    ) :
                        <div style={{color: 'gray'}}>Title will apear here </div>
                    }
                </Card>

                {/* Column 2 row 2 */}
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

                {/* Column 2, row 3 onwards */}
                <div className="titles-answers-container">
                {filteredLoses.map((los: Los, index: number) => (
                    <React.Fragment key={los.id}>
                        <h1 className="project-number">
                            <strong>Project {index + 1}</strong> 
                            <button
                                onClick={() => handleDeleteLos(los.id) }
                                className="delete-los-btn"
                            >
                                x
                            </button>
                            </h1>  
                        <div className="individual-answers-container">
                            <InputSection 
                                title="Inputs" 
                                fields={los.inputs ?? ['']}  // Ensure fields is never null
                                setFields={setInputFields} 
                                addField={() => setInputFields([...(los.inputs ?? ['']), ''])} 
                            />
                            <InputSection 
                                title="Activities" 
                                fields={los.activities ?? ['']} 
                                setFields={setActivityFields} 
                                addField={() => setActivityFields([...(los.activities ?? ['']), ''])} 
                            />
                            <InputSection 
                                title="Outputs" 
                                fields={los.outputs ?? ['']}
                                setFields={setOutputFields} 
                                addField={() => setOutputFields([...(los.outputs ?? ['']), ''])} 
                            />
                            <InputSection 
                                title="Usages" 
                                fields={los.usages ?? ['']}
                                setFields={setUsageFields} 
                                addField={() => setUsageFields([...(los.usages ?? ['']), ''])} 
                            />
                            <InputSection 
                                title="Outcomes and Impacts" 
                                fields={los.outcomes ?? ['']} 
                                setFields={setOutcomeFields} 
                                addField={() => setOutcomeFields([...(los.outcomes ?? ['']), ''])} 
                            />
                        </div>
                    </React.Fragment>
                ))}
                </div>

                <button className="add-los-btn" onClick={handleAddLos}> +  </button>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default LosMapper;
