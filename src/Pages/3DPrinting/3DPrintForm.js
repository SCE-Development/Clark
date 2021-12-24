import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './3D-print-form.css';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col
} from 'reactstrap';
import { submit3DPrintRequest } from '../../APIFunctions/3DPrinting';
import Header from
'../../Components/Header/Header.js';

let fill = false;
export default class PrintForm3D extends React.Component {
  constructor(props) {
    super(props);

    // Variables that will be send to data base
    this.state = {
      name: this.props.user.firstName + ' ' + this.props.user.lastName,
      color: 'Any Color',
      url: '',
      projectType: '',
      contact: this.props.user.email,
      comment: '',
      user: this.props.user,
      isLoggedIn: this.props.authenticated,
      fill: false,
      error: ''
    };
  }

  // function (e)
  // @parameter (e) events
  // methods: change state's values when called
  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleColorChange(e) {
    this.setState({ color: e.target.value });
  }

  handleUrlChange(e) {
    this.setState({ url: e.target.value });
  }

  handleProjectTypeChange(e) {
    this.setState({ projectType: e.target.value });
  }

  handleContactChange(e) {
    this.setState({ contact: e.target.value });
  }

  // Set comment's value = N/A when users doesn't provide any comment
  handleCommentChange(e) {
    if (e.target == null) {
      this.setState({ comment: 'N/A' });
    } else {
      this.setState({ comment: e.target.value });
    }
  }

  // Get current datetime
  date() {
    const date = new Date().getDate(); // Current Date
    const month = new Date().getMonth() + 1; // Current Month
    const year = new Date().getFullYear(); // Current Year
    const hours = new Date().getHours(); // Current Hours
    const min = new Date().getMinutes(); // Current Minutes
    return month + '/' + date + '/' + year + ' ' + hours + ':' + min;
  }

  checkIfFormFilled() {
    fill = true;
    if (this.state.name.length === 0) {
      this.setState({ error: 'You must provide your full name!' });
      fill = false;
    } else if (this.state.projectType.length === 0) {
      this.setState({ error: 'You must provide your type of project' });
      fill = false;
    } else if (this.state.url.length === 0) {
      this.setState({ error: 'You must provide a url' });
      fill = false;
    }
    if (!fill) {
      this.displayErrorMessage();
    }
    return fill;
  }

  // Displays error message if a form input is empty
  displayErrorMessage() {
    // Show error message
    document.getElementById('error-message').style.display = 'block';
  }

  async submitApplication() {
    if (this.checkIfFormFilled()) {
      const { email } = this.props.user;
      const { color, comment, contact, projectType, url } = this.state;
      const request = {
        name: this.props.user.firstName + ' ' + this.props.user.lastName,
        color,
        comment,
        contact,
        projectType,
        url,
        email,
        progress: 'Pending'
      };
      const submitStatus = await submit3DPrintRequest(request);
      if (!submitStatus.error) {
        this.setState({ fill: true });
      }
    }
  }

  render() {
    const { fill } = this.state;
    const printingColors = [
      'Any Color',
      'Black',
      'Blue',
      'Brown',
      'Green',
      'Grey',
      'Orange',
      'Red',
      'Pink',
      'Purple',
      'Yellow',
      'White',
      'Clear'
    ];
    const headerProps = {
      title: '3D Printing'
    };
    return (
      <>
        <Header {...headerProps} />
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
                      value={this.state.name}
                    />
                  </Col>

                  <Col>
                    <Input
                      type='select'
                      name='colors'
                      id='colors'
                      onChange={this.handleColorChange.bind(this)}
                    >
                      {printingColors.map((color, itr) => {
                        return <option key={itr}>{color}</option>;
                      })}
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
                <Label for='comments'>
                  {' '}
                  Do you have any special comments or requests we should know
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
              <p id='error-message'>Error: {this.state.error}</p>
            </Form>
          </Container>
        ) : null}

        {fill === true ? (
          <div>
            <h3 id='submit-label-1'>Your application has been submitted!</h3>
            <p id='submit-label-2'>You may now return to the homepage!</p>
          </div>
        ) : null}
      </>
    );
  }
}
