import React from 'react';
import PostCard from '../components/PostCard';
import PageNav from '../components/PageNav';
import { usePostContext } from '../contexts/PostContext';

function Home() {
    let location = window.location;
    let params = new URLSearchParams(location.search);
    let currentPage = parseInt(params.get('page')) || 1;

    const { posts } = usePostContext();
    const postsPerPage = 9;
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <>
            <div className='grid grid-cols-3 gap-4 p-4'>
                <PostCard currentPage={currentPage} postsPerPage={postsPerPage} />
            </div>
            <div className='text-center pb-4'>
                <PageNav currentPage={currentPage} postsPerPage={postsPerPage} totalPages={totalPages} />
            </div>
        </>
    )
};


export default Home;