import React, { Component } from 'react';
//import SubmissionPage from './SubmissionPage.js';
import './OfficerApplication.css';

//import addToSpreadsheet from '../../'
//date time library --> 

class OfficerApplication extends Component {
    constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			gradMonth: '',
			gradYear: '',
			experience: '',
            linkedin: '',
            submitted: 'false'
        };
        this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleMonthChange = this.handleMonthChange.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleLinkedInChange = this.handleLinkedInChange.bind(this);
		this.handleExperienceChange = this.handleExperienceChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    refreshPage() {
        window.location.reload(false);
    }

	handleSubmit(e) {
        e.preventDefault();
		console.log('this happened');
        
        //alert(`Hi ${this.state.name}, your application has been submitted! Please wait 1-2 days for a confirmation email with next steps! Thank you!`);
       if (this.state.experience.indexOf("google.com") === -1){
           console.log("error: wrong resume link"); //alert pops up??  
       }
        //this.addToSpreadsheet().then(this.refreshPage);
        this.setState(
            {
                submitted: true
            }
        )
	}

	handleNameChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		});
	}

	handleMonthChange(e) {
		this.setState({
			gradMonth: e.target.value
		});
	}

	handleYearChange(e) {
		this.setState({
			gradYear: e.target.value
		});
	}

	handleLinkedInChange(e) {
		this.setState({
			linkedin: e.target.value
		});
	}

	handleExperienceChange(e) {
		this.setState({
            experience: e.target.value
		});
    }
    
    handleRefresh(e){
        this.setState({
            submitted: false
        })
    }
    
	render() { 
        return (
            <div className="ui equal width form" id="wrapper" onSubmit={this.handleSubmit}>
                <h2>SCE Officer Application 2020-21</h2>
                <form className="ui form" id="form-area">
                    <div className="required field">
                        <label htmlFor="full-name">Name</label>
                        <h5>Enter your first and last name</h5>
                        <input
                            type="text"
                            name="full-name"
                            placeholder="Full Name"
                            onChange={this.handleNameChange}
                            required
                        />
                    </div>
                    <div className="required field">
                        <label htmlFor="email">Email</label>
                        <h5>Enter your email address</h5>
                        <input
                            type="email"
                            name="email"
                            placeholder="john.doe@sjsu.edu"
                            onChange={this.handleEmailChange}
                            required
                        />
                    </div>
                    <div className="required field">
                        <label>Graduation Date</label>
                        <div className="two fields">
                            <div className="four width field">
                                <h5>Month</h5>
                                <input type="text" placeholder="MM" onChange={this.handleMonthChange} required />
                            </div>
                            <div className="four width field">
                                <h5>Year</h5>
                                <input type="text" placeholder="YYYY" onChange={this.handleYearChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="required field">
                        <label htmlFor="resume">Resume</label>
                        <h5>Share a link to your resume (pdf, docx, doc) using <u>Google Drive</u>.</h5>
                        <input type="url" placeholder="https://" onChange={this.handleExperienceChange} required></input>
                    </div>
                    <div className="field">
                        <label htmlFor="linkedin">LinkedIn</label>
                        <h5>Please enter the website URL</h5>
                        <input
                            type="url"
                            name="linkedin"
                            placeholder="https://www.linkedin.com/in/"
                            onChange={this.handleLinkedInChange}
                            
                        />
                    </div>
                    <button className="fluid large ui teal button" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        );
    }
		
}


export default OfficerApplication;
