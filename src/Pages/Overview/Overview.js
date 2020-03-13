import React, { Component } from 'react';
import './Overview.css';
import OverviewProfile from './OverviewProfile.js';
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { membershipState } from '../../Enums';

export default class OverviewBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // All users array, update by callDatabase
      users: [],
      queryResult: [],
      toggle: false,
      currentQueryType: 'All',
      queryTypes: ['All', 'Pending', 'Officer', 'Admin']
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState(
        {
          authToken: this.props.user.token,
          currentUser: this.props.user.email,
          currentUserLevel: this.props.user.accessLevel
        },
        () => {
          this.callDatabase();
        }
      );
    }
  }

  async callDatabase() {
    const apiResponse = await getAllUsers(this.state.authToken);
    // console.log(apiResponse);

    if (!apiResponse.error) this.setState({ users: apiResponse.responseData });
  }

  updateQuery(value) {
    // taking care of empty values
    value = typeof value === 'undefined' ? '' : value;
    value = value.trim().toLowerCase();

    const userExists = user => {
      return (
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
      );
    };

    const { currentQueryType } = this.state;
    const filteredUsersByLevel = this.filterUserByAccessLevel(currentQueryType);
    const searchResult = filteredUsersByLevel.filter(data => userExists(data));
    const queryResult = searchResult.length
      ? searchResult
      : filteredUsersByLevel;

    this.setState({ queryResult });
  }

  filterUserByAccessLevel(accessLevel) {
    switch (accessLevel) {
    case 'Officer':
      return this.state.users.filter(
        data => data.accessLevel === membershipState.OFFICER
      );
    case 'Admin':
      return this.state.users.filter(
        data => data.accessLevel === membershipState.ADMIN
      );
    case 'Pending':
      return this.state.users.filter(
        data => data.accessLevel === membershipState.PENDING
      );
    default:
      return this.state.users;
    }
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  */
  async deleteUser(user) {
    const deleteEmailResponse = await deleteUserByEmail(
      user.email,
      this.state.authToken
    );
    if (!deleteEmailResponse.error) {
      if (user.email === this.state.currentUser) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
        return window.alert('Self-deprecation is an art');
      }
      this.setState({
        users: this.state.users.filter(
          child => !child.email.includes(user.email)
        )
      });
      this.setState({
        queryResult: this.state.queryResult.filter(
          child => !child.email.includes(user.email)
        )
      });
    }
  }

  handleToggle() {
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    return (
      <div className='layout'>
        <h1>Users Dashboard</h1>

        <h6 id='search-tag'>Search </h6>
        <ButtonDropdown
          isOpen={this.state.toggle}
          toggle={() => {
            this.handleToggle();
          }}
        >
          <DropdownToggle caret>{this.state.currentQueryType}</DropdownToggle>
          <DropdownMenu>
            {this.state.queryTypes.map((type, ind) => (
              <DropdownItem
                key={ind}
                onClick={() =>
                  this.setState({ currentQueryType: type }, () =>
                    this.updateQuery('#InvalidSearch#')
                  )}
              >
                {type}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>

        <input
          className='input-overview'
          placeholder="search by 'first name, last name, or email'"
          onChange={event => {
            this.updateQuery(event.target.value);
          }}
        />

        <table className='content-table' id='users'>
          <thead>
            <tr>
              {[
                'Name',
                'Door Code',
                'Printing',
                'Email Verified',
                'Membership Type',
                '',
                ''
              ].map((ele, ind) => {
                return <th key={ind}>{ele}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {this.state.queryResult.length > 0
              ? this.state.queryResult.map((user, index) => {
                return (
                  <OverviewProfile
                    key={index}
                    user={user}
                    index={index}
                    token={this.state.authToken}
                    callDatabase={this.callDatabase.bind(this)}
                    deleteUser={this.deleteUser.bind(this)}
                    updateQuery={() => {
                      this.setState(
                        { currentQueryType: 'All', queryResult: [] },
                        this.updateQuery('#InvalidSearch#')
                      );
                    }}
                  />
                );
              })
              : this.state.users.map((user, index) => {
                return (
                  <OverviewProfile
                    key={index}
                    user={user}
                    index={index}
                    token={this.state.authToken}
                    callDatabase={this.callDatabase.bind(this)}
                    deleteUser={this.deleteUser.bind(this)}
                    updateQuery={() => {
                      this.setState(
                        { currentQueryType: 'All', queryResult: [] },
                        this.updateQuery('#InvalidSearch#')
                      );
                    }}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
