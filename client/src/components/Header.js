import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';


function Header() {
    const { user } = useUserContext();

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
                    { user ? <li><NavLink to='/posts/new'>New Post</NavLink></li> : null }
                </ul>
            </nav>
        </header>
    )
};

export default Header;