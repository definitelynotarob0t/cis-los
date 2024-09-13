import { Accordion } from "react-bootstrap";
import { inputAnswers, activityAnswers, outcomeAnswers, outputAnswers, usageAnswers } from "../data";

const AccordionWidget = () => {

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, answer: string) => {
        e.dataTransfer.setData("text/plain", answer);
    };

    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header style={{fontSize: '20px'}}>Inputs</Accordion.Header>
                <Accordion.Body>
                    {inputAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        style={{ cursor: "grab", marginBottom: "5px", border: "2px solid"}}>
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header style={{fontSize: '20px'}}>Activities</Accordion.Header>
                <Accordion.Body>
                    {activityAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        style={{ cursor: "grab", marginBottom: "5px", border: "2px solid" }}>
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Accordion.Header style={{fontSize: '20px'}} >Outputs</Accordion.Header>
                <Accordion.Body>
                    {outputAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        style={{ cursor: "grab", marginBottom: "5px", border: "2px solid" }}>
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Accordion.Header style={{fontSize: '20px'}} >Usages</Accordion.Header>
                <Accordion.Body>
                    {usageAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        style={{ cursor: "grab", marginBottom: "5px", border: "2px solid" }}>
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
                <Accordion.Header style={{fontSize: '20px'}} >Outcomes and impacts</Accordion.Header>
                <Accordion.Body>
                    {outcomeAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        style={{ cursor: "grab", marginBottom: "5px", border: "2px solid" }}>
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default AccordionWidget;