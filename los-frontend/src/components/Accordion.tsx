import { Accordion } from "react-bootstrap";
import { activityAnswers, outcomeAnswers, outputAnswers, usageAnswers } from "../data";

const AccordionWidget = () => {

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, answer: string) => {
        e.dataTransfer.setData("text/plain", answer);
    };

    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Activities</Accordion.Header>
                <Accordion.Body>
                    {activityAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        className="answer-box">
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>Outputs</Accordion.Header>
                <Accordion.Body>
                    {outputAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        className="answer-box"
                        >
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Accordion.Header>Usages</Accordion.Header>
                <Accordion.Body>
                    {usageAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        className="answer-box">
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Accordion.Header>
                    Outcomes and impacts</Accordion.Header>
                <Accordion.Body>
                    {outcomeAnswers.map((answer: string, index: number) => (
                        <div 
                        key={index}  
                        draggable
                        onDragStart={(e) => handleDragStart(e, answer)}
                        className="answer-box">
                            {answer} 
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default AccordionWidget;
