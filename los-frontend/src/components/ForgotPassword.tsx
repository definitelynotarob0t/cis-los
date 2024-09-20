import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import userService from '../services/userService';
import { notifySuccess } from '../reducers/notificationReducer';
import { notifyError } from '../reducers/errorReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const handleForgotPassword = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        try {
            await userService.forgotPassword({ email });
            dispatch(notifySuccess(`Password reset link has been sent to your email`));
        } catch (error) {
            dispatch(notifyError("Error sending reset email. Please try again."));
        }
    };

    return (
        <div className="forgot-password-container">
            <h1 >Forgot Password?</h1>
            <Form onSubmit={handleForgotPassword}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{width: '300px'}}
                    />
                </Form.Group>
                <Button type="submit" style={{marginTop: '15px', backgroundColor: ' rgb(11, 64, 96)'}}>Email Reset Link</Button>
            </Form>
        </div>
    );
};

export default ForgotPasswordForm;
