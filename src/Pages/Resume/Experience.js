import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './exampleStyle.css';

class Experience extends React.Component {
  constructor() {
    super();
    this.state = {
      visibleButton: true
    }
  }
  handleClick = () => {
    if(this.props.numberItems<6){
      this.props.addExperience();
    this.setState({ visibleButton: false });
    }
    else{
      alert("Max Number of Items Reached");
    }
  }
  handleChange = (event) => {
    this.props.handleChange(event, this.props.index, "experience")
  }
  render() {
    let btn_Visible = (this.state.visibleButton) ? "customBtnVisible" : "customBtnHidden";

    if (this.props.currentStep !== 3) {
      return null;
    }
    const nameStyle = {
      margin: "auto",
      width: "35%",
      fontFamily: "Popper"
    };
    const descripStyle = {
      margin: "auto",
      width: "35%",
      fontFamily: "Popper"
    }

    return (
      <div>
        <FormGroup>
          <h5 class="labels"> {`Experience ${this.props.id + 1}`}</h5>
          <h1 />
          <h6 class="labels"> Organization / Company Name </h6>
          <Input style={nameStyle} type="text" name="organizationName" value={this.props.organizationName} onChange={this.handleChange} placeholder="Type The Name of the Organization or Company Here" />

          <h6 class="labels"> Position Title </h6>
          <Input style={nameStyle} type="text" name="positionTitle" value={this.props.positionTitle} onChange={this.handleChange} placeholder="Type The Title of Your Position Here" />

          <h6 class="labels"> Location </h6>
          <Input style={nameStyle} type="text" name="experienceLocation" value={this.props.experienceLocation} onChange={this.handleChange} placeholder="Type Location of Experience Here" />

          <h6 class="labels"> Start Date </h6>
          <Input style={nameStyle} type="text" name="experienceStartDate" value={this.props.experienceStartDate} onChange={this.handleChange} placeholder="Type The Start Date Here" />

          <h6 class="labels"> End Date </h6>
          <Input style={nameStyle} type="text" name="experienceEndDate" value={this.props.experienceEndDate} onChange={this.handleChange} placeholder="Type The End Date Here (Type 'Present' if ongoing)" />
          <h6 class="labels"> Description Line 1 </h6>
          <textarea name="" maxlength="115" class="textAreas" rows="2"  name="experienceDescription1" value={this.props.experienceDescription1} onChange={this.handleChange} placeholder="Type Description of Experience Here" />
          <h6 class="labels"> Description Line 2 </h6>
          <textarea maxlength="115" class="textAreas" rows="2"  name="experienceDescription2" value={this.props.experienceDescription2} onChange={this.handleChange} placeholder="Type Description of Experience Here" />
          <h6 class="labels"> Description Line 3 </h6>
          <textarea maxlength="115" class="textAreas" rows="2"  name="experienceDescription3" value={this.props.experienceDescription3} onChange={this.handleChange} placeholder="Type Description of Experience Here" />
          <h1 />
          <button class={btn_Visible} onClick={this.handleClick}>Add New Experience </button>
        </FormGroup>
      </div>
    )
  }
}
export default Experience;