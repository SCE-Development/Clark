import React from 'react'
import './OfficerDB.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Input } from 'reactstrap'
import InfoRow from './InfoRow'
import AdderModal from './Edits/Adder'
import {
  getUsers,
  getOfficers,
  deleteOfficer,
  editAccessLevel
} from '../../APIFunctions/OfficerDB'
import { addSymbol } from './SVG'

export default class OfficerDB extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleAdder: false,
      users: [],
      officers: [],
      queryOfficers: []
    }
  }

  async componentDidMount () {
    await this.getOfficers()
    this.setState({ users: await getUsers(this.props.user.token) })
  }

  async getOfficers () {
    this.setState({ officers: await getOfficers(this.props.user.token) }, () =>
      this.queryOfficers('')
    )
  }

  async deleteOfficer (officerEmail) {
    // delete officer!
    await deleteOfficer(officerEmail, this.props.user.token)
    // change user accessLevel to member-level
    await editAccessLevel(officerEmail, 0, this.props.user.token)
  }

  setToggle () {
    this.setState({ toggleAdder: !this.state.toggleAdder })
  }

  queryOfficers (query) {
    query
      ? this.setState({
        queryOfficers: this.state.officers.filter(officer =>
          officer.name
            .trim()
            .toLowerCase()
            .includes(query)
        )
      })
      : this.setState({ queryOfficers: this.state.officers })
  }

  render () {
    return (
      <div className='App'>
        <Input
          style={{ marginBottom: '10px' }}
          onChange={event =>
            this.queryOfficers(event.target.value.trim().toLowerCase())}
          placeholder='Search Name'
        />

        <header className='App-header'>
          <h1>Officer Page</h1>
        </header>
        <Table striped bordered hover variant='dark'>
          <thead>
            <tr>
              {['Name', 'Role', 'LinkedIn', 'Github', 'Quote', 'Edit'].map(
                (field, ind) => (
                  <th key={ind}>{field}</th>
                )
              )}
              <th
                onClick={() => {
                  this.setToggle()
                }}
              >
                {addSymbol()}
              </th>
              <AdderModal
                user={this.props.user}
                users={this.state.users}
                toggle={this.state.toggleAdder}
                getOfficers={() => this.getOfficers()}
                setToggle={() => {
                  this.setToggle()
                }}
              />
            </tr>
          </thead>

          <tbody>
            {this.state.queryOfficers.map((officer, index) => (
              <InfoRow
                {...officer}
                officer={officer}
                user={this.props.user}
                key={index}
                getOfficers={() => this.getOfficers()}
                deleteOfficer={emailToDelete =>
                  this.deleteOfficer(emailToDelete)}
              />
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}
