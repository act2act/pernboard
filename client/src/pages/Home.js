import React, {useState, useEffect} from 'react';
import PostCard from '../components/PostCard';

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
                return <PostCard key={post.post_id} post={post} />
            })}
        </>
    )
};

export default Home;