import React from 'react';

function PageNumbers(props) {
  const numberOfButtons = Math.ceil(props.count / props.usersPerPage);
  const pageNumbers = new Array();
  for (let i = 1; i <= numberOfButtons; i++) {
    pageNumbers.push(i);
  }
  const params = props.parseQuery();
  const currentPage = params.page ? parseInt(params.page) : 1;
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

