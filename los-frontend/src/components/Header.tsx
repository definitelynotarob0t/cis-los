import { Navbar } from "react-bootstrap"
import { AppDispatch } from "../store"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"

const Header = () => {

    const dispatch = useDispatch<AppDispatch>()

    const headerItem = {
        paddingLeft: '10px'
    }

    const navBar = {
        padding: '10px',
        marginBottom: '10px',
        display: 'flex', 
        gap: '15px', 
        backgroundColor: 'rgb(28, 63, 93)', 
        color: 'white'
    }

    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={navBar}>
            <button style={headerItem}>Export as PDF</button> {/* handle click */}
            <button onClick={handleLogout} style={headerItem}> Logout </button>
            {/* include CIS logo */}
        </Navbar>
    )
}

export default Header
