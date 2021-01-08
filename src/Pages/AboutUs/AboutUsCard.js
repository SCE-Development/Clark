import React from 'react';

function AboutUsCard(props){
    const {
        name, 
        quote,
        pictureUrl,
        position
    } = props.info;

    return (
        <div className="grid">
            <div className="card">
                <div className="top-card" style={{backgroundImage: `url(${pictureUrl})`}}>
                    <div className="bottom-card">
                        <p>{quote}</p>
                    </div>
                </div>
                <div className="card-container">
                    <h3>{name}</h3>
                    <h4>{position}</h4>
                </div>
            </div>
        </div>
    )
}
export default AboutUsCard;