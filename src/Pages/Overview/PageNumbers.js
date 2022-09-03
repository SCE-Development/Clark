import React from 'react';

function PageNumbers(props) {
  const numberOfButtons = Math.ceil(props.count / props.usersPerPage);
  // this generates array of page numbers
  // for example, given numberOfButtons = 3:
  // this generates [0,1,2,3]
  const pageNumbers = [...Array(numberOfButtons + 1).keys()].slice(1);
  // const params = props.parseQuery();
  // const currentPage = params.page ? parseInt(params.page) : 1;
  const currentPage = props.pageNumber;
  return (
    <nav className='user-page-numbers'>
      <ul>
        {pageNumbers.map(number => (
          <button
            key={number}
            id={number}
            onClick={() => props.paginate(number)}
            className={currentPage === number
              ? 'active-page-button' : 'nonactive-page-button'}
          >
            {number}
          </button>
        ))}
      </ul>
    </nav>
  );
}

export default PageNumbers;
