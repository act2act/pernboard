import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";


function NewPost() {
    const { user } = useUserContext();
    const [title, setTitle] = useState('');
    const [postContent, setPostContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    author: user.username,
                    post_content: postContent
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <h1>New Post</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor='post_content'>Post Content</label>
                <textarea id='post_content' value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default NewPost;