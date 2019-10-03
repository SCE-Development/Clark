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
      forms: '',
      data: [],
      list: [1, 2, 3]
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

  changeInput (event) {
    this.setState({
      input: event.target.value
    })
  }

  editData (jsonObject) {
    console.log('Print ', jsonObject)
    console.log(jsonObject.name)
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

  requestForm (jsonObject, key) {
    console.log(jsonObject)
    return (
      <FormGroup key={key}>
        <Card
          id='Jane'
          onClick={this.handleToggle}
          body
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
                  <Button color='primary'>Pending</Button>
                  <Button color='info'>In Progress</Button>
                  <Button color='secondary'>Completed</Button>
                  <input onChange={this.changeInput.bind(this)} />
                  <Button
                    color='primary'
                    onClick={this.deleteData.bind(this, jsonObject)}
                  >
                    Delete
                  </Button>
                  <Button
                    color='primary'
                    onClick={this.editData.bind(this, jsonObject)}
                  >
                    Edit
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
      <Layout>
        <Container>
          <Form>
            <br />

            <br />
            {this.state.data.map((item, key) => this.requestForm(item, key))}
          </Form>
        </Container>
      </Layout>
    )
  }
}
