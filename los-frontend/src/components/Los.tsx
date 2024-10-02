import { useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import React, { useState, useEffect, SyntheticEvent } from "react";
import AccordionWidget from "./Accordion";
import { fetchLos, editLos } from "../reducers/losReducer";
import { useAppDispatch } from "../hooks";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los, Pitch } from "../types";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

// Reusable component for dynamic input sections
const InputSection = ({ title, fields, setFields, addField}: 
    { title: string, fields: string[], setFields: React.Dispatch<React.SetStateAction<string[]>>, addField: () => void}) => {

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);


    const handleInputBlur = (index: number, event: React.FocusEvent<HTMLDivElement>) => {
        const updatedFields = [...fields];
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
                {fields.map((field, index) => (
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
                                onClick={() => setFields(fields.filter((_, i) => i !== index))}
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
    const loses = useSelector((state: RootState) => state.loses?.loses)
    
    const los = loses.find((los: Los) => los.id === pitchIdNumber)

    // Pre-fill fields (fields are not stored until changes until saved - no local storage)
    useEffect(() => {
        if (pitchIdNumber && !los) {
            dispatch(fetchLos(pitchIdNumber));
        }
        
        if (los) {
            setInputFields(los.inputs || ['']);
            setActivityFields(los.activities || ['']);
            setOutcomeFields(los.outcomes || ['']);
            setUsageFields(los.usages || ['']);
            setOutputFields(los.outputs || ['']);
        }


    }, [los, dispatch]);

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
            dispatch(notifyError("Error saving LOS"));
            console.error("Error while saving LOS:", error);
        }

    };

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
                {/* Column 2 row 3 */}
                <div className="titles-answers-container">
                    <InputSection title="Inputs" fields={inputFields} setFields={setInputFields} addField={() => setInputFields([...inputFields, ''])} />
                    <InputSection title="Activities" fields={activityFields} setFields={setActivityFields} addField={() => setActivityFields([...activityFields, ''])} />
                    <InputSection title="Outputs" fields={outputFields} setFields={setOutputFields} addField={() => setOutputFields([...outputFields, ''])} />
                    <InputSection title="Usages" fields={usageFields} setFields={setUsageFields} addField={() => setUsageFields([...usageFields, ''])} />
                    <InputSection title="Outcomes and Impacts" fields={outcomeFields} setFields={setOutcomeFields} addField={() => setOutcomeFields([...outcomeFields, ''])} />
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default LosMapper;
