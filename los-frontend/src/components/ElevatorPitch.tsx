import { SyntheticEvent, useState, useEffect } from "react"
import { fetchPitch, editPitch } from "../reducers/pitchReducer"
import { useAppDispatch } from "../hooks";
import { Pitch } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";
import Header from "./Header";
import Footer from "./Footer";
import { Form, Button, Card } from "react-bootstrap";


const ElevatorPitch = () => {
    const [title, setTitle] = useState('')
    const [mainActivity, setMainActivity] = useState('')
    const [challenge, setChallenge] = useState('')
    const [outcome, setOutcome] = useState('')

    const pitchId = useSelector((state: RootState) => state.user?.user?.pitchId);
    const userId = useSelector((state: RootState) => state.user?.user?.id);

    // Find the pitch based on the pitchId from identified user
    let pitch = useSelector((state: RootState) => {
        return state.pitch?.pitch?.id === pitchId ? 
        state.pitch.pitch 
        : null
    });

    const dispatch = useAppDispatch()

    // Pre-fill input fields if a pitch exists
    useEffect(() => {
        if (pitchId && !pitch) {
            // Fetch the pitch if it isn't found in the Redux state
            dispatch(fetchPitch(pitchId));
        }

        if (pitch) {
            setTitle(pitch.title || '');
            setMainActivity(pitch.mainActivity || '');
            setChallenge(pitch.challenge || '');
            setOutcome(pitch.outcome || '');
        }
    }, [pitch, dispatch, pitchId]);

    // Update pitch
    const updatePitch = async (event: SyntheticEvent) => {
        event.preventDefault()

        if (userId) {
            const updatedPitch: Pitch = {
                id: parseInt(pitchId),
                title,
                mainActivity,
                challenge,
                outcome,
                userId: parseInt(userId)
            }
            dispatch(editPitch(updatedPitch))

            dispatch(notifySuccess("Saved"))
        } else {
            console.error('User ID is not available');
            dispatch(notifyError('Error updating pitch'))
        }
    }

    return (
        <div className="content">
            <Header />
            <div className="pitch-content">
                <Form className="pitch-form"
                onSubmit={updatePitch}>
                    <Form.Group>
                        <Form.Label style={{fontSize: '18px' }}> <strong> Project Title</strong> </Form.Label>
                        <Form.Control
                        type='text'
                        placeholder="e.g. Program Run Fast" 
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        className="pitch-input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize: '18px' }}> In one sentence, what is your <strong>main activity?</strong> </Form.Label>
                        <Form.Control
                        as="textarea" 
                        placeholder="e.g. We will design and implement a structured training plan with four weekly runs over varying distances, terrains and speeds."
                        value={mainActivity}
                        onChange={({ target }) => setMainActivity(target.value)}
                        className="pitch-input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize: '18px' }}> In one sentence, what <strong>challenge</strong> is your program addressing? </Form.Label>
                        <Form.Control
                        as="textarea" 
                        placeholder="e.g. This will address the club’s declining performance compared to competitors. "
                        value={challenge}
                        onChange={({ target }) => setChallenge(target.value)}
                        className="pitch-input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize: '18px' }}> In one sentence, what is the <strong>outcome</strong> (change) you are trying to achieve? </Form.Label>
                        <Form.Control
                        as="textarea" 
                        placeholder="e.g. It will enhance runners’ performance, increasing the likelihood of winning more races and achieving national recognition as the top run club."
                        value={outcome}
                        onChange={({ target }) => setOutcome(target.value)}
                        className="pitch-input"
                        />
                    </Form.Group>
                    <Button type="submit" className="save-button">SAVE</Button> 
                </Form>
     
                <Card className="pitch-card">
                    <h1>{title}</h1> 
                    <div style={{ display: 'inline' }}>
                        {mainActivity}<span>&nbsp;</span>{challenge}<span>&nbsp;</span>{outcome}
                    </div>
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default ElevatorPitch