import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
// import './index.css';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import axios from 'axios'
import Layout from '../../Components/Layout/Layout'

let fill = false
export default class Example extends React.Component {
  constructor (props) {
    super(props)

    // Variables that will be send to data base
    this.state = {
      name: '',
      color: '',
      url: '',
      projectType: '',
      contact: '',
      comment: '',
      user: {},
      modal: false,
      isLoggedIn: false
    }
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    if (token) {
      axios
        .post('/api/user/verify', { token })
        .then(res => {
          this.setState({
            user: res.data,
            isLoggedIn: true
          })
        })
        .catch(() => {
          if (this.props.history) this.props.history.push('/login')
          window.localStorage.removeItem('jwtToken')
        })
    } else {
      this.props.history.push('/login')
    }
  }

  // import modal ;

  // function (e)
  // @parameter (e) events
  // methods: change state's values when called
  handleNameChange (e) {
    this.setState({ name: e.target.value })
  }

  handleColorChange (e) {
    this.setState({ color: e.target.value })
  }

  handleUrlChange (e) {
    this.setState({ url: e.target.value })
  }

  handleProjectTypeChange (e) {
    this.setState({ projectType: e.target.value })
  }

  handleContactChange (e) {
    this.setState({ contact: e.target.value })
  }

  // handleModalChange (e) {
  //   if (true) {
  //     this.setState({ modal: true })
  //   } else {
  //     this.setState({ modal: false })
  //   }
  // }

  // Set comment's value = N/A when users doesn't provide any comment
  handleCommentChange (e) {
    if (e.target == null) {
      this.setState({ comment: 'N/A' })
    } else {
      this.setState({ comment: e.target.value })
    }
  }

  // handleModalChange (){
  //   if
  // }

  // Get current datetime
  date () {
    const date = new Date().getDate() // Current Date
    const month = new Date().getMonth() + 1 // Current Month
    const year = new Date().getFullYear() // Current Year
    const hours = new Date().getHours() // Current Hours
    const min = new Date().getMinutes() // Current Minutes
    return month + '/' + date + '/' + year + ' ' + hours + ':' + min
  }

