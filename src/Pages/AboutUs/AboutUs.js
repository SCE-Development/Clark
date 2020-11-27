import React, { Component } from 'react';
import './AboutUs.css';
import {createOfficer, deleteOfficer, editOfficer} from '../../APIFunctions/OfficerManager';

class AboutUs extends Component {
    state = {  }
    
    createOfficers(){
        const token = "random";
        const newOfficer = {
            name: "randomsss",
            email: "randoms@gmail.com",
            facebook: "facebooksss",
            github: "githubsss", 
            linkedin: "foreverrr", 
            team: "i donno",
            quote: "live let laugh",
            pictureUrl: "pictureeee"
        };
        const newOfficer1 = {
            name: "jane",
            email: "jane@gmail.com",
            facebook: "facebooksssjana",
            github: "githubsssjane", 
            linkedin: "foreverrrjane", 
            team: "i donno jane",
            quote: "live let laugh jane",
            pictureUrl: "pictureeee jane"
        };
        const newOfficer2 = {
            name: "janet",
            email: "janet@gmail.com",
            facebook: "facebooksssjanat",
            github: "githubsssjanet", 
            linkedin: "foreverrrjanet", 
            team: "i donno janet",
            quote: "live let laugh janet",
            pictureUrl: "pictureeee janet"
        };
        createOfficer(newOfficer, token);
        createOfficer(newOfficer1, token);
        createOfficer(newOfficer2, token);
        console.log("SUCCESS!!!");
    }

    deleteOfficers(){
        const officer = {
            name: "janet",
            email: "janet@gmail.com",
            facebook: "facebooksssjanat",
            github: "githubsssjanet", 
            linkedin: "foreverrrjanet", 
            team: "i donno janet",
            quote: "live let laugh janet",
            pictureUrl: "pictureeee janet"
        };
        const token = "";
        deleteOfficer(officer, token);
    }

    updateOfficer(){
        const officer = {
            name: "janet",
            email: "janet@gmail.com",
            facebook: "janet's facebook",
            github: "githubsssjanet", 
            linkedin: "foreverrrjanet", 
            team: "i donno janet",
            quote: "live let laugh janet",
            pictureUrl: "pictureeee janet"
        };
        const token = "";
        editOfficer(officer, token);
    }
    
    
    render() { 
        return (
            <body>
                <section className="exec-container">
                    <h1>Executive Team</h1>
                    <button type="button" color="primary" onClick={this.createOfficer}>Create Officer</button>
                    <div className="grid-container">
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>Architect</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="card">
                                <div className="top-card">
                                    <div className="bottom-card">
                                        <p>Some example textssssss</p>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <h3>John Doe</h3>
                                    <h4>President</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="officer-container">
                    <h1>Meet Our Team</h1>
                    <div className="grid-container-circle">
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="circle">
                                <div className="circle-container">
                                    <p>John</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </body>    
        );
    }
}
 
export default AboutUs;