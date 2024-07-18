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
            <form onSubmit={handleSubmit} className="p-4">
                <div className="pb-4">
                    <label htmlFor='title' class="block mb-2 text-sm font-medium text-white">Title</label>
                    <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div className="pb-4">
                    <label htmlFor='post_content' class="block mb-2 text-sm font-medium text-white">Post Content</label>
                    <textarea id='post_content' value={postContent} onChange={(e) => setPostContent(e.target.value)} className="block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <button type='submit' class="text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Submit</button>
            </form>
        </>
    )
}

export default NewPost;