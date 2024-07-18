import React from 'react';
import PostCard from '../components/PostCard';

function Home() {
    return (
        <div className='grid grid-cols-3 gap-4'>
            <PostCard />
        </div>
    )
};


export default Home;