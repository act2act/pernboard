function EditButton({ post }) {
    // Route to the edit page
    const handleEdit = () => {
        window.location.href = `/posts/${post.post_id}/edit`
    }

    return (
        <button onClick={handleEdit}>Edit</button>
    )
}

export default EditButton;