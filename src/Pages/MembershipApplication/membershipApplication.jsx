import React from 'react'
import './membershipApplication.css'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import axios from 'axios'

export default class MembershipApplication extends React.Component {
  // @ctor
  constructor (props) {
    // Call parent constructor
    super(props)

    // Create a reference to the form component and success message
    this.formRef = React.createRef()
    this.epilogueRef = React.createRef()

    // Set initial state
    this.state = {
      firstName: '',
      middleInitial: '',
      lastName: '',
      email: '',
      password: '',
      major: '',
      usernameAvailable: false,
      usernameCheckClass: 'username-availability',
      usernameCheckResult: '',
      usernameCheckResultIcon: ''
    }
  }

  // @function        mutateFirstName()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutateFirstName (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new state
    tempState.firstName = e.target.value
    this.setState(tempState)
    // console.log("Firstname:", tempState.firstName);
  }

  // @function        mutateMiddleInitial()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutateMiddleInitial (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new state
    tempState.middleInitial = e.target.value
    this.setState(tempState)
  }

  // @function        mutateLastName()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutateLastName (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new stateid="applicationForm"
    tempState.lastName = e.target.value
    this.setState(tempState)
  }

  // @function        mutateEmail()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutateEmail (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new state
    tempState.email = e.target.value
    this.setState(tempState)
  }

  // @function        mutateUsername()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a

  checkIfUserExists () {
    if (!this.state.email) return

    axios
      .post('/api/user/checkIfUserExists', { email: this.state.email })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          this.setState({
            usernameCheckClass: 'username-availability available',
            usernameCheckResult: 'Username is available',
            usernameCheckResultIcon: '✔'
          })
        }
      })
      .catch(err => {
        this.setState({
          usernameCheckClass: 'username-availability unavailable',
          usernameCheckResult: 'Username is unavailable',
          usernameCheckResultIcon: '✘'
        })
        console.log(err)
      })
  }

  // @function        mutatePassword()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutatePassword (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new state
    tempState.password = e.target.value
    this.setState(tempState)
  }

  // @function        mutateMajor()
  // @description     This function handles input field changes for
  //                  the aforementioned field
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  mutateMajor (e) {
    // Create a copy of the current state
    var tempState = Object.assign(this.state)

    // Set the new state
    tempState.major = e.target.value
    this.setState(tempState)
  }

  // @function        submitApplication()
  // @description     This function form submission of this member
  //                  application
  // @parameters      (event) e       the javascript event passed
  //                                  to this handle when the input
  //                                  changes.
  // @returns         n/a
  submitApplication (e) {
    // Check that all required fields are populated
    var lacksRequiredFields = false
    if (this.state.firstName.length === 0) {
      window.alert('You must provide a first name!')
      lacksRequiredFields = true
    } else if (this.state.lastName.length === 0) {
      window.alert('You must provide a last name!')
      lacksRequiredFields = true
    } else if (this.state.email.length === 0) {
      window.alert('You must provide an email!')
      lacksRequiredFields = true
    } else if (this.state.password.length === 0) {
      window.alert('You must provide a password!')
      lacksRequiredFields = true
    } else if (this.state.password.length === 0) {
      window.alert('You must provide a password!')
      lacksRequiredFields = true
    }

    // Check if the username is correct / is available
    // Should probably be built out..
    if (this.state.usernameCheckClass !== 'username-availability available') return

    // Only proceed to submit if all required fields are present
    if (!lacksRequiredFields) {
      axios
        .post('/api/user/register', {
          firstName: this.state.firstName,
          middleInitial: this.state.middleInitial,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
          major: this.state.major
        })
        .then(result => {
          if (result.status >= 200 && result.status < 300) {
            this.setState({
              successfullyApplied: true
            })
          }
        })
        .catch(err => {
          if (err.response.status === 409) {
            window.alert('Email already exists in the system.')
          } else {
            console.error(err)
          }
          // window.alert('A submission error occurred. Please contact the site administrator')
        })
    }
  }

  // @function        render()
  // @description     This function renders the membership
  //                  application form
  // @parameters      n/a
  // @returns         (jsx) html      The generated html content
  render () {
    return (
      <div className='membership-application'>
        <h1 className='page-title'>Member Registration</h1>
        <div className='notice'>
          <span className='critical'>*</span><span className='important'> = This is a required field</span>
        </div>
        {
          !this.state.successfullyApplied
            ? (
              <Form className='page-form'>
                <h3>General Information</h3>
                <FormGroup>
                  <Label for='firstName'>First Name*</Label>
                  <Input type='text' onChange={this.mutateFirstName.bind(this)} value={this.state.firstName} name='firstName' id='input_firstName' placeholder='(e.g. John)' />
                </FormGroup>
                <FormGroup>
                  <Label for='middleInitial'>Middle Initial</Label>
                  <Input type='text' onChange={this.mutateMiddleInitial.bind(this)} value={this.state.middleInitial} name='middleInitial' id='input_middleInitial' placeholder='(e.g. J)' />
                </FormGroup>
                <FormGroup>
                  <Label for='lastName'>Last Name*</Label>
                  <Input type='text' onChange={this.mutateLastName.bind(this)} value={this.state.lastName} name='lastName' id='input_lastName' placeholder='(e.g. Doe)' />
                </FormGroup>

                <h3>Account Configuration</h3>
                <FormGroup>
                  <Label for='email'>Email*</Label>
                  <Input type='email' onChange={this.mutateEmail.bind(this)} onBlur={this.checkIfUserExists.bind(this)} value={this.state.email} name='email' id='input_email' placeholder='example@email.com' />
                </FormGroup>
                <div className={this.state.usernameCheckClass}>
                  {this.state.usernameCheckResultIcon} &nbsp;{this.state.usernameCheckResult}
                </div>
                <FormGroup>
                  <Label for='password'>Password*</Label>
                  <Input type='password' onChange={this.mutatePassword.bind(this)} value={this.state.password} name='password' id='input_password' placeholder='(e.g. sce_password)' />
                </FormGroup>
                <FormGroup>
                  <Label for='major'>Major</Label>
                  <Input type='text' onChange={this.mutateMajor.bind(this)} value={this.state.major} />
                </FormGroup>
                <Button onClick={this.submitApplication.bind(this)}>Submit</Button>
              </Form>)
            : null
        }
        {this.state.successfullyApplied
          ? (
            <div>
              <h3 style={{ margin: '1em' }}>
                              Your application has been submitted!
              </h3>
              <p style={{ margin: '2em' }}>
                              To activate your membership, verify your email address by clicking the link in the email we sent, and proceed to SCE (Engr 294) to complete registration and memberhip payment. You may now return to the homepage!
              </p>
            </div>) : null}
      </div>
    )
  }
}
