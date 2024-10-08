import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import { useState, useEffect, SyntheticEvent } from "react";
import AccordionWidget from "./Accordion";
import { fetchLoses, editLos, addLos, removeLos } from "../reducers/losReducer";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los, Pitch } from "../types";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

// Reusable InputSection component (keeps same logic)
const InputSection = ({ title, fields, setFields, addField }: 
    { title: string, fields: string[], setFields: React.Dispatch<React.SetStateAction<string[]>>, addField: () => void }) => {

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleInputBlur = (index: number, event: React.FocusEvent<HTMLDivElement>) => {
        const updatedFields = [...fields];
        updatedFields[index] = event.currentTarget.innerText;
        setFields(updatedFields);
        setFocusedIndex(null); 
        
    };

    const handleInputFocus = (index: number) => {
        setFocusedIndex(index); 
    };

    return (
        <Container>
            <div className="input-titles">{title}</div>
            <Card style={{ border: 'none' }}>
                {fields.map((field, index) => (
                    <div key={index} className="input-section-container">
                        <div
                            contentEditable
                            onBlur={(e) => handleInputBlur(index, e)}
                            onFocus={() => handleInputFocus(index)}
                            suppressContentEditableWarning
                            className="input-contenteditable"
                            ref={(el) => { if (el) el.textContent = field }}
                        />
                        {field === '' && focusedIndex !== index && (
                            <button
                                onClick={() => setFields(fields.filter((_, i) => i !== index))}
                                className="delete-input-btn"
                            >
                                x
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addField} className="add-input-button">
                    +
                </button>
            </Card>
        </Container>
    );
};

const LosPage = () => {
    const [losStates, setLosStates] = useState<{ [key: number]: { activities: string[], outputs: string[], usages: string[], outcomes: string[] } }>({});
    const dispatch = useAppDispatch();

    const { pitchId, programId } = useParams<{ pitchId: string, programId: string }>(); 
    let pitchIdNumber = Number(pitchId);
    let programIdNumber = Number(programId);

    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const pitches = useSelector((state: RootState) => state.pitches?.pitches);
    const pitch = pitches.find((pitch: Pitch) => pitch.id === pitchIdNumber);
    const unsortedLoses = useSelector((state: RootState) => state.loses?.loses);
    const loses = unsortedLoses ? 
    [...unsortedLoses].sort((a: Los, b: Los) => a.id - b.id) 
    : [];

    const filteredLoses = loses.filter((los: Los) => los.programId === programIdNumber);

    // Fetch LoSes if not already loaded
    useEffect(() => {
        if (pitchIdNumber && filteredLoses.length === 0) {
            dispatch(fetchLoses());
        }
    }, [pitchIdNumber, filteredLoses.length, dispatch]);

    // Initialize state for each LoS when filteredLoses change
    useEffect(() => {
        const initialStates = filteredLoses.reduce((acc, los) => {
            if (!losStates[los.id]) {
                acc[los.id] = {
                    activities: los.activities || [''],
                    outputs: los.outputs || [''],
                    usages: los.usages || [''],
                    outcomes: los.outcomes || [''],
                };
            }
            return acc;
        }, {} as typeof losStates);

        if (Object.keys(initialStates).length > 0) {
            setLosStates((prev) => ({ ...prev, ...initialStates }));
        }
    }, [filteredLoses, losStates]);

    // Save logic for each LoS
    const updateLos = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            for (const losId in losStates) {
                const losState = losStates[losId];

                const updatedLos: Los = {
                    id: Number(losId),
                    activities: losState.activities,
                    outputs: losState.outputs,
                    usages: losState.usages,
                    outcomes: losState.outcomes,
                    userId: userId!,
                    programId: programIdNumber
                };

                await dispatch(editLos(updatedLos));
            }

            dispatch(notifySuccess("Saved"));
        } catch (error) {
            dispatch(notifyError("Error saving."));
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
    };

    const handleDeleteLos = async (losId: number) => {
        try {
            await dispatch(removeLos(losId));
        } catch (error) {
            dispatch(notifyError("Error deleting project"));
        }
    };

    return (
        <div className="content">
            <Header updateUserInputs={updateLos} />
            <div className="los-container" style={{ display: 'flex' }}>
                <div className="accordion-container">
                    <AccordionWidget />
                </div>

                <div className="user-los-container">
                    <Card className="title-card">
                        {pitch?.title ? (
                            <div><strong>{pitch?.title}</strong></div>
                        ) :
                            <div style={{ color: 'gray' }}>Title will appear here</div>
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
                                <div style={{ color: 'lightGray' }}>Elevator pitch will appear here.</div>
                            }
                        </div>
                    </Card>

                    <div>
                        {filteredLoses.map((los, index) => (
                            <div className="user-los-container" key={los.id}>
                                <div className="titles-answers-container">
                                    <h1 className="program-number">
                                        <strong>Program {index + 1}</strong>
                                        <button
                                            onClick={() => handleDeleteLos(los.id)}
                                            className="delete-los-btn"
                                        >
                                            Delete Project
                                        </button>
                                    </h1>

                                    <div className="individual-answers-container">
                                    <InputSection
                                        title="Activities"
                                        fields={losStates[los.id]?.activities || ['']}
                                        setFields={(fields) =>
                                            setLosStates((prevState) => ({
                                              ...prevState,
                                              [los.id]: {
                                                ...prevState[los.id],
                                                activities: typeof fields === 'function' ? fields(prevState[los.id].activities) : fields, // Ensure fields is an array
                                              },
                                            }))
                                          }
                                        addField={() => setLosStates((prevState) => ({
                                            ...prevState,
                                            [los.id]: { ...prevState[los.id], activities: [...losStates[los.id]?.activities || [], ''] }
                                        }))}
                                    />
                                    <InputSection 
                                        title="Outputs" 
                                        fields={losStates[los.id]?.outputs || ['']}
                                        setFields={(fields) =>
                                            setLosStates((prevState) => ({
                                              ...prevState,
                                              [los.id]: {
                                                ...prevState[los.id],
                                                outputs: typeof fields === 'function' ? fields(prevState[los.id].outputs) : fields, // Ensure fields is an array
                                              },
                                            }))
                                          }
                                        addField={() => setLosStates((prevState) => ({
                                            ...prevState,
                                            [los.id]: { ...prevState[los.id], outputs: [...losStates[los.id]?.outputs || [], ''] }
                                        }))}
                                    />
                                    <InputSection 
                                        title="Usages" 
                                        fields={losStates[los.id]?.usages || ['']}
                                        setFields={(fields) =>
                                            setLosStates((prevState) => ({
                                              ...prevState,
                                              [los.id]: {
                                                ...prevState[los.id],
                                                usages: typeof fields === 'function' ? fields(prevState[los.id].usages) : fields, // Ensure fields is an array
                                              },
                                            }))
                                          }
                                        addField={() => setLosStates((prevState) => ({
                                            ...prevState,
                                            [los.id]: { ...prevState[los.id], usages: [...losStates[los.id]?.usages || [], ''] }
                                        }))}
                                    />
                                    <InputSection 
                                        title="Outcomes and Impacts" 
                                        fields={losStates[los.id]?.outcomes || ['']}
                                        setFields={(fields) =>
                                            setLosStates((prevState) => ({
                                              ...prevState,
                                              [los.id]: {
                                                ...prevState[los.id],
                                                outcomes: typeof fields === 'function' ? fields(prevState[los.id].outcomes) : fields, // Ensure fields is an array
                                              },
                                            }))
                                          }
                                        addField={() => setLosStates((prevState) => ({
                                            ...prevState,
                                            [los.id]: { ...prevState[los.id], outcomes: [...losStates[los.id]?.outcomes || [], ''] }
                                        }))}
                                    />
                                    </div>
                                </div>
                            </div>
                            ))}
                    </div>
                    <button className="add-los-btn" onClick={handleAddLos}> Add new program  </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LosPage