import React from 'react';
import { NavLink } from 'react-router-dom';


function Header() {
    return (
        <header>
            <div>
                <a href='/'>PERN BOARD</a>
            </div>
            <nav>
                <ul>
                    <li><NavLink to='/about'>About</NavLink></li>
                    <li><NavLink to='/profile'>User</NavLink></li>
                    <li><NavLink to='/login'>Log in</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;