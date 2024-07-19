function PageNav({ currentPage, totalPages }) {
    const previousPage = (currentPage) => {
        if (currentPage > 1) {
            return currentPage - 1;
        } else {
            return currentPage;
        }
    } 
    return(
        <nav aria-label="Page navigation">
            <ul className="inline-flex -space-x-px text-sm">
                <li>
                    <a href={`?page=${previousPage(currentPage)}`} class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                {[...Array(totalPages)].map((_, idx) => {
                    return (
                        <li key={idx + 1}>
                            <a href={`?page=${idx + 1}`} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{idx + 1}</a>
                        </li>
                    )
                })}
                <li>
                    <a href={`?page=${currentPage + 1}`} class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default PageNav;