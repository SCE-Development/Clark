import React from 'react';

export default function JobStatus(props) {
  return (
    <div className='flex items-center justify-center w-full mt-10'>
      <div role="alert" className={'w-1/2 text-center alert alert-' + (props.status === 'failed' ? 'error' : 'success')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className=''>{props.fileName} ({props.id}): {props.status}</p>
      </div>
    </div>
  );
}
