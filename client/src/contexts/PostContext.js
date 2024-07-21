import config from '../config';
import { useContext, useState, useEffect, createContext } from 'react';

const PostContext = createContext();
const apiUrl = config.apiUrl;

function PostProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${apiUrl}/posts`, {method: 'GET'});
            const postsData = await response.json();
            setPosts(postsData);
            setLoading(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const findPostById = (id) => {
        return posts.find((post) => post.post_id === parseInt(id));
    };

    return (
        <PostContext.Provider value={{posts, loading, error, findPostById}}>
            { children }
        </PostContext.Provider>
    )
}

export const usePostContext = () => useContext(PostContext);
export default PostProvider;