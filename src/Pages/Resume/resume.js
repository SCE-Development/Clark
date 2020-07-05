import React, { Component } from "react";
import { getResume } from "../../APIFunctions/Resume";
class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      github: "",
      educationPart: "",
      education: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleGithubChange = this.handleGithubChange.bind(this);
    this.handleEducationChange = this.handleEducationChange.bind(this);
  }
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handlePhoneChange(event) {
    this.setState({ phone: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  handleGithubChange(event) {
    this.setState({ github: event.target.value });
  }
  handleEducationChange(event) {
    this.setState({ educationPart: event.target.value });
  }

  async handleSubmit(event) {
    var joined = this.state.education.concat(this.state.educationPart);
    this.setState({ education: joined });
    console.log(this.state);
    const eventResponse = getResume(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              value={this.state.phone}
              onChange={this.handlePhoneChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </label>
          <label>
            Github:
            <input
              type="text"
              value={this.state.github}
              onChange={this.handleGithubChange}
            />
            <label>
              Education:
              <input
                type="text"
                value={this.state.educationPart}
                onChange={this.handleEducationChange}
              />
            </label>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Resume;
