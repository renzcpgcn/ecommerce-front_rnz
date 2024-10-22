import React from 'react';
import './Design.css';

const Header = ({onLogout}) => {
    return (
        <header className="header">
            <h1>Product Management</h1>
            <button onClick={onLogout} className="logout-button">Logout</button>
        </header>
    );
};

export default Header;