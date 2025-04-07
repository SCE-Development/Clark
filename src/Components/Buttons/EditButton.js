import React from 'react';

const EditButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white px-2 py-2 rounded-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path strokeDasharray="20" strokeDashoffset="20" d="M3 21h18">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0" />
          </path>
          <path strokeDasharray="48" strokeDashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0" />
          </path>
          <path strokeDasharray="8" strokeDashoffset="8" d="M14 6l4 4">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0" />
          </path>
        </g>
      </svg>
    </button>
  );
};

export default EditButton;

