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
    <svg width='24' height='24' viewBox='0 0 24 24' style={{ fill: 'RED' }}>
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

export function trashcanSymbol() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0
      1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z'
      />
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
