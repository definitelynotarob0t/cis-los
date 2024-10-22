import { Navbar, Modal, Button, Dropdown } from "react-bootstrap";
import { AppDispatch } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userReducer";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import logo from "../images/cis_logo_large.png";
import { SyntheticEvent, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { RootState } from "../store";
import { notifyError } from "../reducers/errorReducer";
import { Pitch } from "../types/types";

interface HeaderProps {
    updateUserInputs?: (event: SyntheticEvent) => void;
}

const Header: React.FC<HeaderProps> = ({updateUserInputs}) => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;
	const [showModal, setShowModal] = useState(false);

	const { pitchId, programId } = useParams<{ pitchId: string, programId: string }>(); 
	let pitchIdNumber = Number(pitchId);
	let programIdNumber = Number(programId);

	const programs = useSelector((state: RootState) => state.programs?.programs);
	const unsortedPitches = useSelector((state: RootState) => state.pitches?.pitches);
	const pitches = unsortedPitches ? 
		[...unsortedPitches].sort((a: Pitch, b: Pitch) => a.id - b.id) 
		: [];


	const [_selectedProgramId, setSelectedProgramId] = useState(programIdNumber || Number(programs[0]?.id));
	const [_selectedPitchId, setSelectedPitchId] = useState(pitchIdNumber || Number(pitches[0]?.id)); 


	useEffect(() => {
		if (programIdNumber) {
			setSelectedProgramId(programIdNumber);
		}
	}, [programIdNumber]);

	useEffect(() => {
		if (pitchIdNumber) {
			setSelectedPitchId(pitchIdNumber);
		}
	}, [pitchIdNumber]);

	const elevatorPitchUrl = `/projects/${programIdNumber}/elevator-pitch/${pitchIdNumber}`;
	const losUrl = `/projects/${programIdNumber}/line-of-sight/${pitchIdNumber}`;
    
	const exportToPDF = () => {
		let element: HTMLElement | null = null;

		if (currentPath === elevatorPitchUrl) {
			element = document.querySelector(".pitch-content");
		} else if (currentPath === losUrl) {
			element = document.querySelector(".user-los-container");
		}

		if (element) {
			const options = {
				filename: "line-of-sight.pdf",
				html2canvas: {
					scale: 2,
					scrollY: -window.scrollY,
					ignoreElements: (element: Element) => {
						return element.classList.contains("delete-los-btn") || element.classList.contains("add-los-btn");
					}
				},
				jsPDF: { orientation: "landscape" }
			};
            
			html2pdf().set(options).from(element).save();
		} else {
			dispatch(notifyError("Error exporting PDF"));
			console.error("Element not found for PDF export.");
		}
	};

	const handleProgramChange = (newProgramId: number) => {
		setSelectedProgramId(newProgramId);

		const selectedProgram =  programs.find((program) => program.id === newProgramId);

		if (!selectedProgram) {
			dispatch(notifyError("Error retrieving project"));
			return;
		}

		const newPitchId = selectedProgram.pitchId;

		if (!newPitchId) {
			dispatch(notifyError("Error retriving project"));
			return;
		} 
		setSelectedPitchId(Number(newPitchId)); 
		navigate(`/projects/${newProgramId}/elevator-pitch/${newPitchId}`);
	};

	const handleLogout = () => {
		setShowModal(true);
	};

	const confirmLogout = () => {
		dispatch(logout());
		navigate("/login");
		setShowModal(false);
	};

	const cancelLogout = () => {
		setShowModal(false);
	};

	return (
		<>
			<Navbar>
				<div className='header-contents'>
					<a href="https://consultingis.com.au/" target="_blank" ><img
						src={logo}
						alt="CIS Logo"
						className="navbar-logo"
                        
					/></a>
					<>
						{currentPath !== "/login" && (
							<>
								<div className="header-start">
									<button
										className={currentPath === "/home" ? "navbar-item primary" : "navbar-item"}
										onClick={() => navigate("/home")}
									>
                                        Home
									</button>
									<Dropdown className="header-start">
										<Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Select Project
										</Dropdown.Toggle>
										<Dropdown.Menu>
											{pitches.map(pitch => (
												<Dropdown.Item key={pitch.id} onClick={() => handleProgramChange(Number(pitch.programId))}>
													{pitch.title}
												</Dropdown.Item>
											))}
										</Dropdown.Menu>
									</Dropdown>
                                  
									{currentPath !== "/home" && (
										<div>
											<button
												className={currentPath === elevatorPitchUrl ? "navbar-item primary" : "navbar-item"}
												onClick={() => navigate(elevatorPitchUrl)}
											>
                                Elevator Pitch
											</button>
											<button
												className={currentPath === losUrl ? "navbar-item primary" : "navbar-item"}
												onClick={() => navigate(losUrl)}
											>
                                Line of Sight
											</button>
										</div>
									)}           
								</div>
								<div className="header-end">
									{(currentPath === elevatorPitchUrl || currentPath === losUrl) && (
										<>
											< button className="navbar-item save-button" onClick={updateUserInputs}> Save </button>
											<button className='navbar-item' id="pdf-button" data-tooltip="Export to PDF" onClick={exportToPDF}>
												<i className="bi bi-file-pdf"></i>
											</button>
										</>
									)}
                                 
									<button onClick={handleLogout} className='navbar-item' id="logout-button" data-tooltip="Log out">
										<i className="bi bi-box-arrow-right"></i>
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
};

export default Header;
