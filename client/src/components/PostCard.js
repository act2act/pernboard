import React from 'react';
import { Link } from 'react-router-dom';
import { usePostContext } from '../contexts/PostContext';

function PostCard() {
    const { posts } = usePostContext();

    return (
        <>
            {posts.map((post) => (
                <div key={post.post_id}>
                    <Link to={`/posts/${post.post_id}`} key={post.post_id}>
                        <h2>{post.title}</h2>
                    </Link>
                    <h4>{post.author}</h4>
                    <p>{post.post_content}</p>
                </div>
            ))}
        </>
    )
};

export default PostCard;