import { Navbar } from "react-bootstrap"


const Footer = () => {

    const navBar = {
        padding: '10px',
        marginBottom: '10px',
        display: 'flex', 
        gap: '15px', 
        backgroundColor: 'rgb(28, 63, 93)', 
        color: 'white'
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={navBar}>
            <div> Consulting & Implementation Services </div> 
        </Navbar>
    )
}

export default Footer