  // Handle aplication submition
  submitApplication (e) {
    fill = true

    // Must Login
    if (!this.state.isLoggedIn) window.alert('Login!')

    // page is not filled if any information is not filled by the user
    if (this.state.name.length === 0) {
      window.alert('You must provide your full name!')
      fill = false
    } else if (
      this.state.color.length === 0 ||
      this.state.color === 'Select Color'
    ) {
      window.alert('You must provide a color')
      fill = false
    } else if (this.state.url.length === 0) {
      window.alert('You must provide a url')
      fill = false
    } else if (this.state.projectType.length === 0) {
      window.alert('You must provide your type of project')
      fill = false
    } else if (this.state.contact.length === 0) {
      window.alert('You must provide a contact')
      fill = false
    }

    // if all is passed, begin submition
    if (fill === true) {
      // var request = require('superagent')
      // var page = this
      // request
      // // axios
      //   .post(
      //     '/api/3DPrintingForm/submit'
      //   )
      //   .set('Content-Type', 'application/json;charset=utf-8')
      //   .send({
      //     // SCHEMA : current react state
      //     name: this.state.name,
      //     color: this.state.color,
      //     comment: this.state.comment,
      //     contact: this.state.contact,
      //     projectType: this.state.projectType,
      //     url: this.state.url,
      //     progress: 'Pending',
      //     date: this.date()
      //   })
      //   .end(
      //     function (err, response) {
      //       if (response && response.status < 300) {
      //         // Create a copy of the current state
      //         var tempState = Object.assign(this.state)
      //
      //         // Modify state to signal a close of the form,
      //         // and a reveal of a success message that provides the user
      //         // with further instructions
      //         tempState.successfullyApplied = true
      //
      //         // Set state
      //         this.setState(tempState)
      //       } else {
      //         // Failure
      //         // TODO: Respond with error
      //         window.alert(
      //           '(X.X)\tA submission error occurred. Please contact the site administrator'
      //         )
      //         console.error(err)
      //       }
      //     }.bind(this)
      //   )
      axios
        .post('/api/3DPrintingForm/submit', {
          name: this.state.name,
          color: this.state.color,
          comment: this.state.comment,
          contact: this.state.contact,
          projectType: this.state.projectType,
          url: this.state.url,
          progress: 'Pending',
          email: this.state.user.email
        })
        // .post('/api/3DPrintingForm/edit', { name: jsonObject.name, color: this.state.input })
        .then(result => {
          // console.log(result)
          // this.callDatabase() // reload database
          this.setState({
            successfullyApplied: true
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    this.setState({ filled: true })
  }

  render () {
    return (
      <Layout>
        {fill === false ? (
          <Container>
            <Form>
              <br />

              <br />

              <FormGroup>
                <Row>
                  <Col>
                    <Label for='name'>Full Name</Label>
                  </Col>
                  <Col>
                    <Label for='colors'>
                      {' '}
                      What color would you like your print to be?
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='Enter Full Name'
                      onChange={this.handleNameChange.bind(this)}
                    />
                  </Col>

                  <Col>
                    <Input
                      type='select'
                      name='colors'
                      id='colors'
                      onChange={this.handleColorChange.bind(this)}
                    >
                      <option>Select Color</option>
                      <option>Any Color</option>
                      <option>Black</option>
                      <option>Blue</option>
                      <option>Brown</option>
                      <option>Green</option>
                      <option>Grey</option>
                      <option>Orange</option>
                      <option>Red</option>
                      <option>Pink</option>
                      <option>Purple</option>
                      <option>Yellow</option>
                      <option>White</option>
                      <option>Clear</option>
                    </Input>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Row>
                  <Col>
                    <Label for='project'>
                      Is this for a school project or a personal project? <br />
                      (If a personal project, please explain what it's for)
                    </Label>
                  </Col>
                  <Col>
                    <Label for='url'>
                      Please copy the link to the .stl file you would like
                      printed. (NOTE: Maximum print dimensions are 25 x 21 x 21
                      cm){' '}
                    </Label>{' '}
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Input
                      onChange={this.handleProjectTypeChange.bind(this)}
                      type='text'
                      name='projectType'
                      id='projectType'
                      placeholder='Type of Project'
                    />
                  </Col>
                  <Col>
                    <Input
                      onChange={this.handleUrlChange.bind(this)}
                      type='url'
                      pattern='https://.*'
                      name='url'
                      id='url'
                      placeholder='Link to Project File'
                    />
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Row>
                  <Col>
                    <Label for='contact'>
                      How would you like to be contacted? (Phone number, email,
                      etc)
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Input
                      onChange={this.handleContactChange.bind(this)}
                      type='text'
                      name='contact'
                      id='contact'
                      placeholder='Contact Information'
                    />
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Label for='comments'>
                  {' '}
                  Do yo have any special comments or requests we should know
                  about?
                </Label>
                <Input
                  onChange={this.handleCommentChange.bind(this)}
                  value={this.state.comment}
                  type='text'
                  name='comments'
                  id='comments'
                  placeholder='Comments'
                />
              </FormGroup>

              <FormGroup>
                <Button
                  color='primary'
                  onClick={this.submitApplication.bind(this)}
                >
                  Submit
                </Button>
              </FormGroup>

              <div>
                <Button color='primary'> Review Submission </Button>
                <Modal isOpen={this.state.modal}>
                  <ModalHeader>Your Submission</ModalHeader>
                  <ModalBody>Order Submission.</ModalBody>
                  <ModalFooter>
                    <Button color='primary'>Cancel</Button>
                  </ModalFooter>
                </Modal>
              </div>
            </Form>
          </Container>
        ) : null}

        {fill === true ? (
          <div>
            <h3 style={{ margin: '1em' }}>
              Your application has been submitted!
            </h3>
            <p style={{ margin: '2em' }}>You may now return to the homepage!</p>
          </div>
        ) : null}
      </Layout>
    )
  }
}
