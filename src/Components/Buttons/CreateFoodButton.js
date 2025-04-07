import React from 'react';

const CreateFoodButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="btn btn-circle btn-primary fixed bottom-4 right-4 shadow-lg w-16 h-16"
    >
      <span className="text-3xl">+</span>
    </button>
  );
};


export default CreateFoodButton;
