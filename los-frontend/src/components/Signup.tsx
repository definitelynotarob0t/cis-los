import { SyntheticEvent, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
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

        // Password validation
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
        <div style={{ backgroundColor: 'white', minHeight: '100vh'}} >
        < ErrorNotification />
        < SuccessNotification />
        < Container
            fluid
            className="d-flex vh-100 flex-start"
            style={{ minHeight: '100vh' }}
        >
            <Card className="p-4" style={{ backgroundColor: '#d3d3d3' }}>
            <Row className="w-200">
                <Col >
                    <h1>{isLogin ? "Log in" : "Sign up"}</h1>
                    <Form onSubmit={isLogin ? handleLogin : handleSignUp}>
                    {!isLogin && (
                        <Form.Group>
                            <Form.Label style={{fontSize: '14px'}}> Name </Form.Label>
                            <Form.Control 
                                type="text"
                                name="name"
                                value={name}
                                onChange={({ target }) => setName(target.value)}
                                />
                        </Form.Group>
                    )}
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label style={{fontSize: '14px'}}> Email </Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            name="email"
                            onChange={({ target }) => setEmail(target.value)}
                        />
                    </Form.Group>
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label style={{fontSize: '14px'}}> Password </Form.Label> 
                        <Form.Control
                            type="password"
                            name="name"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            isInvalid={password.length > 0 && password.length < 8}
                        />
                        <Form.Control.Feedback type="invalid">Password must be 8 characters or longer</Form.Control.Feedback>
                    </Form.Group>
                    {!isLogin && (
                    <Form.Group style={{marginTop: '10px'}}>
                        <Form.Label style={{fontSize: '14px'}}> Confirm password </Form.Label>
                        <Form.Control
                            type="password"
                            name="passwordConfirm"
                            value={passwordConfirm}
                            onChange={({ target }) => setPasswordConfirm(target.value)}
                            isInvalid={password!=passwordConfirm}
                        />
                    <Form.Control.Feedback type="invalid">Passwords must match</Form.Control.Feedback>
                    </Form.Group>  
                    )}
                    {isLogin && ( 
                    <div style={{ marginTop: '10px', fontSize:'12px'}}>
                        <a href="/forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Forgot password? 
                        </a>
                    </div>
                    )} 
                                {/* need to add functionality */}
                    {isLogin ? (
                        <>
                        <Button type="submit" style={{marginTop: '24px', marginBottom: '10px', height: '36px', width: '201px', backgroundColor: 'rgb(28, 63, 93)' }}> 
                        Log in
                        </Button>
                        </>
                    ) : (
                        <Button type="submit" style={{marginTop: '24px', marginBottom: '10px', height: '36px', width: '249px', backgroundColor: 'rgb(28, 63, 93)'}}> 
                        Sign-up
                        </Button>
                    )}
                    <div className="d-flex justify-content-center align-items-center">
                        {isLogin ? (
                            <>
                                <p className="mb-0">No account?</p>
                                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>Sign up</Button>
                            </>
                        ) : (
                            <>
                                <p className="mb-0">Already have an account?</p>
                                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>Login</Button>
                            </>
                        )}
                    </div>
                </Form>
                </Col>
            </Row>
        </Card>
        </Container>
        </div>
    )
}

export default SignupForm