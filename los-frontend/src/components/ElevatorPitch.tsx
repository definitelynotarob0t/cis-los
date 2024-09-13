import { SyntheticEvent, useState, useEffect } from "react"
import {  TextField, Container } from '@mui/material'; // change to Bootstrap?
// import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { fetchPitch, editPitch } from "../reducers/pitchReducer"
import { useAppDispatch } from "../hooks";
import { Pitch } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { notifySuccess } from "../reducers/notificationReducer";
import { notifyError } from "../reducers/errorReducer";


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
        <div style={{ display: 'flex',flexDirection: 'row', height: '71vh', gap: '16px', margin: '10px'}}>
            <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '50%', overflowY: 'auto'}} 
            onSubmit={updatePitch}
            >
            <TextField
                label="Project Title"
                placeholder="e.g. Program Run Fast" 
                value={title}
                onChange={({ target }) => setTitle(target.value)}
                style={{ width: '100%', marginBottom: '16px', marginTop: '5px'}}
                InputLabelProps={{ shrink: true }}
                maxRows={1}
            />
            <TextField
                label="In one sentence what is your main activity?"
                placeholder="e.g. We will design and implement a structured training plan with four weekly runs over varying distances, terrains and speeds."
                value={mainActivity}
                onChange={({ target }) => setMainActivity(target.value)}
                style={{ width: '100%', marginBottom: '16px' }}
                InputLabelProps={{ shrink: true }}
                multiline
                maxRows={3}
            />
            <TextField
                label="In one sentence, what challenge is your program addressing?"
                placeholder="e.g. This will address the club’s declining performance compared to competitors. "
                value={challenge}
                onChange={({ target }) => setChallenge(target.value)}
                style={{ width: '100%', marginBottom: '16px' }}
                InputLabelProps={{ shrink: true }}
                multiline
                maxRows={3}
            />  
            <TextField
                label="In one sentence, what is the outcome (change) you are trying to achieve?"
                placeholder="e.g. It will enhance runners’ performance, increasing the likelihood of winning more races and achieving national recognition as the top run club."
                value={outcome}
                onChange={({ target }) => setOutcome(target.value)}
                style={{ width: '100%', marginBottom: '16px' }}
                InputLabelProps={{ shrink: true }}
                multiline
                maxRows={3}
            />
            <button type="submit">Save</button>   {/* notify user that it has been saved  */}
            </form>
            <Container 
            style={{fontSize: '25px', display: 'flex', flexDirection: 'column', flex: 1, width: '50%', border: '3px solid', overflowY: 'auto'}}>
            {/* <FormatQuoteIcon fontSize="large" style={{ transform: 'scaleX(-1)' }} /> */}
                 <h1 style={{marginTop: '10px'}}>{title}</h1> 
                <div style={{ display: 'inline' }}>
                    {mainActivity}<span>&nbsp;</span>{challenge}<span>&nbsp;</span>{outcome}
                </div>
                {/* <FormatQuoteIcon fontSize="large"/> */}
            </Container>
        </div>
       

    )
}

export default ElevatorPitch