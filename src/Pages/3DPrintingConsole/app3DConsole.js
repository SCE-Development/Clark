import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './app3DConsole.css'
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
import axios from 'axios'
import Layout from '../../Components/Layout/Layout'

export default class Example extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      collapse: false,
      data: [],
      key: '',
      search: ''
    }
  }

  componentDidMount () {
    this.callDatabase()
  }

  handleToggle () {
    this.setState({ collapse: !this.state.collapse })
  }

  callDatabase () {
    axios
      .post('/api/3DPrintingForm/GetForm')
      // .then(result => {
      // console.log(result)
      // result.data.json()
      // })
      .then(result => {
        this.setState({
          data: result.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  deleteData (jsonObject) {
    axios
      .post('/api/3DPrintingForm/Delete3DForm', {
        name: jsonObject.name,
        color: jsonObject.color
      })
      .then(result => {
        console.log(result)
        this.callDatabase() // reload database
      })
      .catch(err => {
        console.log(err)
      })
  }

  updateProgress (jsonObject, event) {
    axios
      .post('/api/3DPrintingForm/edit', {
        name: jsonObject.name,
        progress: event.target.value
      })
      // .post('/api/3DPrintingForm/edit', { name: jsonObject.name, color: this.state.input })
      .then(result => {
        // console.log(result)
        this.callDatabase() // reload database
      })
      .catch(err => {
        console.log(err)
      })
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
  editData (jsonObject, key) {
    console.log('Print ')
    console.log(jsonObject.name)
    if (key == this.state.key){
      axios
        .post('/api/3DPrintingForm/edit', {
          name: jsonObject.name,
          color: this.state.input
        })
        // .post('/api/3DPrintingForm/edit', { name: jsonObject.name, color: this.state.input })
        .then(result => {
          // console.log(result)
          this.callDatabase() // reload database
        })
        .catch(err => {
          console.log(err)
        })
    }
  } */

  requestForm (jsonObject, key) {
    console.log(jsonObject)
    return (
      <FormGroup key={key}>
        <Card
          id='Jane'
          body
          onClick={this.handleToggle}
          inverse
          style={{ backgroundColor: '#333', borderColor: '#333' }}
        >
          {/* NAME */}
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

  search () {
    const search = this.state.search.trim()
    return search !== null || search !== ''
      ? this.state.data.filter(data => data.name.includes(this.state.search))
      : this.state.data
  }

  render () {
    return (
      <Layout>
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
      </Layout>
    )
  }
}
