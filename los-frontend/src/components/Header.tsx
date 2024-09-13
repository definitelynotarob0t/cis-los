import { Navbar, Nav } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation, Link } from "react-router-dom";

const Header = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const headerItem = {
        paddingLeft: '10px'
    }

    const navBar = {
        padding: '10px',
        marginBottom: '10px',
        display: 'flex', 
        gap: '15px', 
        backgroundColor: 'rgb(28, 63, 93)', 
        color: 'white',
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login');
    }

    return (
        <Navbar style={navBar}>
            <Navbar.Brand>CIS Logo</Navbar.Brand>
            <Nav>
                {currentPath !== '/login' && (
                    <>
                    {/* have both 'elevator-pitch' and 'line-of-sight' in header - make the one that isn't current page not-linkable and dark colour */}
                        {currentPath !== '/elevator-pitch' && <Nav.Link as={Link} to="/elevator-pitch" style={headerItem}>Elevator Pitch</Nav.Link>}
                        {currentPath !== '/line-of-sight' && <Nav.Link as={Link} to="/line-of-sight" style={headerItem}>Line of Sight</Nav.Link>}
                        <button onClick={handleLogout} style={headerItem}>Logout</button>
                        <button > Export as PDF </button>
                    </>
                )}
            </Nav>
        </Navbar>
    );
}

export default Header
