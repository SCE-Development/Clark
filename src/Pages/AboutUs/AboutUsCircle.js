import React from 'react';

function AboutUsCircle(props){
  const {
    name,
    pictureUrl
  } = props.info;

  return (
    <div className="grid">
      <div className="circle" style={{backgroundImage: `url(${pictureUrl})`}}
        onClick={props.handleClick}>
        <div className="circle-container">
          <p>{name}</p>
        </div>
      </div>
    </div>
  );
}
export default AboutUsCircle;
