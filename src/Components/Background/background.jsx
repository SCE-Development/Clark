import React, { Component } from 'react';
import './background.css';

export default function background(props) {
    //used for default props
    var size = props.size || Math.min(window.innerWidth, window.innerHeight);
    var innerRadius = props.innerRadius || size * 0.125;
    var outerRadius = props.outerRadius || size * 0.2;
    var lineSpread = props.lineSpread || 0.4;
    var endDistance = props.endDistance || 1.85;
    var radius = props.radius || 0;

    //used for circles
    var lineMid = outerRadius / Math.sqrt(2);
    var lineEnd = outerRadius * endDistance;
    var spread = (lineSpread * innerRadius) / Math.sqrt(2);
    var circleRadius = size * 0.007;
    
    return (
        <div className='background-parent'>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g transform={`translate(${size / 2}, ${size / 2})`}>
                        <g id="boxes" transform="rotate(45 0 0)">
                            <rect x={-1 * outerRadius} y={-1 * outerRadius} width={2 * outerRadius} height={2 * outerRadius} rx={radius} strokeWidth={size * 0.004}/>
                            <rect x={-1 * innerRadius} y={-1 * innerRadius} width={2 * innerRadius} height={2 * innerRadius} rx={radius} strokeWidth={size * 0.004}/>
                        </g>
                        <g>
                            <circle cx={lineEnd + circleRadius} cy={-lineMid - spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                            <circle cx={lineEnd + circleRadius} cy={-lineMid + spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                            
                            <circle cx={lineEnd + circleRadius} cy={lineMid - spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                            <circle cx={lineMid - spread} cy={lineEnd + circleRadius} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>

                            <circle cx={-lineEnd - circleRadius} cy={lineMid + spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                            <circle cx={-lineEnd - circleRadius} cy={lineMid - spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>

                            <circle cx={-lineEnd - circleRadius} cy={-lineMid + spread} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                            <circle cx={-lineMid + spread} cy={-lineEnd - circleRadius} r={circleRadius} stroke="#B8B8B8" strokeWidth={size * 0.004}/>
                        </g>
                        
                    </g>
                    <g id="electricity" transform={`translate(${size / 2}, ${size / 2})`} className="path" strokeWidth={size * 0.004} fill="none" fillRule="evenodd"  strokeLinejoin="round" strokeDasharray="30,150" strokeDashoffset="2000">
                        {circuit(props)}
                    </g>
                    <g id="circuit" transform={`translate(${size / 2}, ${size / 2})`} strokeWidth={size * 0.004}>
                        {circuit(props)}
                    </g>
                </g>
            </svg>
        </div>
    );
}

//abstracts circuit
function circuit(props) {
    //used for default props
    var size = props.size || Math.min(window.innerWidth, window.innerHeight);
    var innerRadius = props.innerRadius || size * 0.125;
    var outerRadius = props.outerRadius || size * 0.2;
    var lineSpread = props.lineSpread || 0.4;
    var endDistance = props.endDistance || 1.85;
    var lineStartOffset = props.lineStartOffset || 0;

    //placement variables
    var lineStart = (innerRadius - lineStartOffset ) / Math.sqrt(2);
    var lineMid = outerRadius / Math.sqrt(2);
    var lineEnd = outerRadius * endDistance;
    var spread = (lineSpread * innerRadius) / Math.sqrt(2);
    
    return (
        <>
            {/* <xDir,yDir>, <spreadXDir, spreadYDir>, <endXDir, endYDir> */}
            {/* (+/- lineStart  +/- spread), (+/- outerRadius +/- spread), (+/- (2 * outerRadius) +/- spread||0, +/-outerRadius +/- spread||0)  */}
            {/*(+,-),(-,-),(+,0)*/}
            <polyline id="path" points={`${lineStart - spread} ${-lineStart - spread} ${lineMid - spread} ${-lineMid - spread} ${lineEnd} ${-lineMid - spread}`}></polyline> 
            {/*(+,-),(+,+),(+,0)*/}
            <polyline id="path" points={`${lineStart + spread} ${-lineStart + spread} ${lineMid + spread} ${-lineMid + spread} ${lineEnd} ${-lineMid + spread}`}></polyline> 
            {/*(+,+),(+,-),(+,0)*/}
            <polyline id="path" points={`${lineStart + spread} ${lineStart - spread} ${lineMid + spread} ${lineMid - spread} ${lineEnd} ${lineMid - spread}`}></polyline> 
            {/*(+,+),(-,+),(0,+)*/}
            <polyline id="path" points={`${lineStart - spread} ${lineStart + spread} ${lineMid - spread} ${lineMid + spread} ${lineMid - spread} ${lineEnd}`}></polyline> 
            {/*(-,+),(+,+),(-,0)*/}
            <polyline id="path" points={`${-lineStart + spread} ${lineStart + spread} ${-lineMid + spread} ${lineMid + spread} ${-lineEnd} ${lineMid + spread}`}></polyline> 
            {/*(-,+),(-,-),(-,0)*/}
            <polyline id="path" points={`${-lineStart - spread} ${lineStart - spread} ${-lineMid - spread} ${lineMid - spread} ${-lineEnd} ${lineMid - spread}`}></polyline> 
            {/*(-,-),(-,+),(-,0)*/}
            <polyline id="path" points={`${-lineStart - spread} ${-lineStart + spread} ${-lineMid - spread} ${-lineMid + spread} ${-lineEnd} ${-lineMid + spread}`}></polyline> 
            {/*(-,-),(+,-),(0,-)*/}
            <polyline id="path" points={`${-lineStart + spread} ${-lineStart - spread} ${-lineMid + spread} ${-lineMid - spread} ${-lineMid + spread} ${-lineEnd}`}></polyline> 
        </>
    );

}