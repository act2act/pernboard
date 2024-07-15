import React from 'react';

function PostCard({ post }) {
    return (
        <>
            <h1>{post.post_id} | {post.title} | {post.created_at} | {post.post_views}</h1>
            <h3>{post.author}</h3>
            <h2>{post.post_content}</h2>
        </>
    )
};

export default PostCard;