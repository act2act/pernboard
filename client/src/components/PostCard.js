import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostContext } from '../contexts/PostContext';
import { useUserContext } from '../contexts/UserContext';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

function PostCard({ currentPage, postsPerPage }) {
    const { posts } = usePostContext();
    const { user } = useUserContext();

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            {currentPosts.map((post) => (
                <div key={post.post_id} className='grid grid-cols-1 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                    <Link to={`/posts/${post.post_id}`} key={post.post_id}>
                        <h2>{post.title}</h2>
                    </Link>
                    <h4>{post.author}</h4>
                    <p>{post.post_content}</p>
                    {user && user.username === post.author ? (
                        <div className='space-x-4 pt-6'>
                            <EditButton post={post} />
                            <DeleteButton post={post} />
                        </div>
                    ) : null}
                </div>
            ))}
        </>
    )
};

export default PostCard;