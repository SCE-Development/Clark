import React from 'react';

export function checkMark() {
  return (
    <svg width='35' height='35' viewBox='0 0 24 24' style={{ fill: 'GREEN' }}>
      <path
        d='M20.285 2l-11.285 11.567-5.286-5.011-3.714
      3.716 9 8.728 15-15.285z'
      />
    </svg>
  );
}

export function xMark() {
  return (
    <svg width='35' height='35' viewBox='0 0 24 24' style={{ fill: 'RED' }}>
      <path
        d='M24 20.188l-8.315-8.209
        8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666
    3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'
      />
    </svg>
  );
}

export function editSymbol() {
  return (
    <svg width='40' height='40' viewBox='0 0 24 24'>
      <path
        fill='#000000'
        d='M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09
    20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,
    18.94L18.06,12.88L20.11,14.93L14.06,
    21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,
    14.11C13.34,14.03 12.67,14 12,14M12,4A4,4
    0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z'
      />
    </svg>
  );
}

export function trashcanSymbol(color = 'black') {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill={color}>
      <path
        d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0
      1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z'
      />
    </svg>
  );
}

export function copyIcon(styleProps) {
  return (
    <svg id='Copy_24' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <rect width='24' height='24' stroke='none' opacity='0'/>
      <g transform="matrix(0.8 0 0 0.8 12 12)" >
        <path
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeDashoffset: 0,
            strokeLinejoin: 'miter',
            strokeMiterlimit: 4,
            fillRule: 'nonzero',
            opacity: 1,
          }}
          className={styleProps || ''}
          transform=" translate(-15, -14.5)" d="M 11 2 C 9.895 2 9 2.895 9 4 L 9 20 C 9 21.105 9.895 22 11 22 L 24 22 C 25.105 22 26 21.105 26 20 L 26 8.5 C 26 8.235 25.895031 7.9809687 25.707031 7.7929688 L 20.207031 2.2929688 C 20.019031 2.1049687 19.765 2 19.5 2 L 11 2 z M 19 3.9042969 L 24.095703 9 L 20 9 C 19.448 9 19 8.552 19 8 L 19 3.9042969 z M 6 7 C 4.895 7 4 7.895 4 9 L 4 25 C 4 26.105 4.895 27 6 27 L 19 27 C 20.105 27 21 26.105 21 25 L 21 24 L 11 24 C 8.794 24 7 22.206 7 20 L 7 7 L 6 7 z" stroke-linecap="round"
        />
      </g>
    </svg>
  );
}

export function mapPinSymbol() {
  return (
    <svg
      className='sc-bdVaJa fUuvxv'
      fill='#414141bd'
      width='1.5rem'
      height='1.5rem'
      viewBox='0 0 1024 1024'
      rotate='0'
    >
      <path
        d='M512 64c-176.008 0-320 141.114-320 313.602 0
         235.198 320 582.398 320 582.398s320-347.2
         320-582.398c0-172.488-143.992-313.602-320-313.602zM512
         489.602c-63.992 0-114.288-49.29-114.288-112 0-62.714
         50.294-112 114.288-112s114.288 49.286 114.288
         112c0 62.71-50.296 112-114.288 112z'
      ></path>
    </svg>
  );
}

export function clockSymbol() {
  return (
    <svg
      className='sc-bdVaJa fUuvxv'
      fill='#0098ab'
      width='1.5rem'
      height='1.5rem'
      viewBox='0 0 1024 1024'
      rotate='0'
    >
      <path
        d='M511.6 96c-229.6 0-415.6 186.4-415.6 416s186
        416 415.6 416c230 0 416.4-186.4
        416.4-416s-186.4-416-416.4-416zM512
        844.8c-183.8 0-332.8-149-332.8-332.8s149-332.8
        332.8-332.8 332.8 149 332.8 332.8-149 332.8-332.8
        332.8z M532.8 304h-62.4v249.6l218.4 131 31.2-51.2-187.2-111v-218.4z'
      ></path>
    </svg>
  );
}

export function cancelEditSymbol(setToggle) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      onClick={() => {
        setToggle();
      }}
      style={{
        position: 'relative',
        marginTop: '5px',
        marginLeft: '-5px',
        left: '95%'
      }}
    >
      <path
        d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212
        8.318-8.31-8.203-3.666 3.666 8.321
        8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'
      />
    </svg>
  );
}

export function sunIcon() {
  return (
    // paste the <svg> and body from the website
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="feather feather-sun"><circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21"
        x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64"
        y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23"
        y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  );
}

export function moonIcon() {
  return (
    <svg aria-hidden="true" focusable="false" data-prefix="fas"
      data-icon="moon" role="img" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512" className="svg-inline--fa fa-moon fa-w-16 fa-1x">
      <path fill="currentColor" d="M283.211 512c78.962 0 151.079-35.925
         198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203
          23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635
           101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156
            258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0
             141.309 114.511 256 256 256z" className=""></path></svg>
  );
}
