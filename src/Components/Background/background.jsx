import React, { Component } from 'react';
import './background.css';

export default function background(props) {

    return (
        <div className='background-parent'>
            <svg width={props.size} height={props.size} viewBox={`0 0 ${props.size} ${props.size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g clipPath="url(#clip0_1_2)" transform="translate(1000, 1000)">
                        <g id="boxes" transform="rotate(45 0 0)">
                            <rect x="-200" y="-200" width="400" height="400" rx="23" strokeWidth="4"/>
                            <rect x="-125" y="-125" width="250" height="250" rx="23" strokeWidth="4"/>
                        </g>
                        <circle cx="382" cy="-109" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                        <circle cx="382" cy="109" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                        <circle cx="382" cy="-175" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                        <circle cx="-382" cy="-109" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                        <circle cx="-382" cy="109" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                        <circle cx="-382" cy="175" r="7" stroke="#B8B8B8" strokeWidth="4"/>
                    </g>
                    <g id="electricity" transform="translate(1000, 1000)" class="path" strokeWidth="6" fill="none" fillRule="evenodd"  strokeLinejoin="round" strokeOpacity="1" strokeDasharray="30,150" strokeDashoffset="2000">
                        <polyline id="path" points="125 -59 175 -109 375 -109"></polyline>
                        <polyline id="path" points="125 59 175 109 375 109"></polyline>
                        <polyline id="path" points="59 125 109 175 109 375"></polyline>
                        <polyline id="path" points="-59 125 -109 175 -375 175"></polyline>
                        <polyline id="path" points="-125 59 -175 109 -375 109"></polyline>
                        <polyline id="path" points="-125 -59 -175 -109 -375 -109"></polyline>
                        <polyline id="path" points="-59 -125 -109 -175 -109 -375"></polyline>
                        <polyline id="path" points="59 -125 109 -175 375 -175"></polyline>
                    </g>
                    <g id="circuit" transform="translate(1000, 1000)" strokeWidth="4">
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