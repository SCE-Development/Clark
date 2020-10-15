import React, { Component } from 'react';
import { getResume } from '../../APIFunctions/Resume';
import GeneralInformation from './GeneralInformation';
import Education from './Education';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import './resume.css';
import { Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter} from 'reactstrap';
  import Header from
  '../../Components/Header/Header.js';
class Resume extends Component {
  constructor(props) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this._addStuff = this._addStuff.bind(this);
    this.addProject = this.addProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNormalChange = this.handleNormalChange.bind(this);
    this.showConfirmation = this.showConfirmation.bind(this);
    this.hideConfirmation = this.hideConfirmation.bind(this);
    this.state = {
      projectInfo: [{
        projectName: '',
        projectLocation: '',
        projectToolsUsed: '',
        projectStartDate: '',
        projectEndDate: '',
        projectDescription1: '',
        projectDescription2: '',
        projectDescription3: '',
      }],
      experienceInfo: [{
        organizationName: '',
        positionTitle: '',
        experienceLocation: '',
        experienceStartDate: '',
        experienceEndDate: '',
        experienceDescription1: '',
        experienceDescription2: '',
        experienceDescription3: '',
      }],
      showingConfirmation: false,
      currentStep: 1,
      name: '',
      phone: '',
      email: '',
      github: '',
      schoolName: '',
      gradYear: '',
      titleMajor: '',
      college: '',
      GPA: '',
      relevantCoursework: '',
      skillsProficient: '',
      skillsExperienced: '',
      skillsFamiliar: '',
      numberItems: 2,
    };
  }

  showConfirmation = () => {
    this.setState({showingConfirmation: true});
  }
  hideConfirmation = () => {
    this.setState({showingConfirmation: false});
  }

  _next() {
    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 4 ? 5 : currentStep + 1;
    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep
    });
  }

  _addStuff() {
    let hecko = document.createElement('class', <Experience />);
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
      );
    }
    return null;
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 4) {
      return (
        <button
          class="customRight"
          onClick={this._next}>
          Next Page
        </button>
      );
    }
    return null;
  }
  handleNormalChange(event){
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleChange(event, index = null, type = null) {
    // check if index was sent as a parameter
    if(type === 'experience'){
      let experienceSlice = this.state.experienceInfo.slice();
      experienceSlice[index][event.target.name] = event.target.value;
      this.setState({ experienceInfo: experienceSlice });
    }
    if(type === 'project'){
      let projectSlice = this.state.projectInfo.slice();
      projectSlice[index][event.target.name] = event.target.value;
      this.setState({ projectInfo: projectSlice });
    }
  }


  handleSubmit = (event) => {
    event.preventDefault();
    this.showConfirmation();
    getResume(this.state);
  }

  addProject = (event) => {
    this.setState((prevState) => ({
      projectInfo: [...prevState.projectInfo, {
        projectName: '',
        projectLocation: '',
        projectToolsUsed: '',
        projectStartDate: '',
        projectEndDate: '',
        projectDescription1: '',
        projectDescription2: '',
        projectDescription3: ''
      }],
    }));
    this.setState({numberItems: this.state.numberItems+1});
  }

  addExperience = (event) => {
    this.setState((prevState) => ({
      experienceInfo: [...prevState.experienceInfo, {
        organizationName: '',
        positionTitle: '',
        experienceLocation: '',
        experienceStartDate: '',
        experienceEndDate: '',
        experienceDescription1: '',
        experienceDescription2: '',
        experienceDescription3: ''
      }],
    }));
    this.setState({numberItems: this.state.numberItems+1});
  }

  render() {
    const headerProps = {
      title: 'Resume Form'
    };
    
    let { projectInfo } = this.state;
    let { experienceInfo } = this.state;

    return (
      <div>
            <Header  {...headerProps}/>
        <Modal isOpen = {this.state.showingConfirmation}>
          <ModalHeader >
        Are you sure?
          </ModalHeader>
          <ModalBody>Once you confirm, your PDF will be downloaded.</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.hideConfirmation}>
            Go Back
            </Button>
            <Button color = "success"  onClick={this.hideConfirmation}>
            Confirm PDF Submission
            </Button>
          </ModalFooter>
        </Modal>
        <React.Fragment>
        <Row>
        <Col>
          <GeneralInformation
            name={this.state.name}
            phone={this.state.phone}
            email={this.state.email}
            github={this.state.github}
            currentStep={this.state.currentStep}
            handleChange={this.handleNormalChange}
          />
          </Col>
          <Col>
          <Education
            schoolName={this.state.schoolName}
            gradYear={this.state.gradYear}
            titleMajor={this.state.titleMajor}
            college={this.state.college}
            GPA={this.state.GPA}
            relevantCoursework={this.state.relevantCoursework}
            currentStep={this.state.currentStep}
            handleChange={this.handleNormalChange}
          />
          </Col>
          </Row>
          {
            experienceInfo.map((val, idx) => {

              return (
                <Experience
                  id={idx}
                  index={idx}
                  {...this.state.experienceInfo[idx]}
                  addExperience={this.addExperience}
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                  numberItems= {this.state.numberItems}
                />
              );
            })
          }
          {
            projectInfo.map((val, idx) => {

              return (
                <Projects
                  id={idx}
                  index = {idx}
                  {...this.state.projectInfo[idx]}
                  addProject={this.addProject}
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                  numberItems={this.state.numberItems}
                />

              );
            })
          }
          <Skills
            skillsProficient={this.state.skillsProficient}
            skillsExperienced={this.state.skillsExperienced}
            skillsFamiliar={this.state.skillsFamiliar}
            handleSubmit = {this.handleSubmit}
            currentStep={this.state.currentStep}
            handleChange={this.handleNormalChange}
          />
          {this.previousButton}
          {this.nextButton}

        </React.Fragment>
      </div>
    );

  }
}

export default Resume;
