import React from 'react';

const Footer = () => {
    const footerStyle: React.CSSProperties = {
        padding: '10px',
        marginTop: 'auto',
        backgroundColor: 'rgb(28, 63, 93)', 
        color: 'white',
        textAlign: 'center'
    };
    
    return (
        <div style={footerStyle}>
            Consulting & Implementation Services
        </div>
    );
}

export default Footer;
