import { Navbar, Modal, Button, Dropdown } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../reducers/userReducer"
import { useNavigate, useLocation, useParams } from "react-router-dom";
import logo from "../images/logo.png"
import { SyntheticEvent, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { RootState } from "../store";
import { notifyError } from "../reducers/errorReducer";

interface HeaderProps {
    updateUserInputs?: (event: SyntheticEvent) => void;
}

const Header: React.FC<HeaderProps> = ({updateUserInputs}) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const [showModal, setShowModal] = useState(false);

    const { pitchId, programId } = useParams<{ pitchId: string; programId: string }>(); 

    const programs = useSelector((state: RootState) => state.programs?.programs);
    const pitches = useSelector((state: RootState) => state.pitches?.pitches);

    const [selectedProgramId, setSelectedProgramId] = useState(programId || programs[0]?.id);
    const [_selectedPitchId, setSelectedPitchId] = useState(pitchId || pitches[0]?.id); // Add state for pitchId


    useEffect(() => {
        if (programId) {
            setSelectedProgramId(programId);
        }
    }, [programId]);

    useEffect(() => {
        if (pitchId) {
            setSelectedPitchId(pitchId);
        }
    }, [pitchId]);
    
    const exportToPDF = () => {
        let element: HTMLElement | null = null;

        if (currentPath === `/elevator-pitch/${pitchId}`) {
            element = document.querySelector('.pitch-content');
        } else if (currentPath === '/line-of-sight') {
            element = document.querySelector('.user-los-container');
        }

        if (element) {

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

    const handleProgramChange = (programId: number) => {
        setSelectedProgramId(programId);

        const selectedProgram =  programs.find((program) => program.id === Number(programId))
        if (!selectedProgram) {
            dispatch(notifyError('Error retrieving program'));
            return;
        }

        const newPitchId = selectedProgram.pitchId;

        if (!newPitchId) {
            dispatch(notifyError('Error retriving program'))
            return
        } 
        setSelectedPitchId(newPitchId); 
        navigate(`/programs/${programId}/elevator-pitch/${newPitchId}`);
    };

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
                <div className='header-contents'>
                    <a href="https://consultingis.com.au/"><img
                        src={logo}
                        alt="CIS Logo"
                        className="navbar-logo"
                    /></a>
                    <>
                        {currentPath !== '/login' && (
                            <>
                                <div className="header-start">
                                    <button
                                        className={currentPath === '/home' ? 'navbar-item primary' : 'navbar-item'}
                                        onClick={() => navigate('/home')}
                                    >
                                        Home
                                    </button>
                                    <Dropdown className="header-start">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            {pitches.find(p => p.id === selectedProgramId)?.title || "Select Program "}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {pitches.map(pitch => (
                                                <Dropdown.Item key={pitch.id} onClick={() => handleProgramChange(Number(pitch.programId))}>
                                                    {pitch.title}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                  
                        {currentPath !== '/home' && (
                            <div>
                                <button
                                className={currentPath === `/programs/${programId}/elevator-pitch/${pitchId}` ? 'navbar-item primary' : 'navbar-item'}
                                onClick={() => navigate(`/programs/${programId}/elevator-pitch/${pitchId}`)}
                                >
                                Elevator Pitch
                                </button>
                                <button
                                className={currentPath === `/programs/${programId}/line-of-sight/${pitchId}` ? 'navbar-item primary' : 'navbar-item'}
                                onClick={() => navigate(`/programs/${programId}/line-of-sight/${pitchId}`)}
                                >
                                Line of Sight
                                </button>
                            </div>
                        )}
                        {(currentPath === `/programs/${programId}/elevator-pitch/${pitchId}` || currentPath === `/programs/${programId}/line-of-sight/${pitchId}`) && (
                            <div className="header-end">
                                <button className="navbar-item save-button" onClick={updateUserInputs}> Save </button>
                            </div>
                        )}
                                 
                                </div>
                                <div className="header-end">
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
                <Modal.Body>
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
