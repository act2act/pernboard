function DeleteButton({ post }) {
    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${post.post_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <button onClick={deletePost}>Delete</button>
    )
}

export default DeleteButton;