import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';


function Header() {
    const { user } = useUserContext();

    return (
        <header className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 text-white'>
            <div className='text-3xl font-bold'>
                <a href='/'>PERN BOARD</a>
            </div>
            <nav>
                <ul className='flex space-x-4'>
                    <li ><NavLink to='/profile'>User</NavLink></li>
                    { user ? <li ><a href='http://localhost:4000/logout'>Log Out</a></li> : <li ><NavLink to='/login'>Log In</NavLink></li> }
                    { user ? <li ><NavLink to='/posts/new'>New Post</NavLink></li> : null }
                </ul>
            </nav>
        </header>
    )
};

export default Header;