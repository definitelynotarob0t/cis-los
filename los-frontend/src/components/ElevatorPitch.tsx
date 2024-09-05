import { SyntheticEvent, useState, useEffect } from "react"
import {  TextField } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import {Container} from "@mui/material";
import { createPitch, removePitch } from "../reducers/pitchReducer"
import { useAppDispatch } from "../hooks";
import { Content } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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
        if (pitch) {
            setTitle(pitch.title || '');
            setMainActivity(pitch.mainActivity || '');
            setChallenge(pitch.challenge || '');
            setOutcome(pitch.outcome || '');
        }
    }, [pitch]);

    const clearInputs = async (event: SyntheticEvent) => {
        event.preventDefault()

        if (userId) {
            dispatch(removePitch())
        } else {
            console.error('User ID is not available');
        }

        setTitle('');
        setMainActivity('');
        setChallenge('');
        setOutcome('');
    }

    // Add or update pitch
    const addPitch = async (event: SyntheticEvent) => {
        event.preventDefault()

        if (userId) {
            const pitchToAdd: Content = {
                title,
                mainActivity,
                challenge,
                outcome,
                userId: parseInt(userId)
            }
            dispatch(createPitch(pitchToAdd))
        } else {
            console.error('User ID is not available');
        }
    }

    return (
        <div style={{ display: 'flex',flexDirection: 'row', height: '90vh', gap: '16px'}}>
            <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '50%', height: '100%'}} 
            onSubmit={addPitch}
            >
            <TextField
            label="Project Title"
            placeholder="e.g. Program Run Fast" 
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <TextField
            label="In one sentence what is your main activity?"
            placeholder="e.g. We will design and implement a structured training plan with four weekly runs over varying distances, terrains and speeds."
            value={mainActivity}
            onChange={({ target }) => setMainActivity(target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <TextField
            label="In one sentence, what challenge is your program addressing?"
            placeholder="e.g. This will address the club’s declining performance compared to competitors. "
            value={challenge}
            onChange={({ target }) => setChallenge(target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <TextField
            label="In one sentence, what is the outcome (change) you are trying to achieve?"
            placeholder="e.g. It will enhance runners’ performance, increasing the likelihood of winning more races and achieving national recognition as the top run club."
            value={outcome}
            onChange={({ target }) => setOutcome(target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <button type="submit">Save</button>   {/* notify user that it has been saved  */}
            <button onClick = {clearInputs}>Clear</button> {/* make a popup dialog to ask user if they are sure they want to clear  */}
            </form>
            <Container style={{fontSize: '25px', display: 'flex', flexDirection: 'column', width: '50%'}}>
            <FormatQuoteIcon fontSize="large" style={{ transform: 'scaleX(-1)' }} />
                 <h1>{title}</h1> 
                <div style={{ display: 'inline' }}>
                    {mainActivity}<span>&nbsp;</span>{challenge}<span>&nbsp;</span>{outcome}
                </div>
                <FormatQuoteIcon fontSize="large"/>
            </Container>
        </div>
       

    )
}

export default ElevatorPitch