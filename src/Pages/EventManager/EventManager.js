import React, { Component } from 'react'
import './App.css'
import {
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Button,
  Row,
  Modal,
  Form
} from 'react-bootstrap'
import $ from 'jquery'
import axios from 'axios'

class EventAdmin extends Component {
  state = {
    json_arr: [],
    create: false,
    edit: false,
    editIndex: null,
    view: false,
    viewIndex: null,
    date: null
  }

  handleMouseOver = id => {
    $('#' + id).css('visibility', 'visible')
  }

  handleMouseOut = id => {
    $('#' + id).css('visibility', 'hidden')
  }

  handleCreateOpen = () => {
    this.setState({
      create: true
    })
  }

  handleCreateClose = () => {
    this.setState({
      create: false
    })
  }

  handleCreateSubmit = e => {
    e.preventDefault()
    const inputObj = $('#create-event-form')
      .serializeArray()
      .reduce(function (a, x) {
        a[x.name] = x.value
        return a
      }, {})
    console.log(inputObj)
    axios
      .post('/api/event/createEvent', {
        id: inputObj.id,
        title: inputObj.title,
        description: inputObj.description,
        eventLocation: inputObj.eventLocation,
        date: inputObj.date,
        eventDate: inputObj.eventDate,
        datePosted: inputObj.datePosted,
        startTime: inputObj.startTime,
        endTime: inputObj.endTime,
        eventCategory: inputObj.eventCategory
      })
      .then(result => {
        // dynamically update the frontend
        const tempJsonArr = this.state.json_arr.slice()
        tempJsonArr.unshift(inputObj)
        console.log(tempJsonArr)
        this.setState({
          json_arr: tempJsonArr,
          create: false
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleDelete = id => {
    axios
      .post('/api/event/deleteEvent', {
        id: id
      })
      .then(result => {
        // dynamically update the frontend
        let index = null
        const temp = this.state.json_arr
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            index = i
            break
          }
        }
        temp.splice(index, 1)
        this.setState({
          json_arr: temp
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleViewOpen = id => {
    var index = 0
    for (var i = 0; i < this.state.json_arr.length; i++) {
      if (this.state.json_arr[i].id === id) {
        index = i
        break
      }
    }
    this.setState({
      view: true,
      viewIndex: index
    })
  }

  handleViewClose = () => {
    this.setState({
      view: false
    })
  }

  handleEditOpen = id => {
    var index = 0
    for (var i = 0; i < this.state.json_arr.length; i++) {
      if (this.state.json_arr[i].id === id) {
        index = i
        break
      }
    }
    this.setState({
      edit: true,
      editIndex: index
    })
  }

  handleEditClose = () => {
    this.setState({
      edit: false
    })
  }

  handleEditSubmit = e => {
    /* this.state.editIndex */
    e.preventDefault()
    const inputObj = $('#edit-event-form')
      .serializeArray()
      .reduce(function (a, x) {
        a[x.name] = x.value
        return a
      }, {})
    console.log(inputObj)
    axios
      .post('/api/event/editEvent', {
        title: inputObj.title,
        description: inputObj.description,
        eventLocation: inputObj.eventLocation,
        date: inputObj.date,
        eventDate: inputObj.eventDate,
        startTime: inputObj.startTime,
        endTime: inputObj.endTime,
        eventCategory: inputObj.eventCategory
      })
      .then(result => {
        // dynamically update the frontend
        const tempJsonArr = this.state.json_arr.slice()
        tempJsonArr[this.state.editIndex] = inputObj
        this.setState({
          json_arr: tempJsonArr,
          edit: false
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount () {
    const dateObj = new Date()
    const date = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    const dateString = month + '/' + date + '/' + year
    const d = dateString.toString()
    if (this.state.date === null) {
      this.setState({
        date: d
      })
    }
    axios.get('/api/event/getEvents').then(response => {
      console.log(response.data)
      this.setState({
        json_arr: response.data
      })
    })
  }

  render () {
    var events = this.state.json_arr.map(event => {
      return (
        <Row
          key={event.id}
          className='event-admin-card'
          onMouseOver={() => {
            this.handleMouseOver(event.id)
          }}
          onMouseOut={() => {
            this.handleMouseOut(event.id)
          }}
        >
          <Col md={2} className='event-admin-card-content event-admin-title'>
            <Row className='title'>
              <h4>
                <a>{event.title}</a>
              </h4>
            </Row>
            <Row className='actions' id={event.id}>
              <a
                onClick={() => {
                  this.handleViewOpen(event.id)
                }}
              >
                View{' '}
              </a>{' '}
              |
              <a
                onClick={() => {
                  this.handleEditOpen(event.id)
                }}
              >
                Edit{' '}
              </a>{' '}
              |
              <a
                onClick={() => {
                  this.handleDelete(event.id)
                }}
              >
                Delete{' '}
              </a>
            </Row>
          </Col>
          <Col md={3} className='event-admin-card-content event-admin-comments'>
            {event.description}
          </Col>
          <Col
            md={2}
            className='event-admin-card-content event-admin-post-date'
          >
            {event.date}
          </Col>
          <Col
            md={2}
            className='event-admin-card-content event-admin-event-date'
          >
            {event.eventDate}
          </Col>
          <Col md={2} className='event-admin-card-content event-admin-time'>
            {event.startTime}-{event.endTime}
          </Col>
        </Row>
      )
    })

    let editModal
    if (this.state.edit) {
      editModal = (
        <Modal show={this.state.edit} onHide={this.handleEditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.handleEditSubmit} id='edit-event-form'>
            <input type='hidden' name='id' defaultValue={Date.now()} />
            <input type='hidden' name='date' defaultValue={this.state.date} />
            <Modal.Body>
              <Form.Group controlId='formTitle'>
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='title'
                  defaultValue={this.state.json_arr[this.state.editIndex].title}
                />
              </Form.Group>
              <Form.Group controlId='formDescription'>
                <Form.Label>Event Description</Form.Label>
                <Form.Control
                  required
                  as='textarea'
                  rows='3'
                  name='description'
                  defaultValue={
                    this.state.json_arr[this.state.editIndex].description
                  }
                />
              </Form.Group>
              <Form.Group controlId='formCategory'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  required
                  as='select'
                  name='eventCategory'
                  defaultValue={
                    this.state.json_arr[this.state.editIndex].eventCategory
                  }
                >
                  <option>Social Event</option>
                  <option>Company Tour</option>
                  <option>Workshop</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='formLocation'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='eventLocation'
                  defaultValue={
                    this.state.json_arr[this.state.editIndex].eventLocation
                  }
                />
              </Form.Group>
              <Form.Group controlId='formDate'>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  required
                  type='date'
                  name='eventDate'
                  defaultValue={
                    this.state.json_arr[this.state.editIndex].eventDate
                  }
                />
              </Form.Group>
              <Form.Group controlId='formTime'>
                <Form.Label>Time</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      required
                      type='time'
                      name='startTime'
                      defaultValue={
                        this.state.json_arr[this.state.editIndex].startTime
                      }
                    />
                    <Form.Text className='text-muted'>Start Time</Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      required
                      type='time'
                      name='endTime'
                      defaultValue={
                        this.state.json_arr[this.state.editIndex].endTime
                      }
                    />
                    <Form.Text className='text-muted'>End Time</Form.Text>
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={this.handleEditClose}>
                Close
              </Button>
              <Button variant='primary' type='submit'>
                Update
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )
    }

    let viewModal
    if (this.state.view) {
      viewModal = (
        <Modal show={this.state.view} onHide={this.handleViewClose}>
          <Modal.Header closeButton>
            <Modal.Title>View Event</Modal.Title>
          </Modal.Header>
          <Form id='edit-event-form'>
            <Modal.Body>
              <Form.Group controlId='formTitle'>
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  disabled
                  type='text'
                  name='title'
                  defaultValue={this.state.json_arr[this.state.viewIndex].title}
                />
              </Form.Group>
              <Form.Group controlId='formDescription'>
                <Form.Label>Event Description</Form.Label>
                <Form.Control
                  disabled
                  as='textarea'
                  rows='3'
                  name='description'
                  defaultValue={
                    this.state.json_arr[this.state.viewIndex].description
                  }
                />
              </Form.Group>
              <Form.Group controlId='formCategory'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  disabled
                  as='select'
                  name='eventCategory'
                  defaultValue={
                    this.state.json_arr[this.state.viewIndex].eventCategory
                  }
                >
                  <option>Social Event</option>
                  <option>Company Tour</option>
                  <option>Workshop</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='formLocation'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  disabled
                  type='text'
                  name='eventLocation'
                  defaultValue={
                    this.state.json_arr[this.state.viewIndex].eventLocation
                  }
                />
              </Form.Group>
              <Form.Group controlId='formDate'>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  disabled
                  type='date'
                  name='eventDate'
                  defaultValue={
                    this.state.json_arr[this.state.viewIndex].eventDate
                  }
                />
              </Form.Group>
              <Form.Group controlId='formTime'>
                <Form.Label>Time</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      disabled
                      type='time'
                      name='startTime'
                      defaultValue={
                        this.state.json_arr[this.state.viewIndex].startTime
                      }
                    />
                    <Form.Text className='text-muted'>Start Time</Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      disabled
                      type='time'
                      name='endTime'
                      defaultValue={
                        this.state.json_arr[this.state.viewIndex].endTime
                      }
                    />
                    <Form.Text className='text-muted'>End Time</Form.Text>
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={this.handleViewClose}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )
    }

    return (
      <div>
        <Container className='event-admin-main'>
          <Row className='event-admin-actions'>
            <DropdownButton
              className='event-admin-actions-btn'
              id='dropdown-basic-button'
              variant='outline-success'
              title='Date'
              size='sm'
            >
              <Dropdown.Item href='#'>October 2019</Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              className='event-admin-actions-btn'
              id='dropdown-basic-button'
              variant='outline-success'
              title='Category'
              size='sm'
            >
              <Dropdown.Item href='#'>Social Event</Dropdown.Item>
              <Dropdown.Item href='#'>Company Tour</Dropdown.Item>
              <Dropdown.Item href='#'>Workshop</Dropdown.Item>
            </DropdownButton>
            <Button
              className='event-admin-actions-btn'
              variant='secondary'
              size='sm'
            >
              Apply Filter
            </Button>
            <Button
              className='event-admin-actions-btn'
              id='event-admin-actions-create-btn'
              onClick={() => {
                this.handleCreateOpen()
              }}
              variant='primary'
              size='sm'
            >
              Create Event
            </Button>
          </Row>
          <Row className='event-admin-label'>
            <Col md={2}>
              <h5>Event Title</h5>
            </Col>
            <Col md={3}>
              <h5>Description</h5>
            </Col>
            <Col md={2}>
              <h5>Post Date</h5>
            </Col>
            <Col md={2}>
              <h5>Event Date</h5>
            </Col>
            <Col md={2}>
              <h5>Event Time</h5>
            </Col>
          </Row>
          {events}
        </Container>
        <Modal show={this.state.create} onHide={this.handleCreateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Event</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.handleCreateSubmit} id='create-event-form'>
            <input type='hidden' name='id' value={Date.now()} />
            <input type='hidden' name='date' value={this.state.date} />
            <Modal.Body>
              <Form.Group controlId='formTitle'>
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='title'
                  placeholder='Enter Event Title'
                />
              </Form.Group>
              <Form.Group controlId='formDescription'>
                <Form.Label>Event Description</Form.Label>
                <Form.Control
                  required
                  as='textarea'
                  rows='3'
                  name='description'
                  placeholder='Enter Event Description'
                />
              </Form.Group>
              <Form.Group controlId='formCategory'>
                <Form.Label>Category</Form.Label>
                <Form.Control as='select' name='eventCategory'>
                  <option>Social Event</option>
                  <option>Company Tour</option>
                  <option>Workshop</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='formLocation'>
                <Form.Label>Location</Form.Label>
                <Form.Control required type='text' name='eventLocation' />
              </Form.Group>
              <Form.Group controlId='formDate'>
                <Form.Label>Date</Form.Label>
                <Form.Control required type='date' name='eventDate' />
              </Form.Group>
              <Form.Group controlId='formTime'>
                <Form.Label>Time</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control required type='time' name='startTime' />
                    <Form.Text className='text-muted'>Start Time</Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Control required type='time' name='endTime' />
                    <Form.Text className='text-muted'>End Time</Form.Text>
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={this.handleCreateClose}>
                Close
              </Button>
              <Button variant='primary' type='submit'>
                Create
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {editModal}
        {viewModal}
      </div>
    )
  }
}
export default EventAdmin
