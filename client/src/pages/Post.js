import { useParams } from "react-router-dom";
import { usePostContext } from "../contexts/PostContext";

function Post() {
    const { id } = useParams();
    const { findPostById, loading, error } = usePostContext();

    const post = findPostById(id);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <>
            <h1>{post.title}</h1>
            <h3>{post.author}</h3>
            <p>{post.post_content}</p>
        </>
    )
}

export default Post;