import React from 'react';
import { useUserContext } from '../contexts/UserContext';

function UserProfile() {
    const { user } = useUserContext();

    return (
        <>
            {user ? (
                <div className='text-white p-4'>
                    <h1>{user.username}</h1>
                    <p>{user.created_at}</p>
                </div>
            ) : (
                <div className='text-white p-4'>
                    <h1>Log in to view your profile</h1>
                    <a href='/login'>Log in</a>
                </div>
            )}
        </>
    )
};

export default UserProfile;