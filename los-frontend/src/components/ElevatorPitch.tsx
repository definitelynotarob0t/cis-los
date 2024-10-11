import { SyntheticEvent, useState, useEffect } from "react";
import { editPitch } from "../reducers/pitchReducer";
import { useAppDispatch } from "../hooks";
import { Pitch } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import Header from "./Header";
import Footer from "./Footer";
import { Form, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import pitchService from "../services/pitchService";

const ElevatorPitch = () => {
  const [title, setTitle] = useState("");
  const [mainActivity, setMainActivity] = useState("");
  const [challenge, setChallenge] = useState("");
  const [outcome, setOutcome] = useState("");

  const dispatch = useAppDispatch();

  const userId = useSelector((state: RootState) => state.user?.user?.id);

  const { pitchId, programId } = useParams<{ pitchId: string; programId: string }>(); 
  let pitchIdNumber = Number(pitchId);
  let programIdNumber = Number(programId)

  useEffect(() => {
    const fetchProgramPitch = async () => {
      try {
        if (pitchIdNumber) {
          const pitch = await pitchService.getPitch(pitchIdNumber);

          // Populate the form with fetched pitch data
          setTitle(pitch.title || "");
          setMainActivity(pitch.mainActivity || "");
          setChallenge(pitch.challenge || "");
          setOutcome(pitch.outcome || "");
        }
      } catch (error) {
        dispatch(notifyError("Error fetching pitch"));
      } 
    };

    fetchProgramPitch();
  }, [pitchIdNumber, dispatch]);

  // Update pitch
  const updatePitch = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (userId && pitchIdNumber !== undefined) {
      const updatedPitch: Pitch = {
        id: pitchIdNumber,
        title,
        mainActivity,
        challenge,
        outcome,
        userId,
        programId: programIdNumber
      };
      dispatch(editPitch(updatedPitch));
      dispatch(notifySuccess("Saved"));
    } else {
      console.error("User ID is not available");
      dispatch(notifyError("Error updating pitch"));
    }
  };

  return (
    <div className="content">
      <Header updateUserInputs={updatePitch} />
      <div className="pitch-content">
        <Form className="pitch-form" onSubmit={updatePitch}>
          <Form.Group>
            <Form.Label style={{ fontSize: "18px" }}>
              <strong> Project Title</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pitch-input"
              placeholder="Med Tech Australia"
              rows={1}
              style={{ resize: "none" }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontSize: "18px" }}>
              In one sentence, what <strong>challenge</strong> is your program
              addressing?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="pitch-input"
              placeholder="Australia’s health sector relies on imports for ~95% of its med tech, yet faces significant supply chain challenges, highlighting critical vulnerabilities and the urgent need for targeted local manufacturing and improved supply chain resilience."
              rows={3}
              style={{ resize: "none" }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontSize: "18px" }}>
              In one sentence, what is your <strong>main activity?</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={mainActivity}
              onChange={(e) => setMainActivity(e.target.value)}
              className="pitch-input"
              placeholder="Med Tech Australia will identify, design and implement sovereign med tech products, leveraging existing capabilities and addressing specific needs."
              rows={3}
              style={{ resize: "none" }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontSize: "18px" }}>
              In one sentence, what is the <strong>outcome</strong> (change) you are trying to achieve?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="pitch-input"
              placeholder="This will enhance healthcare resilience, ensure reliable access to critical medical supplies, improve patient outcomes, and foster a robust med tech industry that reduces dependency on international supply chains."
              rows={3}
              style={{ resize: "none" }}
            />
          </Form.Group>
        </Form>

        <Card className="pitch-card">
          <h1>{title}</h1>
          <div style={{ display: "inline" }}>
            {challenge}
            <span>&nbsp;</span>
            {mainActivity}
            <span>&nbsp;</span>
            {outcome}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ElevatorPitch;
