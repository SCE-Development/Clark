import React, { Component } from "react";
import { getResume } from "../../APIFunctions/Resume";
import GeneralInformation from "./GeneralInformation";
import Education from "./Education";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import './exampleStyle.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Resume extends Component {
  constructor(props) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this._addStuff = this._addStuff.bind(this);
    this.addProject = this.addProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      projectInfo: [{
        projectName: "", projectLocation: "", projectToolsUsed: "",
        projectStartDate: "", projectEndDate: "", projectDescription1: "",
        projectDescription2: "", projectDescription3: "",
      }],
      experienceInfo: [{
        organizationName: "", positionTitle: "", experienceLocation: "",
        experienceStartDate: "", experienceEndDate: "", experienceDescription1: "",
        experienceDescription2: "", experienceDescription3: "",
      }],
      currentStep: 1,
      name: "",
      phone: "",
      email: "",
      github: "",
      schoolName: "",
      gradYear: "",
      titleMajor: "",
      college: "",
      GPA: "",
      relevantCoursework: "",
      skillsProficient: "",
      skillsExperienced: "",
      skillsFamiliar: "",
    };
  }


  _next() {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 4 ? 5 : currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }

  _prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1 ? 1 : currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  _addStuff() {
    var hecko = document.createElement('class', <Experience />);
    document.body.appendChild(hecko);
  }

  get previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
        <button
          class="customLeft"
          onClick={this._prev}>
          Previous Page
        </button>
      )
    }
    return null;
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 5) {
      return (
        <button
          class="customRight"
          onClick={this._next}>
          Next Page
        </button>
      )
    }
    return null;
  }

  handleChange(event, index = null) {
    // check if index was sent as a parameter
    if (!!index) {
      // check if the thing to mofidy was experience or project
      // update the correct experience OR project at the index
    } else {
      console.log(event.target.name);
      console.log(event.target.value);
      let projectSlice = this.state.projectInfo.slice();
      let experienceSlice = this.state.experienceInfo.slice();
      var inProjects = false;
      var inExperience = false;
      for (var i in projectSlice) { //for each object in projectInfo
        for (var d in projectSlice[i]) { //for each component of each object
          if (d == event.target.name) {
            projectSlice[i][d] = event.target.value;
            this.setState({ projectInfo: projectSlice });
            inProjects = true;
            break;
          }
        }
      }
      for (var i in experienceSlice) { //for each object in projectInfo
        for (var d in experienceSlice[i]) { //for each component of each object
          if (d == event.target.name) {
            experienceSlice[i][d] = event.target.value;
            this.setState({ experienceInfo: experienceSlice });
            inExperience = true;
            break;
          }
        }
      }
      if (!(inExperience || inProjects) == true) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
          [name]: value
        })
      }
      console.log(this.state);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, name, phone, github, schoolName, gradYear, titleMajor, college, GPA, relevantCoursework, skillsProficient, skillsExperienced, skillsFamiliar, } = this.state;
    const eventResponse = getResume(this.state);
  }

  addProject = (e) => {
    this.setState((prevState) => ({
      projectInfo: [...prevState.projectInfo, {
        projectName: "", projectLocation: "", projectToolsUsed: "",
        projectStartDate: "", projectEndDate: "", projectDescription1: "",
        projectDescription2: "", projectDescription3: ""
      }],
    }));
    console.log(this.state.projectInfo);
  }

  addExperience = (e) => {
    this.setState((prevState) => ({
      experienceInfo: [...prevState.experienceInfo, {
        organizationName: "", positionTitle: "", experienceLocation: "",
        experienceStartDate: "", experienceEndDate: "", experienceDescription1: "",
        experienceDescription2: "", experienceDescription3: ""
      }],
    }));
    console.log(this.state.experienceInfo);
  }

  render() {
    document.body.style.background = 'rgba(173, 169, 169, 0.3)';
    document.body.style.paddingBottom = '150px';
    let { projectInfo } = this.state;
    let { experienceInfo } = this.state;
    return (
      <React.Fragment>
        <p> Step {this.state.currentStep} </p>

        <form onSubmit={this.handleSubmit}>
          <GeneralInformation
            name={this.state.name}
            phone={this.state.phone}
            email={this.state.email}
            github={this.state.github}
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
          />
          <Education
            schoolName={this.state.schoolName}
            gradYear={this.state.gradYear}
            titleMajor={this.state.titleMajor}
            college={this.state.college}
            GPA={this.state.GPA}
            relevantCoursework={this.state.relevantCoursework}
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
          />

          {
            experienceInfo.map((val, idx) => {
              let organizationName = `organizationName-${idx}`, positionTitle = `positionTitle-${idx}`, experienceLocation = `experienceLocation-${idx}`,
                experienceStartDate = `experienceStartDate-${idx}`, experienceEndDate = `experienceEndDate-${idx}`, experienceDescription1 = `experienceDescription1-${idx}`,
                experienceDescription2 = `experienceDescription2-${idx}`, experienceDescription3 = `experienceDescription3-${idx}`
              return (
                <Experience
                  id={idx}
                  index={idx}
                  {...this.state.experienceInfo[idx]}
                  addExperience={this.addExperience}
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                />
              )
            })
          }
          {
            projectInfo.map((val, idx) => {
              let projectNameId = `projectName-${idx}`, projectLocationId = `projectLocation-${idx}`, projectToolsUsed = `projectToolsUsed-${idx}`,
                projectStartDate = `projectStartDate-${idx}`, projectEndDate = `projectEndDate-${idx}`, projectDescription1 = `projectDescription1-${idx}`,
                projectDescription2 = `projectDescription2-${idx}`, projectDescription3 = `projetDescription3-${idx}`;
              return (
                <Projects
                  id={idx}
                  projectName={this.state.projectInfo[0].projectName}
                  projectToolsUsed={this.state.projectInfo[0].projectToolsUsed}
                  projectLocation={this.state.projectInfo[0].projectLocation}
                  projectStartDate={this.state.projectInfo[0].projectStartDate}
                  projectEndDate={this.state.projectInfo[0].projectEndDate}
                  projectDescription1={this.state.projectInfo[0].projectDescription1}
                  projectDescription2={this.state.projectInfo[0].projectDescription2}
                  projectDescription3={this.state.projectInfo[0].projectDescription3}
                  addProject={this.addProject}
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                />

              )
            })
          }
          <Skills
            skillsProficient={this.state.skillsProficient}
            skillsExperienced={this.state.skillsExperienced}
            skillsFamiliar={this.state.skillsFamiliar}

            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
          />
          {this.previousButton}
          {this.nextButton}


        </form>
      </React.Fragment>
    );
  }
}

export default Resume;
