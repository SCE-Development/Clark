import React, { Component } from 'react';

export default function background(props) {

    return (
        <div className='background-parent'>
            <svg width="2000" height="2000" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g clip-path="url(#clip0_1_2)" transform="translate(1000, 1000)">
                        <g id="boxes" transform="rotate(45 0 0)">
                            <rect x="-200" y="-200" width="400" height="400" rx="23" stroke-width="4"/>
                            <rect x="-125" y="-125" width="250" height="250" rx="23" stroke-width="4"/>
                        </g>
                        <circle cx="382" cy="-109" r="7" stroke="#B8B8B8" stroke-width="4"/>
                        <circle cx="382" cy="109" r="7" stroke="#B8B8B8" stroke-width="4"/>
                        <circle cx="382" cy="-175" r="7" stroke="#B8B8B8" stroke-width="4"/>
                        <circle cx="-382" cy="-109" r="7" stroke="#B8B8B8" stroke-width="4"/>
                        <circle cx="-382" cy="109" r="7" stroke="#B8B8B8" stroke-width="4"/>
                        <circle cx="-382" cy="175" r="7" stroke="#B8B8B8" stroke-width="4"/>
                    </g>
                    <g id="electricity" transform="translate(1000, 1000)" class="path" stroke-width="6" fill="none" fill-rule="evenodd" stroke- stroke-linejoin="round" stroke-opacity="1" stroke-dasharray="30,150" stroke-dashoffset="2000">
                        <polyline id="path" points="125 -59 175 -109 375 -109"></polyline>
                        <polyline id="path" points="125 59 175 109 375 109"></polyline>
                        <polyline id="path" points="59 125 109 175 109 375"></polyline>
                        <polyline id="path" points="-59 125 -109 175 -375 175"></polyline>
                        <polyline id="path" points="-125 59 -175 109 -375 109"></polyline>
                        <polyline id="path" points="-125 -59 -175 -109 -375 -109"></polyline>
                        <polyline id="path" points="-59 -125 -109 -175 -109 -375"></polyline>
                        <polyline id="path" points="59 -125 109 -175 375 -175"></polyline>
                    </g>
                    <g id="circuit" transform="translate(1000, 1000)" stroke-width="4">
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
                        <rect width="2000" height="2000" fill="black"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}