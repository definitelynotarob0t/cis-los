import { Card, Container } from "react-bootstrap";
import React, { useState } from "react";
import { removeLos } from "../reducers/losReducer";
import { useAppDispatch } from "../hooks";
import { notifyError } from "../reducers/errorReducer";
import { Los } from "../types";


// Reusable component for dynamic input sections
const InputSection = ({ title, fields, setFields, addField}: 
    { title: string, fields: string[] , setFields: React.Dispatch<React.SetStateAction<string[]>>, addField: () => void}) => {

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
                     <div key={index} className="input-section-container">
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

interface LosMapperProps {
    los: Los;
}

const LosMapper: React.FC<LosMapperProps> = ({ los }) => {
const [activityFields, setActivityFields] = useState(los.activities || [''])
const [outputFields, setOutputFields] = useState(los.outputs || [''])
const [usageFields, setUsageFields] = useState(los.usages || [''])
const [outcomeFields, setOutcomeFields] = useState(los.outcomes || [''])

const dispatch = useAppDispatch();

const handleDeleteLos = async (losId: number) => {
    try {
        await dispatch(removeLos(losId))
    } catch (error) {
        dispatch(notifyError("Error deleting project"))
    }
}

return (
        <div className="user-los-container">
            <div className="titles-answers-container">
                <React.Fragment key={los.id}>
                    <h1 className="project-number">
                        <strong>Project ### </strong> 
                        <button
                            onClick={() => handleDeleteLos(los.id) }
                            className="delete-los-btn"
                        >
                            Delete Project
                        </button>
                        </h1>  
                    <div className="individual-answers-container">
                        <InputSection 
                            title="Activities" 
                            fields={activityFields} 
                            setFields={setActivityFields} 
                            addField={() => setActivityFields([...activityFields, ''])} 
                        />
                        <InputSection 
                            title="Outputs" 
                            fields={outputFields}
                            setFields={setOutputFields} 
                            addField={() => setOutputFields([...outputFields, ''])} 
                        />
                        <InputSection 
                            title="Usages" 
                            fields={usageFields}
                            setFields={setUsageFields} 
                            addField={() => setUsageFields([...usageFields, ''])} 
                        />
                        <InputSection 
                            title="Outcomes and Impacts" 
                            fields={outcomeFields} 
                            setFields={setOutcomeFields} 
                            addField={() => setOutcomeFields([...outcomeFields, ''])} 
                        />
                    </div>
                </React.Fragment>
            </div>
        </div>
);
};

export default LosMapper;
