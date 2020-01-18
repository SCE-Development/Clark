import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './3D-console.css'
import {
  Button,
  ButtonGroup,
  Card,
  CardTitle,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  Container,
  Row,
  Col
} from 'reactstrap'
import {
  getAll3DPrintRequests,
  delete3DPrintRequest,
  update3DPrintRequestProgress
} from '../../APIFunctions/3DPrinting'

export default class PrintConsole3D extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      collapse: true,
      data: [],
      key: '',
      search: ''
    }
  }

  componentDidMount () {
    this.setState({
      isLoggedIn: this.props.authenticated,
      authToken: this.props.user.token
    })
    if (window.localStorage) this.callDatabase()
  }

  // Update card's collapse option
  handleToggle () {
    this.setState({ collapse: true })
  }

  // Getting all data in DB
  async callDatabase () {
    const data = await getAll3DPrintRequests()
    this.setState({
      data
    })
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  Search for object in db using name and color then delete
  */
  async deleteData (jsonObject) {
    await delete3DPrintRequest(jsonObject, this.state.authToken)
    this.callDatabase() // reload database
  }

  /*
  Parameters: Json Object that will be updated and an onLick event with a value
  Search for object in db using its name and date
  Set new progress = event value
  */
  async updateProgress (jsonObject, event) {
    const newProgress = event.target.value
    if (newProgress === jsonObject.progress) return
    const updateRequest = {
      progress: newProgress,
      email: jsonObject.email,
      date: jsonObject.date
    }
    await update3DPrintRequestProgress(updateRequest, this.state.authToken)
    this.callDatabase() // reload database
  }

  // simply filter array by name
  search () {
    const search = this.state.search.trim().toLowerCase()
    return search !== null || search !== ''
      ? this.state.data.filter(data => data.name.toLowerCase().includes(search))
      : this.state.data
  }

  requestForm (jsonObject, key) {
    return (
      <FormGroup key={key}>
        <Card
          id='Jane'
          body
          onClick={this.handleToggle}
          inverse
          style={{ backgroundColor: '#333', borderColor: '#333' }}
        >
          <CardTitle>{jsonObject.name + "'"}s Request</CardTitle>
          <div>
            <Row>
              <Col>E-mail/Contact:</Col>
              <Col>Requested Date:</Col>
              <Col>Progress:</Col>
              <Col />
            </Row>

            <Row>
              <Col>{jsonObject.projectContact}</Col>
              <Col id='secondRow'>{jsonObject.date}</Col>
              <Col id='secondRow'>{jsonObject.progress}</Col>

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
          Search:
          <input
            placeholder='By Name'
            style={{
              marginBottom: '5px',
              marginLeft: '5px'
            }}
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
