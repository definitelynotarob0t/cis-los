import { SyntheticEvent, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/userReducer';
import userService from '../services/userService';
import { notifySuccess } from '../reducers/notificationReducer';
import { notifyError } from '../reducers/errorReducer';
import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';
import { useNavigate } from 'react-router-dom'


const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const dispatch = useDispatch<AppDispatch>(); 
    const navigate = useNavigate();


    const handleLogin = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            await dispatch(setUser({ email, password }));
            navigate('/elevator-pitch')
            setEmail("");
            setPassword("");
        } catch (error) {
            dispatch(notifyError('Error logging in'));
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }; 

    const handleSignUp = async (event: SyntheticEvent) => {
        event.preventDefault()

        // Password validation -- handle elsewhere? e.g. during typing of password
        if (passwordConfirm !== password) {
            dispatch(notifyError("Passwords do not match"))
            return;
        } 
        if (password.length < 8) {
            dispatch(notifyError("Password must be 8 characters or longer"));
            return;
        }

        // Email validation
        if (!validateEmail(email)) {
            dispatch(notifyError("Please enter a valid email"))
            return;
        }
        
        // Create user
        try {
            await userService.createUser({ email, password, name }); // Credentials sent to API, no state update until user logs-in
            dispatch(notifySuccess("Account created"))

        } catch (error) {
            dispatch(notifyError('Error signing up'))
        }

    }
    return (
        <div>
        <  ErrorNotification />
        < SuccessNotification />
        <Container
            fluid
            className="d-flex vh-100 align-items-center justify-content-center"
        >
            <Row>
                <Col>
                    <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "No account? Sign-up" : "Already have an account? Login"}
                    </Button>
                    <h1>{isLogin ? "Login" : "Sign-up"}</h1>
                    <Form onSubmit={isLogin ? handleLogin : handleSignUp}>
                    {!isLogin && (
                        <Form.Group>
                            <Form.Label> Name </Form.Label>
                            <Form.Control 
                                data-testid="name"
                                type="text"
                                name="name"
                                value={name}
                                onChange={({ target }) => setName(target.value)}
                                />
                        </Form.Group>
                    )}
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label> Email </Form.Label>
                        <Form.Control
                            data-testid="email"
                            type="text"
                            value={email}
                            name="email"
                            onChange={({ target }) => setEmail(target.value)}
                        />
                    </Form.Group>
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label> Password </Form.Label> 
                        {/* tell user must be 8 characters at least. Forgot password option? */}
                        <Form.Control
                            data-testid="password"
                            type="password"
                            name="name"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </Form.Group>
                    {!isLogin && (
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label> Confirm password </Form.Label>
                        <Form.Control
                            data-testid="password-confirm"
                            type="password"
                            name="passwordConfirm"
                            value={passwordConfirm}
                            onChange={({ target }) => setPasswordConfirm(target.value)}
                        />
                    </Form.Group>  
                    )}
                    <Button variant="primary" type="submit" style={{marginTop: '10px'}}>
                            {isLogin ? "Login" : "Sign-up"}
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default SignupForm