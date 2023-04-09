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
    var lineStart = props.innerRadius - props.lineStart
    var lineMid = props.outerRadius;
    var lineEnd = props.outerRadius * 2;    
    var radiusDifference = props.outerRadius - props.innerRadius;
    var spread = props.lineSpread * (2 * props.innerRadius);
    
    return (
        <>
            {/* (+/- lineStart  +/- spread), (+/- props.outerRadius +/- spread), (+/- (2 * props.outerRadius) +/- spread||0, +/-props.outerRadius +/- spread||0)  */}
            <polyline id="path" points={`${lineStart} ${-(lineStart)} ${lineMid + spread} ${-(lineMid) + spread} ${lineEnd} ${-(lineMid) - spread}`}></polyline> {/*(+,-),(-,-),(+,0)*/}
            <polyline id="path" points={`88 -22 175 -109 375 -109`}></polyline> {/*(+,-),(+,+),(+,0)*/}
            <polyline id="path" points={`88 22 175 109 375 109`}></polyline> {/*(+,+),(+,-),()*/}
            <polyline id="path" points={`22 88 109 175 109 375`}></polyline> {/*(+,+),(-,+)*/}
            <polyline id="path" points={`-22 88 -109 175 -375 175`}></polyline> {/*(-,+),(+,+)*/}
            <polyline id="path" points={`-88 22 -175 109 -375 109`}></polyline> {/*(-,+),(-,-)*/}
            <polyline id="path" points={`-88 -22 -175 -109 -375 -109`}></polyline> {/*(-,-),(-,+)*/}
            <polyline id="path" points={`-22 -88 -109 -175 -109 -375`}></polyline> {/*(-,-),(+,-)*/}
        </>
    );

}