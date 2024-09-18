import { Navbar, Nav } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../images/logo.png"
import { Button } from "react-bootstrap";
import { SyntheticEvent } from "react";



const Header = ({ updateLos } : {updateLos: (event: SyntheticEvent) => void }) => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;


    const handleLogout = () => {
        dispatch(logout())
        navigate('/login');
    }

    return (
        <Navbar>
            <div className= 'header-contents'>
                <a href="https://consultingis.com.au/"><img 
                    src={logo}
                    alt="CIS Logo" 
                    className="navbar-logo"
                /></a>
                <Nav >
                    {currentPath !== '/login' && (
                        <>
                            {currentPath !== '/elevator-pitch' && <Nav.Link as={Link} to="/elevator-pitch" className='navbar-item'>Elevator Pitch</Nav.Link>}
                            {currentPath !== '/line-of-sight' && <Nav.Link as={Link} to="/line-of-sight"className='navbar-item'>Line of Sight</Nav.Link>}
                            <button onClick={handleLogout} className='navbar-item'>Logout</button>
                            <button className='navbar-item'> Export as PDF </button>
                            {currentPath === '/line-of-sight' && <Button className="navbar-item save-button" onClick={updateLos}> Save </Button>}

                        </>
                    )}
                </Nav>

            </div>
        </Navbar>
    );
}

export default Header
