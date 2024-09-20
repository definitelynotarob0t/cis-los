import { useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import React, { useState, useEffect, SyntheticEvent, useRef } from "react";
import AccordionWidget from "./Accordion";
import { fetchLos, editLos } from "../reducers/losReducer";
import { useAppDispatch } from "../hooks";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import { Los } from "../types";
import Header from "./Header";
import Footer from "./Footer";

// Reusable component for dynamic input sections
const InputSection = ({ title, fields, setFields, addField}: 
    { title: string, fields: string[], setFields: React.Dispatch<React.SetStateAction<string[]>>, addField: () => void}) => {


    const textAreasRef = useRef<(HTMLTextAreaElement | null)[]>([]);

    const handleInputChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index] = value;
        setFields(updatedFields);


        let fieldTitle = title.toLowerCase()
        if (title === 'Outcomes and Impacts') {
            fieldTitle = "outcomes"
        } 

        // Save the updated field in localStorage with dynamic keys
        const storedLosData = JSON.parse(localStorage.getItem('losData') || '{}');
        const losData = {
            ...storedLosData,
            [fieldTitle]: updatedFields 
        };
        localStorage.setItem('losData', JSON.stringify(losData));


        setTimeout(() => resizeTextArea(index), 0);
    };

    const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>, index: number) => {
        const draggedData = e.dataTransfer.getData("text");
        const updatedFields = [...fields];
        updatedFields[index] = draggedData;
        setFields(updatedFields);

        e.preventDefault();

        setTimeout(() => resizeTextArea(index), 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement> ) => {
        e.preventDefault();  // Allows fields to be valid drop target
    };


    const handleDeleteField = (index: number) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);

    };

    const resizeTextArea = (index: number) => {
        const textarea = textAreasRef.current[index];
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to calculate scrollHeight
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
        }
    };

    useEffect(() => {
        fields.forEach((_, index) => {
            setTimeout(() => resizeTextArea(index), 0);
        });
    }, [fields]);


    return (
        <Container>
            <div className="input-titles">{title}</div>
            <Card >
                {/* Default blank textarea */}
                {fields.length === 0 ? (
                    <textarea
                    className="input-textarea"
                    value={""}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                    onDrop={(e) => handleDrop(e, 0)}
                    onDragOver={(e) => handleDragOver(e)}
                />                          
                ) : (
                 fields.map((field, index) => (
                    <div key={index} className="input-section-container" >
                        <textarea
                        ref={el => textAreasRef.current[index] = el}
                        value={field}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={(e) => handleDragOver(e)}
                        data-index={index}  
                        className="input-textarea"   
                        />
                    {field === '' && (
                        <button
                            onClick={() => handleDeleteField(index)}
                            className="delete-input"
                        >
                    x
                    </button>
                    )}
                    </div>
                ))
                )}
                <button onClick={addField} className="add-input-button" >
                    +
                </button>
            </Card>
        </Container>
    );
};

const LosMapper = () => {
    const dispatch = useAppDispatch();

    const [inputFields, setInputFields] = useState<string[]>(['']);
    const [activityFields, setActivityFields] = useState<string[]>(['',]);
    const [outputFields, setOutputFields] = useState<string[]>(['']);
    const [usageFields, setUsageFields] = useState<string[]>(['']);
    const [outcomeFields, setOutcomeFields] = useState<string[]>(['']);

    const pitchId = useSelector((state: RootState) => state.user?.user?.pitchId);
    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const los = useSelector((state: RootState) => state.los?.los?.id === pitchId ? state.los.los : null);
    const pitch = useSelector((state: RootState) => state.pitch?.pitch?.id === pitchId ? state.pitch.pitch : null);

    // Pre-fill fields
    useEffect(() => {
        const localLos = localStorage.getItem('losData');
        if (localLos) { // If user has made changes, fetch LOS from local storage
            const storedLos = JSON.parse(localLos);
            setInputFields(storedLos.inputs || ['']);
            setActivityFields(storedLos.activities || ['']);
            setOutcomeFields(storedLos.outcomes || ['']);
            setUsageFields(storedLos.usages || ['']);
            setOutputFields(storedLos.outputs || ['']);
        } else if (pitchId && !los) { // If user hasn't made changes and no LOS is found in redux, fetch LOS from API (initial load)
            dispatch(fetchLos(pitchId));
        }
    
        if (los && !localLos) { // If user hasn't made changes and LOS is found in redux, fetch LOS from redux
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
        if (userId && pitchId !== undefined) {
            const updatedLos: Los = {
                id: pitchId,
                inputs: inputFields,
                activities: activityFields,
                outputs: outputFields,
                usages: usageFields,
                outcomes: outcomeFields,
                userId: userId
            };

            dispatch(editLos(updatedLos));
            dispatch(notifySuccess("Saved"));

            localStorage.removeItem('losData');
        } else {
            console.error('User ID is not available');
            dispatch(notifyError("Error updating line-of-sight"));
        }
    };

    return (
        <div className="content">
        <Header updateLos={updateLos} />
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
