import { useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import React, { useState, useEffect, SyntheticEvent } from "react";
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

    const handleInputChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index] = value;
        setFields(updatedFields);
    };

    const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>, index: number) => {
        const draggedData = e.dataTransfer.getData("text");
        const updatedFields = [...fields];
        updatedFields[index] = draggedData;
        setFields(updatedFields);
        e.preventDefault();
    };

    const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
    };

    return (
        <Container>
            <div style={{backgroundColor: 'rgb(28, 63, 93)', color: 'white', textAlign: 'center', fontSize: '18px'}}>{title}</div>
            <Card style={{ height: '300px' }}>
                {fields.map((field, index) => (
                    <textarea
                        key={index}
                        value={field}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        style={{ display: 'block', marginBottom: '10px', height: 'auto' }}
                    />
                ))}
                <button onClick={addField}>+</button>
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
        <div>
            <Header/>
            <Card style={{backgroundColor: 'rgb(28, 63, 93)', color: 'white', textAlign: 'center', fontSize: '18px'}}>
                <strong>{pitch?.title}</strong>
            </Card>
            <Card style={{ display: 'flex', padding: '8px', border: 'white' }}>
                <div style={{ display: 'inline' }}>
                    {pitch?.mainActivity}
                    <span>&nbsp;</span>{pitch?.challenge}
                    <span>&nbsp;</span>{pitch?.outcome}
                </div>
            </Card>
            <button onClick={updateLos}> Save </button>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <AccordionWidget />
                <InputSection title="Inputs" fields={inputFields} setFields={setInputFields} addField={() => setInputFields([...inputFields, ''])} />
                <InputSection title="Activities" fields={activityFields} setFields={setActivityFields} addField={() => setActivityFields([...activityFields, ''])} />
                <InputSection title="Outputs" fields={outputFields} setFields={setOutputFields} addField={() => setOutputFields([...outputFields, ''])} />
                <InputSection title="Usages" fields={usageFields} setFields={setUsageFields} addField={() => setUsageFields([...usageFields, ''])} />
                <InputSection title="Outcomes and Impacts" fields={outcomeFields} setFields={setOutcomeFields} addField={() => setOutcomeFields([...outcomeFields, ''])} />
            </div>
            <Footer/>
        </div>
    );
};

export default LosMapper;
