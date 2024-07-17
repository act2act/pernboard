import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePostContext } from "../contexts/PostContext";

function EditPost() {
    const { id } = useParams();
    const { findPostById } = usePostContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [post, setPost] = useState(null);

    useEffect(() => {
        setPost(findPostById(parseInt(id)));
    }, [findPostById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:4000/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    post_content: content
                })
                }
            )
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            {post ? (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder={post.title} value={title} onChange={e => setTitle(e.target.value)} />
                    <textarea placeholder={post.post_content} value={content} onChange={e => setContent(e.target.value)}/>
                    <button type="submit">Submit</button>
                </form>

            ): (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default EditPost;