import { useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { usePostContext } from "../contexts/PostContext";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

function Post() {
    const { id } = useParams();
    const { findPostById, loading, error } = usePostContext();
    const { user } = useUserContext();

    const post = findPostById(id);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="text-white">
            <h1>{post.title}</h1>
            <h3>{post.author}</h3>
            <p className="pb-4">{post.post_content}</p>
            {user && user.username === post.author ? (
                <>
                    <EditButton post={post} />
                    <DeleteButton post={post} />
                </>
            ) : null}
        </div>
    )
}

export default Post;