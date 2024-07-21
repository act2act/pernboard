import config from "../config";

const apiUrl = config.apiUrl;

function DeleteButton({ post }) {
    const deletePost = async () => {
        try {
            const response = await fetch(`${apiUrl}/posts/${post.post_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <button onClick={deletePost} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Delete</button>
    )
}

export default DeleteButton;