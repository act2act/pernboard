import React from 'react';
import { Link } from 'react-router-dom';
import { usePostContext } from '../contexts/PostContext';
import { useUserContext } from '../contexts/UserContext';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

function PostCard() {
    const { posts } = usePostContext();
    const { user } = useUserContext();

    return (
        <>
            {posts.map((post) => (
                <div key={post.post_id}>
                    <Link to={`/posts/${post.post_id}`} key={post.post_id}>
                        <h2>{post.title}</h2>
                    </Link>
                    <h4>{post.author}</h4>
                    <p>{post.post_content}</p>
                    {user && user.username === post.author ? (
                        <>
                            <EditButton post={post} />
                            <DeleteButton post={post} />
                        </>
                    ) : null}
                </div>
            ))}
        </>
    )
};

export default PostCard;