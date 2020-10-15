import React from 'react';
import {FormGroup, Input} from 'reactstrap';
import './resume.css';

class Skills extends React.Component{
  render(){

    if(this.props.currentStep !== 4){
      return null;
    }
    const nameStyle = {
      margin: 'auto',
      width: '35%',
      fontFamily: 'Popper'
    };
    return(
      <div>
        <FormGroup>
          <h5 class ="labels"> Skills </h5>
          <h6 class ="labels"> Skills I am Proficient With</h6>
          <Input
            style = {nameStyle}
            name = "skillsProficient"
            type="text"
            value = {this.props.skillsProficient}
            onChange = {this.props.handleChange}
            placeholder="Type Skills You are Proficient With" />
          <h6 class ="labels"> Skills I am Experienced With</h6>
          <Input
            style = {nameStyle}
            name = "skillsExperienced"
            type="text"
            value = {this.props.skillsExperienced}
            onChange = {this.props.handleChange}
            placeholder="Type Skills You are Experienced With" />
          <h6 class ="labels"> Skills I am Familiar With</h6>
          <Input
            style = {nameStyle}
            name = "skillsFamiliar"
            type="text"
            value = {this.props.skillsFamiliar}
            onChange = {this.props.handleChange}
            placeholder="Type Skills You are Familiar With" />
        </FormGroup>
        <button
          class = "customRight"
          onClick={this.props.handleSubmit}>Submit</button>
      </div>
    );
  }
}
export default Skills;
