      import React, { Component } from "react";
      import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
 class Education extends React.Component{
      render(){
            if(this.props.currentStep !==2){
                  return null
            }
 const nameStyle = {
      margin: "auto",
      width: "35%",
      fontFamily: "Popper"
    };

return(
    <div>
     <FormGroup>
      <h5 class ="labels"> Education </h5>
      <h1/>
      <h6 class ="labels">  University Name </h6>
      <Input style = {nameStyle} name = "schoolName" type="text" value = {this.props.schoolName} onChange = {this.props.handleChange} placeholder="Type University Name Here" />
      </FormGroup>
      <FormGroup>
       <h6 class ="labels"> Graduation Year </h6>
      <Input style = {nameStyle} name = "gradYear" type="text" value = {this.props.gradYear} onChange = {this.props.handleChange} placeholder="Type Graduation Year Here" />
      </FormGroup>
      <FormGroup>
      <h6 class ="labels"> Title And Major </h6>
      <Input style = {nameStyle} name = "titleMajor" type="text" value = {this.props.titleMajor} onChange = {this.props.handleChange} placeholder="Type Title and Major Here" />
      </FormGroup>
      <FormGroup>
      <h6 class ="labels"> College </h6>
      <Input style = {nameStyle} name = "college" type="text" value = {this.props.college} onChange = {this.props.handleChange} placeholder="Type College Here" />
      </FormGroup>
      <FormGroup>
      <h6 class ="labels"> Cumulative GPA </h6>
      <Input style = {nameStyle} name = "GPA" type="text" value = {this.props.GPA} onChange = {this.props.handleChange} placeholder="Type Cumulative GPA Here" />
      </FormGroup>
      <FormGroup>
      <h6 class ="labels"> Relevant Coursework </h6>
      <Input style = {nameStyle} name = "relevantCoursework" type="text" value = {this.props.relevantCoursework} onChange = {this.props.handleChange} placeholder="Type Relevant Coursework Here" />
      </FormGroup>
      </div>
     )
          }
      }
export default Education;