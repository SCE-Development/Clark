import React from 'react';

export default function FilterBar( {filter, setFilter} ) {
  return (
    <div className="flex space-x-2 mb-4 sm:mb-0">
      <button
        onClick={() => setFilter('All')}
        className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline'}`}
      >
        All
      </button>
      <button
        onClick={() => setFilter('Drink')}
        className={`btn ${filter === 'Drink' ? 'btn-primary' : 'btn-outline'}`}
      >
        Drinks
      </button>
      <button
        onClick={() => setFilter('Snack')}
        className={`btn ${filter === 'Snack' ? 'btn-primary' : 'btn-outline'}`}
      >
        Snacks
      </button>
      <button
        onClick={() => setFilter('Dessert')}
        className={`btn ${filter === 'Dessert' ? 'btn-primary' : 'btn-outline'}`}
      >
        Desserts
      </button>
      <button
        onClick={() => setFilter('Candy')}
        className={`btn ${filter === 'Candy' ? 'btn-primary' : 'btn-outline'}`}
      >
        Candy
      </button>
    </div>
  );
}

