import { Navbar, Modal, Button } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png"
import { SyntheticEvent, useState } from "react";
import html2pdf from "html2pdf.js";

interface HeaderProps {
    updateLos?: (event: SyntheticEvent) => void; // Make updateLos optional since it is not required from Elevator
  }
  

const Header: React.FC<HeaderProps> = ({ updateLos }) => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const exportToPDF = () => {
        let element: HTMLElement | null = null;

        if (currentPath === '/elevator-pitch') {
            element = document.querySelector('.pitch-content');
        } else if (currentPath === '/line-of-sight') {
            element = document.querySelector('.user-los-container');
        }

        if (element) {
            // Replace textareas with divs to display full content
            const textareas = element.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                const div = document.createElement('div');
                div.textContent = textarea.value;
                div.style.whiteSpace = 'pre-wrap';  // Preserve line breaks
                div.style.border = '1px solid #ccc'; // Keep the appearance consistent
                div.style.padding = '5px';           // Add padding to match text area appearance
                div.style.minHeight = textarea.style.height;
                textarea.parentNode?.replaceChild(div, textarea);
            });

            const options = {
                filename: 'line-of-sight.pdf',
                html2canvas: { scale: 2,  scrollY: -window.scrollY },
                jsPDF: { orientation: 'landscape' }
            }
            html2pdf().set(options).from(element).save()
        } else {
            console.error('Element not found for PDF export.');
        }
    }

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
        <Navbar >
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
                                <button className='navbar-item' id="pdf-button" data-tooltip="Export to PDF" onClick={exportToPDF}>
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
