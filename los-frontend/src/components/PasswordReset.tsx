import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import userService from '../services/userService';
import { notifySuccess } from '../reducers/notificationReducer';
import { notifyError } from '../reducers/errorReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';



const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const dispatch = useDispatch<AppDispatch>();



    const handleResetPassword = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        try {
            if (password !== confirmPassword) {
                dispatch(notifyError("Passwords do not match"));
                return;
            }

            await userService.resetPassword({ token, email, newPassword: password });
            dispatch(notifySuccess("Password has been reset successfully."));
        } catch (error) {
            dispatch(notifyError("Error resetting password"));
        }
    };

    return (
        <div className="reset-password-container">
            <h1>Reset Password</h1>
            <Form onSubmit={handleResetPassword}>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{width: '300px', marginBottom: '10px'}}
                        isInvalid={password.length > 0 && password.length < 8}
                    />
                <Form.Control.Feedback type="invalid">Password must be at least 8 characters</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{width: '300px'}}
                        isInvalid={password!=confirmPassword}
                    />
                <Form.Control.Feedback type="invalid">Passwords must match</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" style={{marginTop: '15px',  backgroundColor: ' rgb(11, 64, 96)'}}>Reset Password</Button>
            </Form>
        </div>
    );
};

export default ResetPasswordForm;

