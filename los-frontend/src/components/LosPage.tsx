import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import React, { useState, useEffect, SyntheticEvent } from "react";
import AccordionWidget from "./Accordion";
import { fetchLoses, editLos, addLos, removeLos } from "../reducers/losReducer";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los, Pitch } from "../types";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import DOMPurify from 'dompurify';

interface inputSectionProps {
    title: string,
    fields: string[],
    setFields: React.Dispatch<React.SetStateAction<string[]>>,
    addField: () => void, 
}


const InputSection: React.FC<inputSectionProps> = ({ title, fields, setFields, addField }) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleInputBlur = (index: number, event: React.FocusEvent<HTMLDivElement>) => {
        const updatedFields = [...fields];

        const sanitizedContent = DOMPurify.sanitize(event.currentTarget.textContent || '',  {
            ALLOWED_TAGS: [], // No HTML tags allowed
            ALLOWED_ATTR: [], // No attributes allowed
          }); // Strict sanitising : only plain text allowed

    
        updatedFields[index] = sanitizedContent;
        setFields(updatedFields);
        setFocusedIndex(null);
    };

    const handleInputFocus = (index: number) => {
        setFocusedIndex(index); 
    };

    // Handle paste event to strip out formatting and allow only plain text
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();

        // Get plain text from clipboard and insert it
        const text = event.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const getTooltip = (title: string) => {
        switch (title) {
            case 'Activities':
                return 'Describe what you will do to achieve your outputs, including e.g. R&D methodologies, educational initiatives and commercialisation efforts.';
            case 'Outputs':
                return 'Describe the tangible results your project will deliver upon completion.';
            case 'Usages':
                return 'Describe who will use the outputs, how they will be used and the types of costs they will incur.';
            case 'Outcomes and Impacts':
                return 'Describe the outcomes and how they will drive economic, social and environmental impacts.';
            default:
                return '';
        }
    };


    return (
        <Container>
            <div 
            className="input-titles"
            id={`${title}-title`}
            data-tooltip={getTooltip(title)} // Conditionally render tooltip content
            >
                {title}
            </div>
            <Card style={{ border: 'none' }}>
                {fields.map((field, index) => (
                    <div key={index} className="input-section-container">
                        <div
                            contentEditable
                            onBlur={(e) => handleInputBlur(index, e)}
                            onFocus={() => handleInputFocus(index)}
                            onPaste={handlePaste} 
                            suppressContentEditableWarning
                            className="input-contenteditable"
                            ref={(el) => {
                            if (el) {
                                el.textContent = field || ""; // Set text content
                            }
                            }}
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

    // Initialise state for each LoS when filteredLoses change
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

        let hasError = false; 

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

                try { // Try to update each LoS individually
                    await dispatch(editLos(updatedLos));
                } catch (error) {
                    hasError = true;
                    console.error(`Error while saving line-of-sight with ID ${losId}:`, error);
                }
            }

            if (hasError) {
                dispatch(notifyError("Error saving"));
            } else {
                dispatch(notifySuccess("Saved"));
            }

        } catch (error) {
            dispatch(notifyError("Unexpected error occurred while saving."));
            console.error("Unexpected error while saving line-of-sight entries:", error);
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
    
                const addedLos = await dispatch(addLos(newLos));
                                
                if (addedLos?.id) {
                    // Add the newly add LoS to the local state
                    setLosStates((prevStates) => ({
                        ...prevStates,
                        [addedLos.id]: {
                            activities: addedLos.activities || [''],
                            outputs: addedLos.outputs || [''],
                            usages: addedLos.usages || [''],
                            outcomes: addedLos.outcomes || [''],
                        },
                    }));
                }
            }
        } catch (error) {
            dispatch(notifyError("Error adding a new project"));
            console.error("Error while adding a new line of sight:", error);
        }
    };


    const handleDeleteLos = async (losId: number) => {
        try {
            await dispatch(removeLos(losId));    
            setLosStates((prevStates) => {
                const newStates = { ...prevStates };
                delete newStates[losId]; // Remove the deleted LoS from the state
                return newStates;
            });

        } catch (error) {
            dispatch(notifyError("Error deleting line project"));
            console.error("Error deleting project line-of-sight:", error);
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
                            <div style={{ color: 'gray' }}>Title will go here</div>
                        }
                    </Card>

                    <Card className="details-card">
                        <div style={{ display: 'inline' }}>
                            {pitch?.mainActivity ? (
                                <div>
                                    <span>{pitch?.challenge}</span>
                                    <span>&nbsp;</span>{pitch?.mainActivity}
                                    <span>&nbsp;</span>{pitch?.outcome}
                                </div>
                            ) :
                                <div style={{ color: 'lightGray' }}>
                                    Elevator Pitch will go here.
                                .</div>
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