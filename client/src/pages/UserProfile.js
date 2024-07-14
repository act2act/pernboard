import React from 'react';
import { useUser } from '../layouts/MainLayout';

function UserProfile() {
    const { user } = useUser();

    return (
        <>
            <h1>User Profile</h1>
            <p>Hi, {user.properties.nickname}!</p>
        </>
    )
};

export default UserProfile;