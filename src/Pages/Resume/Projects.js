import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './exampleStyle.css';
class Projects extends React.Component{
  constructor() {
    super();
    this.state = {
      visibleButton: true
    };
  }
  handleClick = () => {
    if(this.props.numberItems<6){
      this.props.addProject();
      this.setState({ visibleButton: false });
    } else{
      alert('Max Number of Items Reached');
    }
  }
  handleChange = (event) => {
    this.props.handleChange(event, this.props.index, 'project');
  }
  render(){
    let btnVisible = this.state.visibleButton ?
      'customBtnVisible' : 'customBtnHidden';

    if(this.props.currentStep !== 4){
      return null;
    }
    const nameStyle = {
      margin: 'auto',
      width: '35%',
      fontFamily: 'Popper'
    };
    const descripStyle = {
      margin: 'auto',
      width: '35%',
      fontFamily: 'Popper'
    };
    return(
      <div>
        <FormGroup>
          <h5 class="labels"> {`Project ${this.props.id +1}`}</h5>
          <h1/>
          <h6 class ="labels"> Project Name </h6>
          <Input
            style = {nameStyle}
            name = "projectName"
            type="text"
            value = {this.props.projectName}
            onChange = {this.handleChange}
            placeholder="Type Project Name Here" />
          <h6 class ="labels"> Location of Project </h6>
          <Input
            style = {nameStyle}
            name = "projectLocation"
            type="text"
            value = {this.props.projectLocation}
            onChange = {this.handleChange}
            placeholder="Type The Location of Your Project Here" />
          <h6 class ="labels"> Tools Used </h6>
          <Input
            style = {nameStyle}
            name = "projectToolsUsed"
            type="text"
            value = {this.props.projectToolsUsed}
            onChange = {this.handleChange}
            placeholder="Type Tools Used Here" />
          <h6 class ="labels"> Start Date </h6>
          <Input
            style = {nameStyle}
            name = "projectStartDate"
            type="text"
            value = {this.props.projectStartDate}
            onChange = {this.handleChange}
            placeholder="Type The Start Date Here" />
          <h6 class ="labels"> End Date </h6>
          <Input
            style = {nameStyle}
            name = "projectEndDate"
            type="text"
            value = {this.props.projectEndDate}
            onChange = {this.handleChange}
            placeholder="Type The End Date Here (Type Present if ongoing)" />
          <h6 class ="labels"> Description Line 1 </h6>
          <textarea
            maxlength = "115"
            class = "textAreas"
            rows = "2"
            value = {this.props.projectDescription1}
            onChange = {this.handleChange}
            cols = "59"
            name = "projectDescription1"
            placeholder = "Type Description of Experience Here"/>
          <h6 class ="labels"> Description Line 2 </h6>
          <textarea
            maxlength = "115"
            class = "textAreas"
            rows = "2"
            value = {this.props.projectDescription2}
            onChange = {this.handleChange}
            cols = "59"
            name = "projectDescription2"
            placeholder = "Type Description of Experience Here"/>
          <h6 class ="labels"> Description Line 3 </h6>
          <textarea
            maxlength = "115"
            class = "textAreas"
            rows = "2"
            value = {this.props.projectDescription3}
            onChange = {this.handleChange}
            cols = "59"
            name = "projectDescription3"
            placeholder = "Type Description of Experience Here"/>
          <h1/>
          <button
            class={btnVisible}
            onClick={this.handleClick}>Add New Project </button>
          <h1/>
        </FormGroup>
      </div>
    );
  }
}
export default Projects;
