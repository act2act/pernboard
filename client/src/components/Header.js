import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../layouts/MainLayout';


function Header() {
    const { user } = useUser();

    return (
        <header>
            <div>
                <a href='/'>PERN BOARD</a>
            </div>
            <nav>
                <ul>
                    <li><NavLink to='/about'>About</NavLink></li>
                    <li><NavLink to='/profile'>User</NavLink></li>
                    { user ? <li><a href='http://localhost:4000/logout'>Log Out</a></li> : <li><NavLink to='/login'>Log In</NavLink></li> }
                </ul>
            </nav>
        </header>
    )
};

export default Header;