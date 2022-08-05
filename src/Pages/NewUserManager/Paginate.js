import React from 'react';

export const Paginate = ({ usersPerPage, totalUsers, paginate,
  searchParams, searching }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul>
        {pageNumbers.map((pageNumber, key) => (
          <button {...{ key }} onClick={() => {
            paginate(pageNumber, searching);
          }
          } className={parseInt(searchParams.get('page')) === pageNumber
            ? 'active' : ''}>
            {pageNumber}
          </button>
        ))}
      </ul>
    </nav>

  );
};
