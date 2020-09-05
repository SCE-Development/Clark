import React from 'react';
import {FormGroup, Input} from 'reactstrap';
import './resume.css';
class GeneralInformation extends React.Component{
  render(){
    if(this.props.currentStep !==1){
      return null;
    }
    const nameStyle = {
      margin: 'auto',
      width: '35%',
      fontFamily: 'Popper',
    };
    return(
      <div>
        <FormGroup>
          <h5 class ="labels"> General Information </h5>
          <h6 class ="labels"> Name </h6>
          <Input
            style = {nameStyle}
            type="text"
            name = "name"
            value = {this.props.name}
            onChange = {this.props.handleChange}
            placeholder="Type Name Here" />
        </FormGroup>
        <FormGroup>
          <h6 class ="labels"> Phone Number </h6>
          <Input
            style = {nameStyle}
            type="text"
            name = "phone"
            value = {this.props.phone}
            onChange = {this.props.handleChange}
            placeholder="Type Phone Number Here" />
        </FormGroup>
        <FormGroup>
          <h6 class ="labels"> Email </h6>
          <Input
            style = {nameStyle}
            type="text"
            name = "email"
            value = {this.props.email}
            onChange = {this.props.handleChange}
            placeholder="Type Email Address Here" />
        </FormGroup>
        <FormGroup>
          <h6 class ="labels"> Github </h6>
          <Input
            style = {nameStyle}
            type="text"
            name = "github"
            value = {this.props.github}
            onChange = {this.props.handleChange}
            placeholder="Type Github Address Here" />
        </FormGroup>
      </div>
    );
  }
}
export default GeneralInformation;
