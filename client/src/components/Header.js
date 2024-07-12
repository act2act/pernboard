import React from 'react';
import { NavLink } from 'react-router-dom';


function Header() {
    return (
        <header>
            <div><h1>PERN BOARD</h1></div>
            <nav>
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/about'>About</NavLink></li>
                    <li><NavLink to='/login'>Log In</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;