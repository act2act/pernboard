import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        getPost();
    }, []);

    const getPost = async () => {
        const response = await fetch(`http://localhost:4000/posts/${id}`, {method: 'GET'});

        const postData = await response.json();
        setPost(postData);
    }

    return (
        <>
            <h1>{post.title}</h1>
            <h2>{post.author}</h2>
            <h3>{post.post_content}</h3>
        </>
    )
}

export default Post;