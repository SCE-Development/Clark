import React from 'react'
import './officer-db.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from 'reactstrap'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: '',
      AnimationCSS1: {},
      AnimationCSS2: {},
      people: [
        {
          firstName: 'Surabhi',
          lastName: 'Gupta',
          linkedIn: '@surabhig',
          Github: 'surabhig',
          description: '....',
          major: 'Software Engineering'
        },
        {
          firstName: 'Zach',
          lastName: 'Menes',
          linkedIn: '@zachymemes',
          Github: 'zachMenes',
          description: '..ggg..',
          major: 'Computer Engineering'
        }
      ]
    }
  }

  // displaying each row of the map, used for mapping
  row = (person, index) => {
    return (
      <tr key={index}>
        <td>{parseInt(index) + 1}</td>
        <td>{person.firstName}</td>
        <td>{person.lastName}</td>
        <td>{person.linkedIn}</td>
        <td>{person.Github}</td>
        <td>{person.description}</td>
        <td>{person.major}</td>
      </tr>
    )
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1>Officer Page</h1>
        </header>
        <Table striped bordered hover variant='dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>LinkedIn</th>
              <th>Github</th>
              <th>Description</th>
              <th>Major</th>
            </tr>
          </thead>
          <tbody>
            {this.state.people.map((person, index) => {
              return this.row(person, index)
            })}
          </tbody>
        </Table>
      </div>
    )
  }
}
