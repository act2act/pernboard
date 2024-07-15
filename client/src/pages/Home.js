import React, {useState, useEffect} from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            const response = await fetch('http://localhost:4000/posts', {method: 'GET'});
            const postsData = await response.json();
            setPosts(postsData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading === true) {
        return <h1>Loading...</h1>
    }

    if (error === true) {
        return <h1>{error}</h1>
    }
    
    return (
        <>
            {posts.map((post) => {
                return (
                    <Link to={`/posts/${post.post_id}`} key={post.post_id}>
                        <PostCard key={post.post_id} post={post} />
                    </Link>
                ) 
            })}
        </>
    )
};

export default Home;