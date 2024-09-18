import { useSelector } from "react-redux";
import { Card, Container, Button } from "react-bootstrap";
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

    const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>, field: string | null) => {
        e.preventDefault();
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
            <div className="input-titles"><strong>{title}</strong></div>
            <Card >
                 {fields.map((field, index) => (
                    <div key={index} className="input-section-container">
                        <textarea
                        ref={el => textAreasRef.current[index] = el}
                        value={field}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={(e) => handleDragOver(e, field)}
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
                ))}
                <button 
                    onClick={addField}
                    className="add-input-button"
                >
                    +</button>
            </Card>
        </Container>
    );
};

const LosMapper = () => {
    const dispatch = useAppDispatch();

    const [inputFields, setInputFields] = useState<string[]>(['']);
    const [activityFields, setActivityFields] = useState<string[]>(['']);
    const [outputFields, setOutputFields] = useState<string[]>(['']);
    const [usageFields, setUsageFields] = useState<string[]>(['']);
    const [outcomeFields, setOutcomeFields] = useState<string[]>(['']);

    const pitchId = useSelector((state: RootState) => state.user?.user?.pitchId);
    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const los = useSelector((state: RootState) => state.los?.los?.id === pitchId ? state.los.los : null);
    const pitch = useSelector((state: RootState) => state.pitch?.pitch?.id === pitchId ? state.pitch.pitch : null);

    useEffect(() => {
        if (pitchId && !los) {
            dispatch(fetchLos(pitchId));
        }
        
        if (los) {
            setInputFields(los.inputs || ['']);
            setActivityFields(los.activities || ['']);
            setOutcomeFields(los.outcomes || ['']);
            setUsageFields(los.usages || ['']);
            setOutputFields(los.outputs || ['']);
        }
        
    }, [los, dispatch, pitchId]);

    const updateLos = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (userId) {
            const updatedLos: Los = {
                id: parseInt(pitchId),
                inputs: inputFields,
                activities: activityFields,
                outputs: outputFields,
                usages: usageFields,
                outcomes: outcomeFields,
                userId: parseInt(userId)
            };
            dispatch(editLos(updatedLos));
            dispatch(notifySuccess("Saved"));
        } else {
            console.error('User ID is not available');
            dispatch(notifyError("Error updating line-of-sight"));
        }
    };

    return (
        <div className="content">
        <Header/>
        <Button className="save-button" onClick={updateLos}> Save </Button>
        <div className="los-container" style={{display: "flex"}}>
            {/* Column 1 */}
            <div className="accordion-container">
                <AccordionWidget/>
            </div> 
            {/* Column 2 */}
            <div className="user-los-container">
                {/* Column 2 row 1 */}
                <Card className="title-card">
                    <strong>{pitch?.title}</strong>
                </Card>
                {/* Column 2 row 2 */}
                <Card className="details-card">
                    <div style={{ display: 'inline' }}>
                        {pitch?.mainActivity}
                        <span>&nbsp;</span>{pitch?.challenge}
                        <span>&nbsp;</span>{pitch?.outcome}
                    </div>
                </Card>
                {/* Column 2 row 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-around'}}>
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
