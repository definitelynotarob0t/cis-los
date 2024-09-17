import { Navbar, Nav } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../images/logo.png"

const Header = () => {

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
            < div className= 'header-contents'>
            {/* <Navbar.Brand className="navbar-logo" src={logo} alt="CIS Logo"></Navbar.Brand> */}
            <a href="https://consultingis.com.au/"><img 
                src={logo}
                alt="CIS Logo" 
                className="navbar-logo"
            /></a>
            <Nav>
                {currentPath !== '/login' && (
                    <>
                    {/* have both 'elevator-pitch' and 'line-of-sight' in header - make the one that isn't current page not-linkable and dark colour */}
                        {currentPath !== '/elevator-pitch' && <Nav.Link as={Link} to="/elevator-pitch" className='navbar-item'>Elevator Pitch</Nav.Link>}
                        {currentPath !== '/line-of-sight' && <Nav.Link as={Link} to="/line-of-sight"className='navbar-item'>Line of Sight</Nav.Link>}
                        <button onClick={handleLogout} className='navbar-item'>Logout</button>
                        <button className='navbar-item'> Export as PDF </button>
                    </>
                )}
            </Nav>
            </div>
        </Navbar>
    );
}

export default Header
