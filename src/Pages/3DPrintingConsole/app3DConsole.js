import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './app3DConsole.css'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  Container,
  Row,
  Col,
  Table
} from 'reactstrap'
import axios from 'axios'

export default class Example extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      collapse: false,
      data: [],
      key: '',
      search: '',
      width: window.innerWidth
    }
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  // update Data 1 when page load
  componentDidMount () {
    // update width of browser on resize
    window.addEventListener('resize', this.updateDimensions)

    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Immediately direct to /login if no jwtToken token present
    if (!token) {
      if (this.props.history) this.props.history.push('/login')
      return
    }

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    axios
      .post('/api/user/verify', { token })
      .then(res => {
        this.setState({
          isLoggedIn: true,
          authToken: token
        })
      })
      .catch(() => {
        if (this.props.history) this.props.history.push('/login')
      })

    this.callDatabase()
  }

  // Update card's collapse option
  handleToggle () {
    this.setState({ collapse: !this.state.collapse })
  }

  // Getting all data in DB
  callDatabase () {
    axios
      .post('/api/3DPrintingForm/GetForm')
      // .then(result => {
      // console.log(result)
      // result.data.json()
      // })
      .then(result => {
        // Save data from db to state.data
        this.setState({
          data: result.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  Search for object in db using name and color then delete
  */
  deleteData (jsonObject) {
    axios
      .post('/api/3DPrintingForm/delete', {
        name: jsonObject.name,
        color: jsonObject.color,
        // This token must be passed in for authentication
        token: this.state.authToken
      })
      .then(result => {
        console.log(result)
        this.callDatabase() // reload database
      })
      .catch(err => {
        console.log(err)
      })
  }

  /*
  Parameters: Json Object that will be updated and an onLick event with a value
  Search for object in db using its name and date
  Set new progress = event value
  */
  updateProgress (jsonObject, event) {
    axios
      .post('/api/3DPrintingForm/edit', {
        name: jsonObject.name,
        date: jsonObject.date,
        progress: event.target.value,
        token: this.state.authToken
      })
      .then(result => {
        this.callDatabase() // reload database
      })
      .catch(err => {
        console.log(err)
      })
  }

  search () {
    const search = this.state.search.trim().toLowerCase()
    return search !== null || search !== ''
      ? this.state.data.filter(data => data.name.toLowerCase().includes(search))
      : this.state.data
  }

  // update the width state based on width of browser
  updateDimensions () {
    this.setState({
      width: window.innerWidth
    })
  }

  // check and update window size on unmount
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions)
  }

  // Handle changes when need to edit (For sample not used)
  /* changeInput (event, key) {
    this.setState({
      input: event.target.value
    })
    this.setState({
      key: key
    })
    console.log(key)
  }
  /*
  Parameters: Json Object that will be updated and an onLick event with a value
  Search for object in db using its name
  Set new color = new value
  */
  /*
  editData (jsonObject, key) {
    console.log('Print ')
    console.log(jsonObject.name)
    if (key == this.state.key){
      axios
        .post('/api/3DPrintingForm/edit', {
          name: jsonObject.name,
          color: this.state.input
        })
        .then(result => {
          this.callDatabase() // reload database
        })
        .catch(err => {
          console.log(err)
        })
    }
  } */

  requestForm (jsonObject, key) {
    console.log(jsonObject)
    console.log(window.innerWidth)
    return (
      <FormGroup key={key}>
        <Card
          id='Jane'
          body
          onClick={this.handleToggle}
          inverse
          style={{ backgroundColor: '#333', borderColor: '#333' }}
        >
          <div>
            <Table dark>
              <thead>
                <tr>
                  <th>User's Request:</th>
                  <th>
                    {this.state.width < 767 ? (
                      <div class='popup'>
                        {jsonObject.name.length > 26
                          ? jsonObject.name.substring(0, 25) + '...'
                          : jsonObject.name}
                        <span class='popuptext' id='myPopup'>
                          {jsonObject.name}
                        </span>
                      </div>
                    ) : (
                      jsonObject.name
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope='row'>E-mail/Contact:</th>
                  <td>
                    {this.state.width < 767 ? (
                      <div class='popup'>
                        {jsonObject.projectContact.length > 26
                          ? jsonObject.projectContact.substring(0, 25) + '...'
                          : jsonObject.projectContact}
                        <span class='popuptext' id='myPopup'>
                          {jsonObject.projectContact}
                        </span>
                      </div>
                    ) : (
                      jsonObject.projectContact
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Requested Date:</th>
                  <td>{jsonObject.date}</td>
                </tr>
                <tr>
                  <th scope='row'>Progress:</th>
                  <td>{jsonObject.progress}</td>
                </tr>
              </tbody>
            </Table>

            <Row>
              <Col>
                <ButtonGroup>
                  <Button
                    color='primary'
                    value='Reject'
                    onClick={e => {
                      this.updateProgress(jsonObject, e)
                    }}
                  >
                    Reject
                  </Button>

                  <Button
                    color='info'
                    value='In Progress'
                    onClick={e => {
                      this.updateProgress(jsonObject, e)
                    }}
                  >
                    In Progress
                  </Button>

                  <Button
                    color='secondary'
                    value='Complete'
                    onClick={e => {
                      this.updateProgress(jsonObject, e)
                    }}
                  >
                    Completed
                  </Button>

                  <Button
                    color='primary'
                    onClick={this.deleteData.bind(this, jsonObject)}
                  >
                    Delete
                  </Button>

                  {/* Input + Update Json for testing not used (For Sample because it actually works)
                  <input onChange={(e) => {this.changeInput(e,key)}} />
                  <Button
                    color='primary'
                    onClick={this.editData.bind(this, jsonObject, key)}
                  >
                    Edit
                  </Button>
                  */}
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        </Card>

        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <Row>
                <Col xs='6' sm='4'>
                  Print Link: {jsonObject.projectLink}
                </Col>
                <Col xs='6' sm='3'>
                  Print Color: {jsonObject.color}
                </Col>
                <Col xs='6' sm='4'>
                  Comments: {jsonObject.projectComments}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Collapse>
      </FormGroup>
    )
  }

  render () {
    return (
      <Container>
        <Form>
          <br />
          <input
            onChange={e => {
              this.setState({ search: e.target.value })
            }}
          />
          <br />
          {this.search().map((item, key) => this.requestForm(item, key))}
        </Form>
      </Container>
    )
  }
}
