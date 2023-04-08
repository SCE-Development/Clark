import React, { Component } from 'react';
import './background.css';

export default function background(props) {

    return (
        <div className='background-parent'>
            <svg width={props.size} height={props.size} viewBox={`0 0 ${props.size} ${props.size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g clipPath="url(#clip0_1_2)" transform={`translate(${props.size / 2}, ${props.size / 2})`}>
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
                        <polyline id="path" points="125 -59 175 -109 375 -109"></polyline>
                        <polyline id="path" points="125 59 175 109 375 109"></polyline>
                        <polyline id="path" points="59 125 109 175 109 375"></polyline>
                        <polyline id="path" points="-59 125 -109 175 -375 175"></polyline>
                        <polyline id="path" points="-125 59 -175 109 -375 109"></polyline>
                        <polyline id="path" points="-125 -59 -175 -109 -375 -109"></polyline>
                        <polyline id="path" points="-59 -125 -109 -175 -109 -375"></polyline>
                        <polyline id="path" points="59 -125 109 -175 375 -175"></polyline>
                    </g>
                    <g id="circuit" transform={`translate(${props.size / 2}, ${props.size / 2})`} strokeWidth={props.size * 0.002}>
                        <polyline id="path" points="88 -22 175 -109 375 -109"></polyline>
                        <polyline id="path" points="88 22 175 109 375 109"></polyline>
                        <polyline id="path" points="22 88 109 175 109 375"></polyline>
                        <polyline id="path" points="-22 88 -109 175 -375 175"></polyline>
                        <polyline id="path" points="-88 22 -175 109 -375 109"></polyline>
                        <polyline id="path" points="-88 -22 -175 -109 -375 -109"></polyline>
                        <polyline id="path" points="-22 -88 -109 -175 -109 -375"></polyline>
                        <polyline id="path" points="22 -88 109 -175 375 -175"></polyline>
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_1_2">
                        <rect width={props.size} height={props.size} fill="black"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}