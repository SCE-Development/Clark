const Pagination = ({ currentPage, totalPages, goToPage, startIndex, endIndex, totalResults }) => {
  function getPreviousButtonClassName(currentPage) {
    return currentPage === 0
      ? 'px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      : 'px-3 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600';
  }

  function getPageButtonClassName(pageNum, currentPage) {
    return currentPage === pageNum
      ? 'px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white'
      : 'px-3 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600';
  }

  function getNextButtonClassName(currentPage, totalPages) {
    return currentPage === totalPages - 1
      ? 'px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      : 'px-3 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600';
  }

  return (
    <div className='mt-8 flex items-center justify-between'>
      <div className='text-sm text-gray-600 dark:text-gray-400'>
        Showing {startIndex + 1} to {endIndex} of {totalResults} results
      </div>

      <div className='flex items-center space-x-2'>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={getPreviousButtonClassName(currentPage)}
        >
          Previous
        </button>

        <div className='flex items-center space-x-1'>
          {/*
            Create a new array with length equal to the smaller of 5 or totalPages.
            We want to display a maximum of 5 pagination buttons,
            but if there are fewer than 5 total pages (such as 3), show only that many buttons.
          */}
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            /*
              By default, show 5 pages centered around the current page.
              Example: if currentPage = 20 (0-based) -> [19, 20, 21, 22, 23]
              Note: pageNum represents each page number displayed in the pagination buttons
            */
            let pageNum = currentPage - 2 + i;

            /*
              If total pages are 5 or fewer, just display all the pages.
              No need to center or shift.
              Example: totalPages = 2 -> [1, 2]
            */
            if (totalPages <= 5) {
              pageNum = i;

              /*
              If the current page is near the beginning (1 to 3),
              always show the first 5 pages.
              Example: currentPage = 2 -> [1, 2, 3, 4, 5]
            */
            } else if (currentPage <= 2) {
              pageNum = i;

              /*
              If the current page is near the end (last 3 pages),
              show the final 5 pages.
              Example: totalPages = 10, currentPage = 9 -> [6, 7, 8, 9, 10]
            */
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={getPageButtonClassName(pageNum, currentPage)}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={getNextButtonClassName(currentPage, totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
