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
  Col,
} from 'reactstrap';
import { submit3DPrintRequest } from '../../APIFunctions/3DPrinting';
import mailImage from '../3DPrinting/gmail-icon.png';
import discordImage from '../3DPrinting/discord-icon.png';

export const footerNote = `Created with ❤️ by the SCE Development 
Team | Software and Computer Engineering Society at SJSU 
${new Date().getFullYear()}`;

export const mailIcon = <img id="mail-image" src={mailImage} />;

export const discordIcon = <img id="discord-image" src={discordImage} />;

let fill = false;
export default class PrintForm3D extends React.Component {
  constructor(props) {
    super(props);

    // Variables that will be send to data base
    this.state = {
      name: this.props.user.firstName + ' ' + this.props.user.lastName,
      color: 'Any color',
      url: '',
      projectType: '',
      contact: this.props.user.email,
      comment: '',
      user: this.props.user,
      isLoggedIn: this.props.authenticated,
      fill: false,
      error: '',
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
    } else if (this.state.color === 'Select a color') {
      this.setState({ error: 'You must provide a color' });
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
        progress: 'Pending',
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
      'Select a color',
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
      'Transparent',
    ];
    const reasons = ['Reason for usage', 'School-related project', 'Personal project'];

    return (
      <>


        {fill === false ? (
          <div className="plastic">
            <br />
            <br />
            <Container className="container-2D">
              <div className="buttons">
                <Button className="threeDPrinting printingBtn inactive"
                  href="/2DPrinting">
                  Paper Printing
                </Button>
                <Button
                  className="paperPrinting printingBtn active"
                  href="/3DPrintingForm"
                >
                  3D Printing
                </Button>
              </div>
              <div className='form-3d'>
                <Form className='forminputs3d'>

                  <FormGroup>
                    <Row>
                      {/* <Col>
                      <p className="printInfo colorSelect label">
                        Select a color:
                      </p>
                    </Col> */}
                      <Col className='colfor3dpage'>
                        <Input
                          type="select"
                          name="colors"
                          id="colors"
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
                      {/* <Col>
                      <p className="printInfo use label">Reason for usage:</p>
                    </Col> */}
                      <Col className='colfor3dpage'>
                        <Input
                          onChange={this.handleProjectTypeChange.bind(this)}
                          type="select"
                          name="projectType"
                          className="projectType"
                          id="projectType"
                          placeholder="Type of Project"
                        >
                          {reasons.map((choice, itr) => {
                            return <option key={itr}>{choice}</option>;
                          })}
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Row>
                      {/* <Col>
                      <p className="printInfo stlFile label">
                      URL to your .stl file:
                      </p>{' '}
                    </Col> */}
                      <Col className='colfor3dpage'>
                        <Input
                          onChange={this.handleUrlChange.bind(this)}
                          type="text"
                          id="url"
                          className="url"
                          placeholder='URL to your .stl file'
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Row>
                      {/* <Col>
                      <p className="printInfo additionalComments label">
                      Additional comments:
                      </p>
                    </Col> */}
                      <Col className='colfor3dpage'>
                        <Input
                          type='textarea'
                          onChange={this.handleCommentChange.bind(this)}
                          value={this.state.comment}
                          className="comments"
                          name="comments"
                          placeholder='Additional comments'
                          id="comments">
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                  <Button
                    className="submit"
                    onClick={this.submitApplication.bind(this)}
                  >
                    Submit
                  </Button>
                  <p id="error-message">Error: {this.state.error}</p>
                </Form>
                <p className='megan'>
                  Please reach out to Andrew Emerson (3D and Hardware Chair)
                  for any additional concerns. <br /> <div>{mailIcon}
                    andrew.emerson@sjsu.edu</div> <div>{discordIcon} AndrewE#6333</div>
                </p>
              </div>

            </Container>
            {/* <div className="footerNote">
              <p className='printInfo'>{footerNote}</p>
            </div> */}
          </div>
        ) : null}

        {fill === true ? (
          <div>
            <h3 id="submit-label-1">Your application has been submitted!</h3>
            <p id="submit-label-2">You may now return to the homepage!</p>
          </div>
        ) : null}
      </>
    );
  }
}
