import React, { Component } from 'react';
import './background.css';

function defaultProps(props) {
  const size = props.size || Math.min(window.innerWidth, window.innerHeight);
  const innerRadius = props.innerRadius || size * 0.125;
  const outerRadius = props.outerRadius || size * 0.2;
  const lineSpread = props.lineSpread || 0.4;
  const endDistance = props.endDistance || 1.85;
  const radius = props.radius || 0;
  const lineStartOffset = props.lineStartOffset || 0;

  // used for circles
  const lineStart = (innerRadius - lineStartOffset ) / Math.sqrt(2);
  const lineMid = outerRadius / Math.sqrt(2);
  const lineEnd = outerRadius * endDistance;
  const spread = (lineSpread * innerRadius) / Math.sqrt(2);
  const circleRadius = size * 0.007;

  return {
    // used for default props
    'size' : size,
    'innerRadius' : innerRadius,
    'outerRadius' : outerRadius,
    'lineSpread' : lineSpread,
    'endDistance' : endDistance,
    'radius' : radius,
    'lineStartOffset' : lineStartOffset,

    // used for circles
    'lineStart' : lineStart,
    'lineMid' : lineMid,
    'lineEnd' : lineEnd,
    'spread' : spread,
    'circleRadius' : circleRadius,
  };
}

// abstracts circuit
function circuit(props) {
  const {
    lineStart,
    lineMid,
    lineEnd,
    spread,
  } = defaultProps(props);

  return (
    <>
      <polyline id="path"
        points={`${lineStart - spread} ${-lineStart - spread}
        ${lineMid - spread} ${-lineMid - spread} ${lineEnd} ${-lineMid - spread}`}/>
      <polyline id="path"
        points={`${lineStart + spread} ${-lineStart + spread}
        ${lineMid + spread} ${-lineMid + spread} ${lineEnd} ${-lineMid + spread}`}/>
      <polyline id="path"
        points={`${lineStart + spread} ${lineStart - spread}
        ${lineMid + spread} ${lineMid - spread} ${lineEnd} ${lineMid - spread}`}/>
      <polyline id="path"
        points={`${lineStart - spread} ${lineStart + spread}
        ${lineMid - spread} ${lineMid + spread} ${lineMid - spread} ${lineEnd}`}/>
      <polyline id="path"
        points={`${-lineStart + spread} ${lineStart + spread}
        ${-lineMid + spread} ${lineMid + spread} ${-lineEnd} ${lineMid + spread}`}/>
      <polyline id="path"
        points={`${-lineStart - spread} ${lineStart - spread}
        ${-lineMid - spread} ${lineMid - spread} ${-lineEnd} ${lineMid - spread}`}/>
      <polyline id="path"
        points={`${-lineStart - spread} ${-lineStart + spread}
        ${-lineMid - spread} ${-lineMid + spread} ${-lineEnd} ${-lineMid + spread}`}/>
      <polyline id="path"
        points={`${-lineStart + spread} ${-lineStart - spread}
        ${-lineMid + spread} ${-lineMid - spread} ${-lineMid + spread} ${-lineEnd}`}/>
    </>
  );
}

export default function background(props) {
  const {
    size,
    innerRadius,
    outerRadius,
    radius,
    lineMid,
    lineEnd,
    spread,
    circleRadius
  } = defaultProps(props);

  return (
    <div className='background-parent'>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <g id="boxes" transform="rotate(45 0 0)">
              <rect x={-1 * outerRadius} y={-1 * outerRadius} width={2 * outerRadius}
                height={2 * outerRadius} rx={radius} strokeWidth={size * 0.004}/>
              <rect x={-1 * innerRadius} y={-1 * innerRadius} width={2 * innerRadius}
                height={2 * innerRadius} rx={radius} strokeWidth={size * 0.004}/>
            </g>
            <g id="circles">
              <circle cx={lineEnd + circleRadius} cy={-lineMid - spread}
                r={circleRadius} strokeWidth={size * 0.004}/>
              <circle cx={lineEnd + circleRadius} cy={-lineMid + spread}
                r={circleRadius} strokeWidth={size * 0.004}/>

              <circle cx={lineEnd + circleRadius} cy={lineMid - spread}
                r={circleRadius} strokeWidth={size * 0.004}/>
              <circle cx={lineMid - spread} cy={lineEnd + circleRadius}
                r={circleRadius} strokeWidth={size * 0.004}/>

              <circle cx={-lineEnd - circleRadius} cy={lineMid + spread}
                r={circleRadius} strokeWidth={size * 0.004}/>
              <circle cx={-lineEnd - circleRadius} cy={lineMid - spread}
                r={circleRadius} strokeWidth={size * 0.004}/>

              <circle cx={-lineEnd - circleRadius} cy={-lineMid + spread}
                r={circleRadius} strokeWidth={size * 0.004}/>
              <circle cx={-lineMid + spread} cy={-lineEnd - circleRadius}
                r={circleRadius} strokeWidth={size * 0.004}/>
            </g>
          </g>
          <g
            id="electricity" transform={`translate(${size / 2}, ${size / 2})`}
            className="path" strokeWidth={(size * 0.004) + (size * 0.004)} fill="none"
            fillRule="evenodd" strokeLinejoin="round"
            strokeDasharray={`${size * 0.04},${size * 0.15}`} strokeDashoffset={size * 2}>
            {circuit(props)}
          </g>
          <g id="circuit" transform={`translate(${size / 2}, ${size / 2})`}
            strokeWidth={size * 0.004}>
            {circuit(props)}
          </g>
        </g>
      </svg>
    </div>
  );
}
