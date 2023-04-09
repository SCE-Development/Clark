import React, { Component } from 'react';
import './background.css';

export default function background(props) {
    
    return (
        <div className='background-parent'>
            <svg width={props.size} height={props.size} viewBox={`0 0 ${props.size} ${props.size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g transform={`translate(${props.size / 2}, ${props.size / 2})`}>
                        <g id="boxes" transform="rotate(45 0 0)">
                            <rect x={-1 * props.outerRadius} y={-1 * props.outerRadius} width={2 * props.outerRadius} height={2 * props.outerRadius} rx={props.radius} strokeWidth={props.size * 0.002}/>
                            <rect x={-1 * props.innerRadius} y={-1 * props.innerRadius} width={2 * props.innerRadius} height={2 * props.innerRadius} rx={props.radius} strokeWidth={props.size * 0.002}/>
                        </g>
                        <circle cx="382" cy="-109" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                        <circle cx="382" cy="109" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                        <circle cx="382" cy="-175" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                        <circle cx="-382" cy="-109" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                        <circle cx="-382" cy="109" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                        <circle cx="-382" cy="175" r="7" stroke="#B8B8B8" strokeWidth={props.size * 0.002}/>
                    </g>
                    <g id="electricity" transform={`translate(${props.size / 2}, ${props.size / 2})`} class="path" strokeWidth={props.size * 0.006} fill="none" fillRule="evenodd"  strokeLinejoin="round" strokeDasharray="30,150" strokeDashoffset="2000">
                        {circuit(props)}
                    </g>
                    <g id="circuit" transform={`translate(${props.size / 2}, ${props.size / 2})`} strokeWidth={props.size * 0.002}>
                        {circuit(props)}
                    </g>
                </g>
            </svg>
        </div>
    );
}

//abstracts circuit
function circuit(props) {
    var lineStart = (props.innerRadius - props.lineStartOffset ) / Math.sqrt(2);
    var lineMid = props.outerRadius / Math.sqrt(2);
    var lineEnd = props.outerRadius * props.lineLength; 
    var radiusDifference = props.outerRadius - props.innerRadius;
    var spread = (props.lineSpread * props.innerRadius) / Math.sqrt(2);
    
    return (
        <>
            {/* <xDir,yDir>, <spreadXDir, spreadYDir>, <endXDir, endYDir> */}
            {/* (+/- lineStart  +/- spread), (+/- props.outerRadius +/- spread), (+/- (2 * props.outerRadius) +/- spread||0, +/-props.outerRadius +/- spread||0)  */}
            {/*(+,-),(-,-),(+,0)*/}
            <polyline id="path" points={`${lineStart - spread} ${-(lineStart) - spread} ${lineMid - spread} ${-(lineMid) - spread} ${lineEnd} ${-(lineMid) - spread}`}></polyline> 
            {/*(+,-),(+,+),(+,0)*/}
            <polyline id="path" points={`${lineStart + spread} ${-(lineStart) + spread} ${lineMid + spread} ${-(lineMid) + spread} ${lineEnd} ${-(lineMid) + spread}`}></polyline> 
            {/*(+,+),(+,-),(+,0)*/}
            <polyline id="path" points={`${lineStart + spread} ${lineStart - spread} ${lineMid + spread} ${lineMid - spread} ${lineEnd} ${lineMid - spread}`}></polyline> 
            {/*(+,+),(-,+),(0,+)*/}
            <polyline id="path" points={`${lineStart - spread} ${lineStart + spread} ${lineMid - spread} ${lineMid + spread} ${lineMid - spread} ${lineEnd}`}></polyline> 
            {/*(-,+),(+,+),(-,0)*/}
            <polyline id="path" points={`${-(lineStart) + spread} ${lineStart + spread} ${-(lineMid) + spread} ${lineMid + spread} ${-lineEnd} ${lineMid + spread}`}></polyline> 
            {/*(-,+),(-,-),(-,0)*/}
            <polyline id="path" points={`${-(lineStart) - spread} ${lineStart - spread} ${-(lineMid) - spread} ${lineMid - spread} ${-lineEnd} ${lineMid - spread}`}></polyline> 
            {/*(-,-),(-,+),(-,0)*/}
            <polyline id="path" points={`${-(lineStart) - spread} ${-(lineStart) + spread} ${-(lineMid) - spread} ${-(lineMid) + spread} ${-lineEnd} ${-(lineMid) + spread}`}></polyline> 
            {/*(-,-),(+,-),(0,-)*/}
            <polyline id="path" points={`${-(lineStart) + spread} ${-(lineStart) - spread} ${-(lineMid) + spread} ${-(lineMid) - spread} ${-(lineMid) + spread} ${-lineEnd}`}></polyline> 
        </>
    );

}