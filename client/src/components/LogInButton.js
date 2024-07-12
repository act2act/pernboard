import React from 'react';
import img from '../assets/kakao_login_large_wide.png';

function LogInButton() {
    return (
        <a href='http://localhost:4000/authorize'>
            <img src={img} alt='kakao login button' />
        </a>
    )
}

export default LogInButton;