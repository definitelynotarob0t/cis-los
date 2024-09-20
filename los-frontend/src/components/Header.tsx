import { Navbar, Modal, Button } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png"
import { SyntheticEvent, useState } from "react";



const Header = ({ updateLos } : {updateLos: (event: SyntheticEvent) => void }) => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/login');
        setShowModal(false);
    };

    const cancelLogout = () => {
        setShowModal(false);
    };

    return (
        <>
        <Navbar>
            <div className= 'header-contents'>
                <a href="https://consultingis.com.au/"><img 
                    src={logo}
                    alt="CIS Logo" 
                    className="navbar-logo"
                /></a>
                < >
                    {currentPath !== '/login' && (
                        <>
                            <div className="header-start">
                                <button 
                                    className={currentPath === '/elevator-pitch' ?  'navbar-item primary' : 'navbar-item'}
                                    onClick={() => navigate('/elevator-pitch')}
                                >
                                Elevator Pitch
                                </button>
                                <button
                                    className={currentPath === '/line-of-sight' ? 'navbar-item primary' : 'navbar-item'}
                                    onClick={() => navigate('/line-of-sight')}
                                >
                                    Line of Sight
                                </button>
                            </div>
                            <div className="header-end">
                                {currentPath === '/line-of-sight' && <button className="navbar-item save-button" onClick={updateLos}> Save </button>}
                                <button onClick={handleLogout} className='navbar-item' id="logout-button" data-tooltip="Log out">
                                    <i className="bi bi-box-arrow-right"></i>
                                </button>
                                <button className='navbar-item' id="pdf-button" data-tooltip="Export to PDF">
                                    <i className="bi bi-file-pdf"></i>
                                </button>
                            </div>
                        </>
                    )}
                </>

            </div>
        </Navbar>
        <Modal show={showModal} onHide={cancelLogout}>
            <Modal.Header>
                <Modal.Title>Are you sure you want to log out?</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                Make sure you've saved your work before logging out.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cancelLogout}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={confirmLogout}>
                    Log out
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default Header
