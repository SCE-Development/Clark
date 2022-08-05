import React from 'react';
import './UserManager.css';

export const Paginate = ({ usersPerPage, totalUsers, paginate,
  searchParams, searching }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav id='page-numbers'>
      <ul>
        {pageNumbers.map((pageNumber, key) => (
          <button {...{ key }} onClick={() => {
            paginate(pageNumber, searching);
          }
          } className={parseInt(searchParams.get('page')) === pageNumber
            ? 'active-page-button' : 'nonactive-page-button'}>
            {pageNumber}
          </button>
        ))}
      </ul>
    </nav>

  );
};
