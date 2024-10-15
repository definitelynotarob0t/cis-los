import { SyntheticEvent, useState } from 'react';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/userReducer';
import userService from '../services/userService';
import { notifySuccess } from '../reducers/notificationReducer';
import { notifyError } from '../reducers/errorReducer';
import { useNavigate } from 'react-router-dom'
import road from '../images/road.jpg'
import axios from "axios";


const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const dispatch = useDispatch<AppDispatch>(); 
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }
    

    const handleLogin = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            await dispatch(setUser({ email, password }));
            navigate("/home");
            setEmail("");
            setPassword("");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 429) {
                    const message = error.response.data.message; 
                    dispatch(notifyError(message));
                    return
                }
            }
            dispatch(notifyError('Error logging in'));
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.toLowerCase());
    }; 

    const validateName = (name: string) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        return nameRegex.test(name);
    };
    

    const handleSignUp = async (event: SyntheticEvent) => {
        event.preventDefault()

        try {

            // Ensure all fields are complete
            if (!email || !name || ! password || !passwordConfirm) {
                dispatch(notifyError('Please ensure all fields are complete.'));
                return;
            }

            // Email validation
            if (!validateEmail(email)) {
                dispatch(notifyError("Please enter a valid email"))
                return;
            }

            // Name validation
            if (!validateName(name)) {
                dispatch(notifyError("Name must contain only letters and spaces."));
                return;
            }

            // Check if  email is already registered
            const registeredEmail = await userService.findUserByEmail(email)
            if (registeredEmail) {
                dispatch(notifyError("There is already an account registered with this email."))
                return
            }

            // Password validation
            if (passwordConfirm !== password) {
                dispatch(notifyError("Passwords do not match"))
                return;
            } 
            if (password.length < 8) {
                dispatch(notifyError("Password must be at least 8 characters"));
                return;
            }
            
            // Create account
            await userService.createUser({ email, password, name }); // Credentials sent to API, no state update until user logs-in
            dispatch(notifySuccess("Account created."))
 
        } catch (error: any) {  // Catch errors during user creation
            if (axios.isAxiosError(error) && error.response) {
              // If the error comes from the backend, show the specific error
              dispatch(notifyError(error.response.data.error || "An error occurred during sign-up."));
            } else {
              // Handle other types of errors
              dispatch(notifyError("An unexpected error occurred."));
            }
          }
    };
    return (
        <div >
        < div className="signup-container">
            <Card className="login-form" style={{ backgroundColor: '#d3d3d3' }}>
                <Row>
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
                            <Form.Label style={{fontSize: '14px'}}> 
                                Password
                                <i 
                                className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'}`} 
                                style={{position: 'absolute', right: '25px', cursor: 'pointer'}}
                                //Inside field:  style={isLogin? { position: 'absolute', right: '25px', top: '51%', cursor: 'pointer'}: { position: 'absolute', right: '25px', top: '53%', cursor: 'pointer'}}
                                onClick={togglePasswordVisibility}
                            />  
                            </Form.Label> 
                            <Form.Control
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                value={password}
                                id="pass"
                                onChange={({ target }) => setPassword(target.value)}
                                isInvalid={password.length > 0 && password.length < 8}
                            />

                         {!isLogin && (
                            <Form.Control.Feedback type="invalid">Password must be at least 8 characters</Form.Control.Feedback>
                         )}
                        </Form.Group>
                        {!isLogin && (
                        <Form.Group style={{marginTop: '10px'}}>
                            <Form.Label style={{fontSize: '14px'}}> Confirm password </Form.Label>
                            <Form.Control
                                type={passwordVisible ? "text" : "password"}
                                name="passwordConfirm"
                                id="pass"
                                value={passwordConfirm}
                                onChange={({ target }) => setPasswordConfirm(target.value)}
                                isInvalid={password!=passwordConfirm}
                            />
                        <Form.Control.Feedback type="invalid">Passwords must match</Form.Control.Feedback>
                        </Form.Group>  
                        )}
                        {isLogin && ( 
                        <div style={{ marginTop: '10px', fontSize:'12px'}}>
                            <a href="/forgot-password" target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                            Forgot password? 
                            </a>
                        </div>
                        )} 
                        {isLogin ? (
                            <>
                            <Button type="submit" className="login-button"> 
                            Log in
                            </Button>
                            </>
                        ) : (
                            <Button type="submit" className="login-button" style={isLogin ? {width: '201px'} : { width: '232px'}}> 
                            Sign-up
                            </Button>
                        )}
                        <div className="toggle-signup">
                            {isLogin ? (
                                <>
                                    <p>Don't have an account?</p>
                                    <Button variant="link" className="signup-link" onClick={() => setIsLogin(!isLogin)}>Sign up</Button>
                                </>
                            ) : (
                                <>
                                    <p>Already have an account?</p>
                                    <Button variant="link" className="signup-link" onClick={() => setIsLogin(!isLogin)}>Log in</Button>
                                </>
                            )}
                        </div>
                    </Form>
                    </Col>
                </Row>
            </Card>
            <img 
                src={road}
                alt="Hilly road" 
                className="road-image"
                
            />
             <div className="login-text-overlay">
                The line of sight is a beneficial tool when designing new initiatives. 
                It prompts teams to start mapping planned activities and outputs, and their outcomes and impacts. 
                As your initiative progresses, the line of sight can be refined. 
                This online tool is most effective during the early design stages, especially in a collaborative workshop. 
                As it becomes more detailed and sophisticated, switching to a collaborative online document may be more beneficial. 
             </div>
        </div>
        </div>
    )
}

export default SignupForm