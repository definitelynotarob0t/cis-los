import { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setUser } from '../reducers/userReducer';
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch<AppDispatch>(); 

    const handleLogin = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            await dispatch(setUser({ email, password }));
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error('Error logging in', error)
        }
    };

    const margin = {
        marginTop: 10,
    };

  return (
    <Container
      fluid
      className="d-flex vh-100 align-items-center justify-content-center"
    >
      <Row className="justify-content-center">
        <Col>
          <h1 style={margin}>
            <strong>Login</strong>
          </h1>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <div>
                <Form.Label>email</Form.Label>
                <Form.Control
                  data-testid="email"
                  type="text"
                  value={email}
                  name="email"
                  onChange={({ target }) => setEmail(target.value)}
                />
              </div>
            </Form.Group>
            <div>
              <Form.Label style={margin}>password</Form.Label>
              <Form.Control
                data-testid="password"
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              data-testid="login"
              style={margin}
            >
              login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
