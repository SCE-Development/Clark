import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function LinkifiedText({ children }) {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  const parts = children.split(URL_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(URL_REGEX)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
